export function convex_hull(points){
    if( points.size === 1 ){
        return;
    }
    const pointStart = points[0];
    const pointEnd = points[ points.length-1 ];
    const up = [], down = [];
    const pairs = [];
    const lines=[];
    up.push( pointStart);
    down.push(pointStart);
    for( let i = 1; i< points.length ;i++ ){
        if( (i === (points.length - 1)) || cw( pointStart,points[i],pointEnd ) ){
            while( up.length >=2 && !cw(up[up.length-2],up[up.length-1],points[i] ) ){
                lines.push({
                    from:up[up.length-2],
                    to:up[up.length-1],
                    add:false
                });
                up.pop();
            }
            up.push( points[i] );
            lines.push({
                from:up[up.length-2],
                to:up[up.length-1],
                add:true
            })
        }

    }
    for(let i = 0; i< points.length;i++){
        if( (i === (points.length - 1)) || ccw( pointStart,points[i],pointEnd ) ){
            while( down.length >=2 && !ccw(down[down.length-2],down[down.length-1],points[i] ) ){
                lines.push({
                    from:down[down.length-2],
                    to:down[down.length-1],
                    add:false
                });
                down.pop();
            }
            down.push( points[i] );
            lines.push({
                from:down[down.length-2],
                to:down[down.length-1],
                add:true
            })
        }
    }

    for (let i = 0; i < up.length; i++){
        pairs.push(up[i]);
    }
    for (let i = down.length - 2; i > 0; i--) {
        pairs.push(down[i]);
    }
    return [pairs,lines];
}

function cw(a, b, c) {
    const f = a.xx*(b.yy-c.yy)+b.xx*(c.yy-a.yy)+c.xx*(a.yy-b.yy);
    if( a.xx*(b.yy-c.yy)+b.xx*(c.yy-a.yy)+c.xx*(a.yy-b.yy) < 0 ){
        return true;
    } else{
        return false;
    }

}

function ccw(a, b, c){
    if( a.xx * (b.yy - c.yy) + b.xx * (c.yy - a.yy) + c.xx * (a.yy - b.yy) > 0 ){
        return true;
    } else {
        return false;
    }

}