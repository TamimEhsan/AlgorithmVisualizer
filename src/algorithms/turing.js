let invertBitSteps = [
    ['q0','0','q0','1','R'],
    ['q0','1','q0','0','R'],
    ['q0','B','qe','B','R']
];
const inverBitMap = new Map();
for(let i=0;i<invertBitSteps.length;i++){
    inverBitMap.set( invertBitSteps[i][0]+","+invertBitSteps[i][1],[invertBitSteps[i][2],invertBitSteps[i][3],invertBitSteps[i][4]]  );
}

export function invertBit(state,read){

    if( !inverBitMap.get(state+","+read) ) return ['qe','B','R'];
    return inverBitMap.get(state+","+read);
}