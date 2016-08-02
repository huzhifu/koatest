/**
 * Created by itsx02 on 2016/8/2.
 */
function* gen(y){
    var x=yield  y + 1;
    var z=yield y*y;
    return x;
}
var g=gen(2);
console.log(g.next());
console.log(g.next());
console.log(g.next());