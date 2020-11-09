export function bubbleSort2(rects ){
    const pairs = [];
    const num  = rects.length;
    const prevRect = rects.slice();

    for( let i = 0; i<num; i++ ){
        for( let j = i+1;j<num;j++ ){
            if( prevRect[i].width>prevRect[j].width ){
                const recti = {...prevRect[i]};
                const rectj = {...prevRect[j]};
                prevRect[j] = recti;
                prevRect[i] = rectj;
                pairs.push( {
                    xx:i,
                    yy:j,
                    changed:true
                } );
            } else{
                pairs.push( {
                    xx:i,
                    yy:j,
                    changed:false
                });
            }
            if( j === num-1 ){
                pairs.push( {
                    xx:i,
                    yy:i,
                    changed:false
                });
            }
        }
    }
    return pairs;
}

export function selectionSort(arr) {
    const pairs = [];
    let n = arr.length;
    const prevRect = arr.slice();
    // One by one move boundary of unsorted subarray
    for (let i = 0; i < n-1; i++)
    {
        let min_idx = i;
        for (let j = i+1; j < n; j++){
            pairs.push( {
                xx:min_idx,
                yy:j,
                changed:false
            } );
            if (prevRect[j].width < prevRect[min_idx].width){
                min_idx = j;
            }
        }

        // Swap the found minimum element with the first
        // element
        const recti = {...prevRect[i]};
        const rectj = {...prevRect[min_idx]};
        prevRect[min_idx] = recti;
        prevRect[i] = rectj;
        pairs.push( {
            xx:min_idx,
            yy:i,
            changed:true
        } );
        pairs.push( {
            xx:i,
            yy:i,
            changed:false
        });
    }
    pairs.push({
            xx:n-1,
            yy:n-1,
            changed:false
        }
    )
    return pairs;
}

export function bubbleSort(arr){
    const pairs= [];
    let n = arr.length;
    const prevRect = arr.slice();
    for (let i = 0; i < n-1; i++){
        for (let j = 0; j < n-i-1; j++){
            if (prevRect[j].width > prevRect[j+1].width) {
                // swap arr[j+1] and arr[j]
                const recti = {...prevRect[j]};
                const rectj = {...prevRect[j+1]};
                prevRect[j+1] = recti;
                prevRect[j] = rectj;
                pairs.push( {
                    xx:j,
                    yy:j+1,
                    changed:true
                } );
            } else{
                pairs.push( {
                    xx:j,
                    yy:j+1,
                    changed:false
                } );
            }
            if( j === n-i-2 ){
                pairs.push( {
                    xx:n-i-1,
                    yy:n-i-1,
                    changed:false
                } );
            }
        }
    }
    pairs.push({
            xx:0,
            yy:0,
            changed:false
        }
    )
    return pairs;
}

export function insertionSort(arr){
    const pairs = [];
    let n = arr.length;
    const prevRect = arr.slice();
    for (let i = 1; i < n; ++i) {
        let key = prevRect[i].width;
        let j = i - 1;

        while (j >= 0 && prevRect[j].width > key) {
            const recti = {...prevRect[j]};
            const rectj = {...prevRect[j+1]};
            prevRect[j+1] = recti;
            prevRect[j] = rectj;
            pairs.push( {
                xx:j,
                yy:j+1,
                changed:true
            } );
            j = j - 1;
        }
       // arr[j + 1] = arr[i];
    }
    for(let i=0;i<n;i++){
        pairs.push({
            xx:i,
            yy:i,
            changed:true
        })
    }
    return pairs;
}