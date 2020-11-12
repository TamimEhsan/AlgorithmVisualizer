export function randomMaze(board,row,col){
    let newBoard = board.slice();
    const pairs = [];
    for(let i = 0;i<row;i++){
        for( let j = 0;j <col;j++){
            const random = Math.floor(Math.random()*100)+10;
            if( random%4 === 0 ){
                newBoard[i][j].isWall = true;
                pairs.push({
                    xx:i,
                    yy:j
                });
            }
        }
    }
    return pairs;
}