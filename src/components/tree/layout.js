// Tree layout helpers. A layout takes a logical tree and returns
//   { pos: { [id]: { x, y } }, cols, depth }
// where x is a column index (0..cols-1) and y is the depth. The canvas scales
// these into pixels. Binary layout preserves strict left/right (x by in-order
// index) which a tidy n-ary layout would not. (Buchheim is added in phase 2.)

// children of a node, handling both binary (left/right) and n-ary (children[])
export function childrenOf(node) {
    if (node.children) return node.children.filter(Boolean);
    return [node.left, node.right].filter(Boolean);
}

export function flattenTree(root) {
    const nodes = [];
    const edges = [];
    const walk = (node, parent) => {
        if (!node) return;
        nodes.push(node);
        if (parent) edges.push({ parent: parent.id, child: node.id });
        for (const c of childrenOf(node)) walk(c, node);
    };
    walk(root, null);
    return { nodes, edges };
}

// In-order x, depth y — keeps a single child on its correct side.
export function binaryLayout(root) {
    const pos = {};
    let idx = 0;
    let depth = 0;
    const walk = (node, d) => {
        if (!node) return;
        walk(node.left, d + 1);
        pos[node.id] = { x: idx++, y: d };
        if (d > depth) depth = d;
        walk(node.right, d + 1);
    };
    walk(root, 0);
    return { pos, cols: idx, depth };
}

// Buchheim tidy-tree layout for general n-ary trees (recursion trees). Ported
// from the recursion-tree's original Tree.js. Returns the same
// { pos, cols, depth } shape as binaryLayout; x positions are normalised so the
// leftmost node sits at x = 0.
export function buchheimLayout(root) {
    const dt = buchheim(root);
    const pos = {};
    let minX = Infinity;
    let maxX = -Infinity;
    let depth = 0;
    const collect = (d) => {
        pos[d.tree.id] = { x: d.x, y: d.y };
        if (d.x < minX) minX = d.x;
        if (d.x > maxX) maxX = d.x;
        if (d.y > depth) depth = d.y;
        for (const c of d.children) collect(c);
    };
    collect(dt);
    for (const id in pos) pos[id].x -= minX; // normalise so leftmost is 0
    return { pos, cols: maxX - minX + 1, depth };
}

class DrawTree {
    constructor(tree, parent = undefined, depth = 0, number = 1) {
        this.x = -1;
        this.y = depth;
        this.tree = tree;
        this.children = (tree.children || []).map(
            (child, i) => new DrawTree(child, this, depth + 1, i + 1),
        );
        this.parent = parent;
        this.thread = undefined;
        this.mod = 0;
        this.ancestor = this;
        this.change = 0;
        this.shift = 0;
        this._lmost_sibling = undefined;
        this.number = number;
    }

    left = () => this.thread || (this.children.length ? this.children[0] : undefined);
    right = () => this.thread || (this.children.length ? this.children[this.children.length - 1] : undefined);

    lbrother = () => {
        let n;
        if (this.parent) {
            for (const node of this.parent.children) {
                if (node === this) return n;
                n = node;
            }
        }
        return n;
    };

    get_lmost_sibling = () => {
        if (!this._lmost_sibling && this.parent && this !== this.parent.children[0]) {
            this._lmost_sibling = this.parent.children[0];
        }
        return this._lmost_sibling;
    };
}

function buchheim(tree) {
    const dt = firstwalk(new DrawTree(tree));
    const min = second_walk(dt);
    if (min < 0) third_walk(dt, -min);
    return dt;
}

function third_walk(tree, n) {
    tree.x += n;
    for (const c of tree.children) third_walk(c, n);
}

function firstwalk(v, distance = 1) {
    if (v.children.length === 0) {
        v.x = v.get_lmost_sibling() ? v.lbrother().x + distance : 0;
    } else {
        let default_ancestor = v.children[0];
        for (const w of v.children) {
            firstwalk(w);
            default_ancestor = apportion(w, default_ancestor, distance);
        }
        execute_shifts(v);
        const midpoint = (v.children[0].x + v.children[v.children.length - 1].x) / 2;
        const w = v.lbrother();
        if (w) {
            v.x = w.x + distance;
            v.mod = v.x - midpoint;
        } else {
            v.x = midpoint;
        }
    }
    return v;
}

function apportion(v, default_ancestor, distance) {
    const w = v.lbrother();
    if (w !== undefined) {
        let vir = v;
        let vor = v;
        let vil = w;
        let vol = v.get_lmost_sibling();
        let sir = v.mod;
        let sor = v.mod;
        let sil = vil.mod;
        let sol = vol.mod;
        while (vil.right() && vir.left()) {
            vil = vil.right();
            vir = vir.left();
            vol = vol.left();
            vor = vor.right();
            vor.ancestor = v;
            const shift = vil.x + sil - (vir.x + sir) + distance;
            if (shift > 0) {
                move_subtree(ancestor(vil, v, default_ancestor), v, shift);
                sir += shift;
                sor += shift;
            }
            sil += vil.mod;
            sir += vir.mod;
            sol += vol.mod;
            sor += vor.mod;
        }
        if (vil.right() && !vor.right()) {
            vor.thread = vil.right();
            vor.mod += sil - sor;
        } else {
            if (vir.left() && !vol.left()) {
                vol.thread = vir.left();
                vol.mod += sir - sol;
            }
            default_ancestor = v;
        }
    }
    return default_ancestor;
}

function move_subtree(wl, wr, shift) {
    const subtrees = wr.number - wl.number;
    wr.change -= shift / subtrees;
    wr.shift += shift;
    wl.change += shift / subtrees;
    wr.x += shift;
    wr.mod += shift;
}

function execute_shifts(v) {
    let shift = 0;
    let change = 0;
    for (let i = v.children.length - 1; i >= 0; i--) {
        const w = v.children[i];
        w.x += shift;
        w.mod += shift;
        change += w.change;
        shift += w.shift + change;
    }
}

// The original shipped a simplified Buchheim where this always fell through to
// default_ancestor; kept as-is so the recursion-tree layout is unchanged.
function ancestor(_vil, _v, default_ancestor) {
    return default_ancestor;
}

function second_walk(v, m = 0, depth = 0, min = undefined) {
    v.x += m;
    v.y = depth;
    if (min === undefined || v.x < min) min = v.x;
    for (const w of v.children) {
        min = second_walk(w, m + v.mod, depth + 1, min);
    }
    return min;
}
