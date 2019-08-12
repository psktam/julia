// Contains functions for managing the mandelbrot plot
var mandelbrot = {};  // Namespace for mandelbrot things


mandelbrot.escape_time = function(c, num_iters){
    // Computes the escape time for a mandelbrot set
    return julia.escape_time(0.0, c, num_iters);
};


mandelbrot.calc_escape_times = function(c_grid, max_iters){
    var escape_times = [];
    for (let i=0; i < c_grid.length; i++){
        escape_times.push([]);
        for (let j=0; j < c_grid[i].length; j++){
            escape_times[i].push(mandelbrot.escape_time(c_grid[i][j], max_iters));
        }
    }
    return escape_times;
};