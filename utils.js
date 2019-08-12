// The dreadful utils file X_X kill me please

// Very useful cartesian product function by RSP in this SO post: 
// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
const range = (start, stop, step) => [...Array(Math.floor((stop - start) / step)).keys()].map(i => (i * step) + start);

