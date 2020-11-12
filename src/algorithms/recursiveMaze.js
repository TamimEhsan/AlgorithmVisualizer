export function getMaze(board,row,col){
    const pairs = [];
    let newBoard = board.slice();
    for( let i = 0;i <col;i++){
        newBoard[0][i].isWall = true;
        pairs.push({
            xx:0,
            yy:i
        });
    }
    for( let i = 0;i <row;i++){
        newBoard[i][col-1].isWall = true;
        pairs.push({
            xx:i,
            yy:col-1
        });
    }
    for( let i = col-1;i>=0;i-- ){
        newBoard[row-1][i].isWall = true;
        pairs.push({
            xx:row-1,
            yy:i
        });
    }
    for(let i = row-1;i>=0;i--){
        newBoard[i][0].isWall = true;
        pairs.push({
            xx:i,
            yy:0
        });
    }
    decideMaze(pairs,newBoard,1,row-2,1,col-2);
    //console.log("here");
    return pairs;
}
let val = 0;

function decideMaze(pairs,board,startRow,endRow,startCol,endCol) {
    //console.log("count");
    val++;

    if( ((endRow-startRow) <=1) && ((endCol - startCol) <=1) ){
        return;
    }

     if( (endCol - startCol) > (endRow - startRow) ){
        recursiveMazeVertical(pairs,board,startRow,endRow,startCol,endCol);
    } else{
        recursiveMazeHorizontal(pairs,board,startRow,endRow,startCol,endCol);
    }
}
function recursiveMazeVertical(pairs,board,startRow,endRow,startCol,endCol){
    let mid = Math.floor((endCol+startCol)/2);
    let random = Math.floor(Math.random() * (endRow-startRow+1)) + startRow;
    //console.log( "row ",random," ",startRow," ",endRow );
    let start = startRow;
    if( !board[startRow-1][mid].isWall ){
        random = start;
        start++;
    }
    let end = endRow;
    if( !board[endRow+1][mid].isWall ){
        random = end;
        end--;
    }
    for(let i = start;i<=end;i++){
        if( i!==random ){
            board[i][mid].isWall = true;
            pairs.push({
                xx:i,
                yy:mid
            });
        }
    }
    decideMaze(pairs,board,startRow,endRow,startCol,mid-1);
    decideMaze(pairs,board,startRow,endRow,mid+1,endCol);
}
function recursiveMazeHorizontal(pairs,board,startRow,endRow,startCol,endCol){
    let mid = Math.floor((endRow+startRow)/2);
  //  console.log("mid: ",mid);
    let random = Math.floor(Math.random() * (endCol-startCol+1)) + startCol;
    let start = startCol;
    if( !board[mid][startCol-1].isWall ){
        random = start;
        start++;
    }
    let end = endCol;
    if( !board[mid][endCol+1].isWall ){
        random = end;
        end--;
    }
    for(let i = start;i<=end;i++){
        if( i!==random ){
            board[mid][i].isWall = true;
            pairs.push({
                xx:mid,
                yy:i
            });
        }
    }
    decideMaze(pairs,board,startRow,mid-1,startCol,endCol);
    decideMaze(pairs,board,mid+1,endRow,startCol,endCol);

}