let values = [];

export function quickSort(rects2){
    let rects = rects2.slice();
    values = [];
    let sz = rects2.length;
    // console.log( "fdsfsd",sz );
    sz = sz-1;
    quick(rects,0,sz);
    for(var i=0;i<=sz;i++){
        values.push({
            xx:i,
            yy:i,
            changed:true
        })
    }
    return values;
}


function getPartition(rects, left, right){
    let pivot = rects[right].width
    let it = left-1;
    for(var j=left;j<=right-1;j++){
        if( rects[j].width< pivot){
            it++;
            if( it!==j ){
                // swap(rects[it],rects[j];
                const rect1 = {...rects[it]};
                const rect2 = {...rects[j]};
                rects[it] = rect2;
                rects[j] = rect1;
                values.push({
                    xx:it,
                    yy:j,
                    changed:true
                })
            }
        }
    }
    if( it+1!==right ){
        const rect1 = {...rects[it+1]};
        const rect2 = {...rects[right]};
        rects[it+1] = rect2;
        rects[right] = rect1;
        values.push({
            xx:it+1,
            yy:right,
            changed:true
        })
    }
    return it+1;
}
function quick(rects,left,right){
    if( left>=right ) return ;
    const partition = getPartition(rects,left,right);
    quick(rects,left,partition-1);
    quick(rects,partition+1,right);
}