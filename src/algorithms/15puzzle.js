/*
let flag;
const inf = 1010
let dir = "LRUD";
let dx = [0,0,-1,1];
let dy = [-1,1,0,0];
let len = [0,0,0,0];
let str = new Array(60);
let ar = new Array(4);
let idx = new Array(4);
let transpose = new Array(4);

for (let i = 0; i < 4; i++) {
    ar[i] = new Array(4);
    idx[i] = new Array(4);
    transpose[i] = new Array(4);
}


export function isSolvable(){

}

function row_conflict(rc){
    let i, j, k, x, y, res = 0;

    for (i = 0; i < 4; i++){
        x = (ar[rc][i] >> 2);
        if (ar[rc][i] != 16) idx[x][len[x]++] = ar[rc][i];
    }

    for (i = 0; i < 4; i++){
        if (len[i] > 1){
            for (j = 0; j < len[i]; j++){
                for (k = j + 1; k < len[i]; k++){
                    if (idx[i][j] > idx[i][k]) res += 2;
                }
            }
        }
        len[i] = 0;
    }
    return res;
}

function column_conflict(rc){
    let i, j, k, x, y, res = 0;

    for (i = 0; i < 4; i++){
        x = (ar[i][rc] & 3);
        if (ar[i][rc] != 16) idx[x][len[x]++] = ar[i][rc];
    }

    for (i = 0; i < 4; i++){
        if (len[i] > 1){
            for (j = 0; j < len[i]; j++){
                for (k = j + 1; k < len[i]; k++){
                    if (idx[i][j] > idx[i][k]) res += 2;
                }
            }
        }
        len[i] = 0;
    }
    return res;
}

let heuristic(bx, by){
    let i, j, k, l, res, linear_conflict = 0, manhattan_distance = 0;

    for (i = 0; i < 4; i++){
        for (j = 0; j < 4; j++){
            transpose[j][i] = ar[i][j];
            if (ar[i][j] != 16){
                manhattan_distance += F(i, j);
            }
        }
        linear_conflict += row_conflict(i);
        linear_conflict += column_conflict(i);
    }

    res = manhattan_distance + linear_conflict;
    return res;
}

function ida(bx, by, lx, ly, g, lim, d, h){
    if (flag) return 0;

    if (!h){
        if (!flag){
            flag = true;
            str[d] = 0;
            //puts(str);
            console.log(str);
        }
        return g;
    }

    let f = g + h;
    if (f > lim) return f;

    let i, k, l, nh, r, res = inf;
    for (i = 0; i < 4; i++){
        k = bx + dx[i], l = by + dy[i];
        if (k >= 0 && k < 4 && l >= 0 && l < 4 && !(k === lx && l === ly)){
            nh = h;
            nh -= F(k, l);
            if (bx !== k) nh -= row_conflict(bx), nh -= row_conflict(k);
            if (by !== l) nh -= column_conflict(by), nh -= column_conflict(l);
            swap(ar[bx][by], ar[k][l]);
            let sw ;

            nh += F(bx, by);
            if (bx != k) nh += row_conflict(bx), nh += row_conflict(k);
            if (by != l) nh += column_conflict(by), nh += column_conflict(l);

            str[d] = dir[i];
            r = ida(k, l, bx, by, g + 1, lim, d + 1, nh);
            swap(ar[bx][by], ar[k][l]);
            if (r < res) res = r;
            if (r <= lim) return r;
        }
    }

    return res;
}


 */