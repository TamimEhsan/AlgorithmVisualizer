// Recursion-tree builders + action planner for the tree component.
//
// Each builder returns a logical tree of nodes shaped for the tree component:
//   { id, value, ret, children: [] }
// where `value` is the call label shown in the node and `ret` is the return
// value, revealed as the node's secondary label on the way back up.

let counter = 0;
const nid = () => 'r' + counter++;

export function getTree(n, algo = 0, r = 0) {
    counter = 0;
    if (algo === 0) return fib(n);
    if (algo === 1) return NcR(n, r);
    if (algo === 2) return derangement(n);
    if (algo === 3) return bigmod(n, r);
    return stirling2(n, r);
}

// today's DFS reveal, expressed as an action list: lay out the full tree once
// (hidden), then reveal each node as it's entered (current → waiting → done)
// and set its return value as the secondary label on the way back up.
export function recursionActions(root) {
    const actions = [{ type: 'setTree', tree: root, hidden: true }];
    const visit = (node) => {
        actions.push({ type: 'markNode', id: node.id, state: 'current' });
        for (const child of node.children) {
            actions.push({ type: 'markNode', id: node.id, state: 'normal' }); // waiting on a child
            visit(child);
            actions.push({ type: 'markNode', id: node.id, state: 'current' }); // control returned
        }
        actions.push({ type: 'setLabel', id: node.id, secondary: '= ' + node.ret });
        actions.push({ type: 'markNode', id: node.id, state: 'visited' });
    };
    visit(root);
    return actions;
}

function fib(n) {
    const node = { id: nid(), value: '' + n, ret: n, children: [] };
    if (n < 2) return node;
    node.children.push(fib(n - 1));
    node.children.push(fib(n - 2));
    node.ret = node.children[0].ret + node.children[1].ret;
    return node;
}

function NcR(n, r) {
    const label = '(' + n + ',' + r + ')';
    if (r > n) return { id: nid(), value: label, ret: -1, children: [] };
    if (n === r) return { id: nid(), value: label, ret: 1, children: [] };
    if (r === 0) return { id: nid(), value: label, ret: 1, children: [] };

    // nCr(n, r) = nCr(n - 1, r - 1) + nCr(n - 1, r)
    const node = { id: nid(), value: label, ret: 0, children: [] };
    node.children.push(NcR(n - 1, r - 1));
    node.children.push(NcR(n - 1, r));
    node.ret = node.children[0].ret + node.children[1].ret;
    return node;
}

function derangement(n) {
    const label = '' + n;
    if (n === 0) return { id: nid(), value: label, ret: 1, children: [] };
    if (n === 1) return { id: nid(), value: label, ret: 0, children: [] };
    const node = { id: nid(), value: label, ret: 0, children: [] };
    node.children.push(derangement(n - 1));
    node.children.push(derangement(n - 2));
    node.ret = (n - 1) * (node.children[0].ret + node.children[1].ret);
    return node;
}

function bigmod(n, r) {
    const label = '(' + n + ',' + r + ')';
    if (r === 0) return { id: nid(), value: label, ret: 1, children: [] };
    if (r === 1) return { id: nid(), value: label, ret: n, children: [] };
    const node = { id: nid(), value: label, ret: 1, children: [] };
    if (r % 2 === 1) {
        node.children.push(bigmod(n, (r - 1) / 2));
        node.children.push(bigmod(n, (r - 1) / 2));
        node.children.push(bigmod(n, 1));
    } else {
        node.children.push(bigmod(n, r / 2));
        node.children.push(bigmod(n, r / 2));
    }
    for (const child of node.children) node.ret *= child.ret;
    return node;
}

function stirling2(n, r) {
    const label = '(' + n + ',' + r + ')';
    if (n === r) return { id: nid(), value: label, ret: 1, children: [] };
    if (r === 0) return { id: nid(), value: label, ret: 0, children: [] };
    const node = { id: nid(), value: label, ret: 0, children: [] };
    node.children.push(stirling2(n - 1, r));
    node.children.push(stirling2(n - 1, r - 1));
    node.ret = node.children[0].ret * r + node.children[1].ret;
    return node;
}
