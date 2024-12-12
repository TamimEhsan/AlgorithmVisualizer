// draw tree class functions start :/


export class Tree{
    constructor(node=0,children=[],label="") {
        this.id = 0;
        this.node = node;
        this.label = label;
        this.width = node.length;
        this.children = children;
    }
}

export class DrawTree{
    constructor(tree,parent=undefined,depth=0,number=1) {
        this.x =-1;
        this.y = depth;
        this.tree = tree;
        this.children = [];
        for( let i=0;i<tree.children.length;i++ ){
            let newTree = new DrawTree(tree.children[i],this,depth+1,i+1);
            this.children.push(newTree);
        }
        this.parent = parent;
        this.thread = undefined;
        this.mod = 0;
        this.ancestor = this;
        this.change = 0;
        this.shift = 0;
        this._lmost_sibling = undefined;
        this.number = number;
        // this.lmost_sibling = this.get_lmost_sibling();
    }

    left = ()=>{
        if( this.thread!==undefined ) return this.thread;
        if( this.children.length!==0 ) return this.children[0];
        return undefined;
        return this.thread || this.children.length && this.children[0];
    }
    right = ()=>{
        if( this.thread ) return this.thread;
        if( this.children.length ) return this.children[this.children.length-1];
        return undefined;
        return this.thread || this.children.length && this.children[-1];
    }
    lbrother = ()=>{
        let n = undefined;
        if( this.parent ){
            // for(let node in this.parent.children)
            for(let i=0;i<this.parent.children.length;i++)
            {
                let node = this.parent.children[i];
                if( node === this ){
                    return n;
                }else{
                    n = node;
                }
            }
        }
        return n;
    }
    get_lmost_sibling = ()=>{
        if( !this._lmost_sibling && this.parent && this!==this.parent.children[0] ){
            this._lmost_sibling = this.parent.children[0];
        }
        return this._lmost_sibling;
    }


}




export function buchheim(tree) {
    let dt = firstwalk(new DrawTree(tree))
    let min = second_walk(dt)
    if (min < 0) {
        third_walk(dt, -min);
    }
    return dt
}

function third_walk(tree, n) {
    tree.x += n;
    //for (let c in tree.children)
    for(let i=0;i<tree.children;i++)
    {
        let c = tree.children[i];
        third_walk(c, n);
    }
}

function firstwalk(v, distance = 1) {
    //console.log('hue hue hue',v);
    if (v.children.length === 0) {
        if (v.get_lmost_sibling()) {
            v.x = v.lbrother().x + distance;
        } else {
            v.x = 0.;
        }
    } else {
        let default_ancestor = v.children[0];
        //for (let w in v.children)
        for(let i=0;i<v.children.length;i++) {
            let w = v.children[i];
            firstwalk(w);
            default_ancestor = apportion(w, default_ancestor, distance);
        }
        // console.log("finished v =", v.tree, "children");
        execute_shifts(v);

        let midpoint = (v.children[0].x + v.children[v.children.length-1].x) / 2;

        let ell = v.children[0];
        let arr = v.children[-1];
        let w = v.lbrother();
        if (w) {
            v.x = w.x + distance;
            v.mod = v.x - midpoint;
        } else {
            v.x = midpoint;
        }
    }
    return v;
}


function apportion(v, default_ancestor, distance) {

    let w = v.lbrother();
    if (w !== undefined) {
        // inbuchheimnotation:
        //i == inner;o == outer;r == right;l == left;r = +;l = -
        let vir, vor, vil, vol, sir, sor, sol, sil;
        vir = vor = v;
        vil = w;
        vol = v.get_lmost_sibling();
        sir = sor = v.mod;
        sil = vil.mod;
        sol = vol.mod;
        while (vil.right() && vir.left()) {
            vil = vil.right();
            vir = vir.left();
            vol = vol.left();
            vor = vor.right();
            vor.ancestor = v;
            let shift = (vil.x + sil) - (vir.x + sir) + distance;
            if (shift > 0) {
                move_subtree(ancestor(vil, v, default_ancestor), v, shift);
                sir = sir + shift;
                sor = sor + shift;
            }
            sil += vil.mod;
            sir += vir.mod;
            sol += vol.mod;
            sor += vor.mod;
        }
        if (vil.right() && !vor.right()) {
            vor.thread = vil.right();
            vor.mod += sil - sor;
        } else {
            if (vir.left() && !vol.left()) {
                vol.thread = vir.left();
                vol.mod += sir - sol;
            }
            default_ancestor = v
        }
    }
    return default_ancestor
}

function move_subtree(wl, wr, shift) {
    let subtrees = wr.number - wl.number;
    // console.log(wl.tree, "is conflicted with", wr.tree, 'moving', subtrees, 'shift', shift);
    // print wl, wr, wr.number, wl.number, shift, subtrees, shift / subtrees
    wr.change -= shift / subtrees;
    wr.shift += shift;
    wl.change += shift / subtrees;
    wr.x += shift;
    wr.mod += shift;
}

function execute_shifts(v) {
    let shift, change;
    shift = change = 0;
    // for (let w in v.children[:: - 1])
    for(let i=v.children.length-1;i>=0;i--){
        let w = v.children[i];
        //console.log("shift:", w.tree.node, shift, w.change);
        w.x += shift;
        w.mod += shift;
        change += w.change;
        shift += w.shift + change;
    }
}

function ancestor(vil, v, default_ancestor) {

    if (vil.ancestor in v.parent.children){

        return vil.ancestor;
    }
    else
        return default_ancestor;
}

function second_walk(v, m = 0, depth = 0, min = undefined) {
    v.x += m;
    v.y = depth;

    if (min === undefined || v.x < min)
        min = v.x;

    // for (let w in v.children)
    for(let i=0;i<v.children.length;i++){
        let w = v.children[i];
        min = second_walk(w, m + v.mod, depth + 1, min);
    }
    return min;
}

function dfs(tree){
    if( tree.tree.node === 'B' ) return;
    console.log( tree.tree.node, tree.x,tree.y );
    for(let i=0;i<tree.children.length;i++)
        dfs(tree.children[i]);
}
/*
let blank = new Tree('B',[]);
let ll = new Tree("ll",[]);
let lr = new Tree("lr",[]);
let rr = new Tree("rr",[]);
let rl = new Tree("rl",[]);
let l = new Tree("l",[ll,lr]);
let r = new Tree("r",[rl,rr]);
let root = new Tree("root",[l,r] );

let tree = buchheim(root);
console.log("==================================================================");
dfs(tree);
*/
