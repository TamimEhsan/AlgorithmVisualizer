// Pure helpers for the Linked List visualizer.
//
// Data model:
//   nodes  : ordered array of { id, value } — physical left-to-right placement
//   nextOf : map id -> id | null            — next pointers (a tail->earlier entry = cycle)
//   prevOf : map id -> id | null            — prev pointers (doubly mode)
//
// At rest the array order equals the logical order, so head = nodes[0] and
// tail = nodes[last]. Operations mutate the array then re-derive links via
// linkify(). Reverse and cycle detection animate divergent links transiently.

let idCounter = 0;

export function makeNode(value) {
    return { id: ++idCounter, value };
}

// Rebuild forward next/prev maps from the array order.
export function linkify(nodes) {
    const nextOf = {};
    const prevOf = {};
    nodes.forEach((node, i) => {
        nextOf[node.id] = i + 1 < nodes.length ? nodes[i + 1].id : null;
        prevOf[node.id] = i - 1 >= 0 ? nodes[i - 1].id : null;
    });
    return { nextOf, prevOf };
}

export function buildList(values) {
    const nodes = values.map(makeNode);
    return { nodes, ...linkify(nodes) };
}

export function randomValues(count = 5, min = 1, max = 99) {
    return Array.from(
        { length: count },
        () => Math.floor(Math.random() * (max - min + 1)) + min
    );
}
