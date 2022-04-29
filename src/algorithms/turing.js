let Steps = [];
let Maps = [];
let invertBitSteps = [
    ['q0','0','q0','1','R'],
    ['q0','1','q0','0','R'],
    ['q0','B','qe','B','R']
];
const inverBitMap = new Map();
for(let i=0;i<invertBitSteps.length;i++){
    inverBitMap.set( invertBitSteps[i][0]+","+invertBitSteps[i][1],[invertBitSteps[i][2],invertBitSteps[i][3],invertBitSteps[i][4],i]  );
}
Steps.push(invertBitSteps);
Maps.push(inverBitMap);

let addOneSteps = [
    ['q0','0','q0','0','R'],
    ['q0','1','q0','1','R'],
    ['q0','B','q1','B','L'],
    ['q1','0','qe','1','R'],
    ['q1','1','q1','0','L'],
    ['q1','B','qe','1','R']
]
const addOneMap = new Map();
for(let i=0;i<addOneSteps.length;i++){
    addOneMap.set( addOneSteps[i][0]+","+addOneSteps[i][1],[addOneSteps[i][2],addOneSteps[i][3],addOneSteps[i][4],i]  );
}
Steps.push(addOneSteps);
Maps.push(addOneMap);


let twosComplimentSteps = [
    ['q0','0','q0','0','R'],
    ['q0','1','q0','1','R'],
    ['q0','B','q1','B','L'],
    ['q1','0','q1','0','L'],
    ['q1','B','qe','B','L'],
    ['q1','1','q2','1','L'],
    ['q2','0','q2','1','L'],
    ['q2','1','q2','0','L'],
    ['q2','B','qe','B','L']
]

const twosComplimentMap = new Map();
for(let i=0;i<twosComplimentSteps.length;i++){
    twosComplimentMap.set( twosComplimentSteps[i][0]+","+twosComplimentSteps[i][1],[twosComplimentSteps[i][2],twosComplimentSteps[i][3],twosComplimentSteps[i][4],i]  );
}
Steps.push(twosComplimentSteps);
Maps.push(twosComplimentMap);

export function getNextStep(state, read, algo=0){
    if( !Maps[algo].get(state+","+read) ) return ['qe','B','R'];
    return Maps[algo].get(state+","+read);
}

export function getTable(algo){
    return Steps[algo];
}