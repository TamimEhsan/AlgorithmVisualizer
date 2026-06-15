// Red-Black tree — action-log planners for insert / delete / search.
//
// Node (rendered): { id, value, left, right, color: 'red' | 'black' }.
//
// Immutable RB delete with stable ids is painful, so each planner builds a
// MUTABLE working copy (parent pointers + a nil sentinel, ids preserved), runs
// the standard CLRS algorithm on it, and emits an immutable snapshot() as a
// `setTree` action after every rotation / recolor. The tree component then
// animates each step (nodes slide on rotations; fills fade on recolor).

import { searchActions as bstSearchActions } from './bst';

let counter = 0;

// A fresh context (working tree + nil sentinel) per operation, so the shared
// nil's transient parent pointers never leak across calls.
function rbContext(immutableRoot) {
    const nil = { id: null, value: null, color: 'black' };
    nil.left = nil.right = nil.parent = nil;
    const T = { root: nil };

    const build = (r) => {
        if (!r) return nil;
        const n = { id: r.id, value: r.value, color: r.color || 'black', left: nil, right: nil, parent: nil };
        n.left = build(r.left);
        if (n.left !== nil) n.left.parent = n;
        n.right = build(r.right);
        if (n.right !== nil) n.right.parent = n;
        return n;
    };
    T.root = build(immutableRoot);

    const snap = (n) => (n === nil ? null : { id: n.id, value: n.value, color: n.color, left: snap(n.left), right: snap(n.right) });

    const emit = (actions, activeId) => {
        if (!actions) return;
        actions.push({ type: 'setTree', tree: snap(T.root) });
        if (activeId) actions.push({ type: 'markNode', id: activeId, state: 'current' });
    };

    const minimum = (n) => {
        while (n.left !== nil) n = n.left;
        return n;
    };

    const leftRotate = (x) => {
        const y = x.right;
        x.right = y.left;
        if (y.left !== nil) y.left.parent = x;
        y.parent = x.parent;
        if (x.parent === nil) T.root = y;
        else if (x === x.parent.left) x.parent.left = y;
        else x.parent.right = y;
        y.left = x;
        x.parent = y;
    };

    const rightRotate = (x) => {
        const y = x.left;
        x.left = y.right;
        if (y.right !== nil) y.right.parent = x;
        y.parent = x.parent;
        if (x.parent === nil) T.root = y;
        else if (x === x.parent.right) x.parent.right = y;
        else x.parent.left = y;
        y.right = x;
        x.parent = y;
    };

    const transplant = (u, v) => {
        if (u.parent === nil) T.root = v;
        else if (u === u.parent.left) u.parent.left = v;
        else u.parent.right = v;
        v.parent = u.parent;
    };

    const insertFixup = (z, actions) => {
        while (z.parent.color === 'red') {
            if (z.parent === z.parent.parent.left) {
                const y = z.parent.parent.right; // uncle
                if (y.color === 'red') {
                    z.parent.color = 'black';
                    y.color = 'black';
                    z.parent.parent.color = 'red';
                    z = z.parent.parent;
                    emit(actions, z.id);
                } else {
                    if (z === z.parent.right) {
                        z = z.parent;
                        leftRotate(z);
                        emit(actions, z.id);
                    }
                    z.parent.color = 'black';
                    z.parent.parent.color = 'red';
                    rightRotate(z.parent.parent);
                    emit(actions, z.parent.id);
                }
            } else {
                const y = z.parent.parent.left; // uncle
                if (y.color === 'red') {
                    z.parent.color = 'black';
                    y.color = 'black';
                    z.parent.parent.color = 'red';
                    z = z.parent.parent;
                    emit(actions, z.id);
                } else {
                    if (z === z.parent.left) {
                        z = z.parent;
                        rightRotate(z);
                        emit(actions, z.id);
                    }
                    z.parent.color = 'black';
                    z.parent.parent.color = 'red';
                    leftRotate(z.parent.parent);
                    emit(actions, z.parent.id);
                }
            }
        }
        if (T.root.color !== 'black') {
            T.root.color = 'black';
            emit(actions, T.root.id);
        }
    };

    const insert = (value, actions) => {
        const z = { id: 'rb' + ++counter, value, color: 'red', left: nil, right: nil, parent: nil };
        let y = nil;
        let x = T.root;
        while (x !== nil) {
            y = x;
            x = value < x.value ? x.left : x.right;
        }
        z.parent = y;
        if (y === nil) T.root = z;
        else if (value < y.value) y.left = z;
        else y.right = z;
        emit(actions, z.id); // new red node slides in
        insertFixup(z, actions);
    };

    const deleteFixup = (x, actions) => {
        while (x !== T.root && x.color === 'black') {
            if (x === x.parent.left) {
                let w = x.parent.right;
                if (w.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    leftRotate(x.parent);
                    emit(actions, w.id);
                    w = x.parent.right;
                }
                if (w.left.color === 'black' && w.right.color === 'black') {
                    w.color = 'red';
                    emit(actions, w.id);
                    x = x.parent;
                } else {
                    if (w.right.color === 'black') {
                        w.left.color = 'black';
                        w.color = 'red';
                        rightRotate(w);
                        emit(actions, w.id);
                        w = x.parent.right;
                    }
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    w.right.color = 'black';
                    leftRotate(x.parent);
                    emit(actions, w.id);
                    x = T.root;
                }
            } else {
                let w = x.parent.left;
                if (w.color === 'red') {
                    w.color = 'black';
                    x.parent.color = 'red';
                    rightRotate(x.parent);
                    emit(actions, w.id);
                    w = x.parent.left;
                }
                if (w.right.color === 'black' && w.left.color === 'black') {
                    w.color = 'red';
                    emit(actions, w.id);
                    x = x.parent;
                } else {
                    if (w.left.color === 'black') {
                        w.right.color = 'black';
                        w.color = 'red';
                        leftRotate(w);
                        emit(actions, w.id);
                        w = x.parent.left;
                    }
                    w.color = x.parent.color;
                    x.parent.color = 'black';
                    w.left.color = 'black';
                    rightRotate(x.parent);
                    emit(actions, w.id);
                    x = T.root;
                }
            }
        }
        x.color = 'black';
        emit(actions, x === nil ? null : x.id);
    };

    const findNode = (value) => {
        let cur = T.root;
        while (cur !== nil && cur.value !== value) cur = value < cur.value ? cur.left : cur.right;
        return cur === nil ? null : cur;
    };

    const remove = (value, actions) => {
        let z = findNode(value);
        if (!z) return false;
        // two children: copy in-order successor's value into z (id preserved),
        // then physically remove the successor (which has at most one child)
        if (z.left !== nil && z.right !== nil) {
            const s = minimum(z.right);
            z.value = s.value;
            emit(actions, z.id); // value copied up
            z = s;
        }
        const child = z.left !== nil ? z.left : z.right;
        const removedColor = z.color;
        transplant(z, child);
        emit(actions, child === nil ? null : child.id);
        if (removedColor === 'black') deleteFixup(child, actions);
        return true;
    };

    return { T, snap, insert, remove, findNode };
}

export function fromValues(values) {
    let root = null;
    for (const v of values) {
        const ctx = rbContext(root);
        if (!ctx.findNode(v)) ctx.insert(v, null);
        root = ctx.snap(ctx.T.root);
    }
    return root;
}

function contains(root, value) {
    let cur = root;
    while (cur) {
        if (value === cur.value) return true;
        cur = value < cur.value ? cur.left : cur.right;
    }
    return false;
}

function pathTo(root, value) {
    const path = [];
    let cur = root;
    while (cur) {
        path.push(cur);
        if (value === cur.value) break;
        cur = value < cur.value ? cur.left : cur.right;
    }
    return path;
}

export function insertActions(tree, value) {
    const actions = [];
    for (const n of pathTo(tree, value)) actions.push({ type: 'markNode', id: n.id, state: 'current' });
    if (contains(tree, value)) {
        actions.push({ type: 'status', text: `${value} is already in the tree` });
        actions.push({ type: 'clear' });
        return actions;
    }
    const ctx = rbContext(tree);
    ctx.insert(value, actions);
    actions.push({ type: 'status', text: `Inserted ${value}` });
    return actions;
}

export function deleteActions(tree, value) {
    const actions = [];
    const path = pathTo(tree, value);
    for (const n of path) actions.push({ type: 'markNode', id: n.id, state: 'current' });
    const target = path[path.length - 1];
    if (!target || target.value !== value) {
        actions.push({ type: 'status', text: `${value} not found` });
        actions.push({ type: 'clear' });
        return actions;
    }
    actions.push({ type: 'markNode', id: target.id, state: 'remove' });
    const ctx = rbContext(tree);
    ctx.remove(value, actions);
    actions.push({ type: 'status', text: `Deleted ${value}` });
    return actions;
}

// search is the plain BST walk (RB nodes carry id/value/left/right)
export const searchActions = bstSearchActions;
