var julia = {};


julia.escape_time = function (z, c, num_iters){
    // For the given complex number, find its escape time. If it doesn't escape by the time
    // num_iters is reached, make it return -1
    for (let i = 0; i < num_iters; i++){
        if (abs(z) > 2.0){
            return i;
        }

        z = add(mul(z, z), c);
    }
    return -100;  // If we hit here, we haven't excaped yet, so return -1.
};


julia.calc_escape_times = function(z_grid, c, max_iters){
    // For every Z-val in a 2D grid of complex values, return an equally-sized grid
    // of integers denoting how long it takes feor that Z-val to "escape". -1 implies
    // no escape.
    var escape_times = [];
    for (let i=0; i < z_grid.length; i++){
        escape_times.push([]);
        for (let j=0; j < z_grid[i].length; j++){
            escape_times[i].push(julia.escape_time(z_grid[i][j], c, max_iters));
        }
    }
    return escape_times;
};

