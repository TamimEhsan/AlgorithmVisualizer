let values = [];
export default function mergeSort(rects2){
    let rects = rects2.slice();
    values = [];
    let sz = rects2.length;
   // console.log( "fdsfsd",sz );
    sz = sz-1;
    mergeS(rects,0,sz);
    return values;
}

function merge(rects, l, m, r){
  //  console.log(l," ",r);
    let n1 = m-l+1;
    let n2 = r-m;

    const L = rects.slice(l, m+1);
    const R = rects.slice(m+1,r+1);
    let i = 0;
    let j = 0;
    let k = l;
    while(i<n1 && j<n2){
        if( L[i].width <= R[j].width ){
            rects[k] = L[i];
            i++;
        } else{
            rects[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) {
        rects[k] = L[i];
        i++;
        k++;
    }
    while (j < n2) {
        rects[k] = R[j];
        j++;
        k++;
    }

}

function mergeS(rects,l,r){

    if( l>=r ) return;
    let m = l+ (r-l)/2;
    m = Math.floor(m);
   // console.log("iiiiiiiiiiiiiiiiiiiiiiiii ",m);
    mergeS(rects,l,m);
    mergeS(rects,m+1,r);
    merge(rects,l,m,r);
    let rectsCopy = rects.slice(l,r+1);
    let value = {
        left:l,
        right:r,
        mid:m,
        val:rectsCopy
    }
    values.push(value);
}