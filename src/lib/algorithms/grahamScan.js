/**
 * Graham scan convex hull algorithm.
 * Returns [hull_points, edge_animation_steps].
 * Note: Previously named `convex_hull` (snake_case). Alias kept for backward compatibility.
 * @param {Array} points - Array of {xx, yy} point objects (sorted by xx)
 * @returns {Array} [hullPoints, animationLines]
 */
export function convexHull(points){
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

/**
 * Check if three points make a clockwise turn.
 * Uses cross product: (b-a) × (c-a) < 0 means clockwise.
 */
function isClockwiseTurn(a, b, c) {
    if( a.xx*(b.yy-c.yy)+b.xx*(c.yy-a.yy)+c.xx*(a.yy-b.yy) < 0 ){
        return true;
    } else{
        return false;
    }

}

/**
 * Check if three points make a counter-clockwise turn.
 * Uses cross product: (b-a) × (c-a) > 0 means counter-clockwise.
 */
function isCounterClockwiseTurn(a, b, c){
    if( a.xx * (b.yy - c.yy) + b.xx * (c.yy - a.yy) + c.xx * (a.yy - b.yy) > 0 ){
        return true;
    } else {
        return false;
    }

}

// Backward-compatible aliases
const cw = isClockwiseTurn;
const ccw = isCounterClockwiseTurn;
// Backward-compatible alias (original snake_case name)
export { convexHull as convex_hull };
