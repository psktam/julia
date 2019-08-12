// Complex algebra. Ripped from https://gist.github.com/dsamarin/1258353

class CPX{
    constructor(real, imag) {
        this.real = real;
        this.imag = imag;
    }
}


function convert(num){
    // If number is not complex, make it so
    if (num instanceof CPX){
        return num;
    }
    return new CPX(num, 0.0);
}


// The following functions do their best to work sensibly. If at least 
// one argument is complex, the result will be complex. If both are real,
// the result will be a regular Javascript primitive.


function add(x, y){
    // Add two numbers together. 
    if ((x instanceof CPX) || (y instanceof CPX)){
        x = convert(x);
        y = convert(y);
        return new CPX(x.real + y.real, x.imag + y.imag);
    }
    return x + y;
}


function sub(x, y){
    // Subtract y from x
    if ((x instanceof CPX) || (y instanceof CPX)){
        x = convert(x);
        y = convert(y);
        return new CPX(x.real - y.real, x.imag - y.imag);
    }
    return x - y;
}


function mul(x, y){
    // mutiply x and y
    if ((x instanceof CPX) || (y instanceof CPX)){
        x = convert(x);
        y = convert(y);

        return new CPX((x.real * y.real) - (x.imag * y.imag), 
                       (x.imag * y.real) + (x.real * y.imag));
    }
    return x * y;
}


function div(x, y){
    // divide x by y
    if ((x instanceof CPX) || (y instanceof CPX)){
        var y_conj = conj(y);
        var numerator = mul(x, y_conj);
        var y_mag = abs(y);
        return new CPX(numerator.real / y_mag, numerator.imag / y_mag);
    }
    return x - y;
}

// TODO: add a POW function


function conj(x){
    // Returns the complex conjugate
    if (x instanceof CPX){
        return new CPX(x.real, -x.imag);
    }
    return x;
}


function abs(x){
    // Returns magnitude
    x = convert(x);
    return ((x.real ** 2.0) + (x.imag ** 2.0)) ** 0.5;
}


function real(x){
    // Type-agnostic way of getting real component
    return convert(x).real;
}


function imag(x){
    // Type-agnostic way of getting imaginary component
    return convert(x).imag;
}


function gen_z_vals(x_grid, y_grid){
    // Return a n N x M array of complex values that represent Z = X + iY
    var z_grid = [];
    for (let i=0; i < x_grid.length; i++){
        z_grid.push([]);
        for (let j=0; j < y_grid.length; j++){
            z_grid[i].push(new CPX(x_grid[i], y_grid[j]));
        }
    }
    return z_grid;
}