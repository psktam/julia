const JULIA_PLOT_DIV = document.getElementById('julia_plot_div');
const MANDELPLOT_DIV = document.getElementById('mandelplot_div');


const DEFAULT_X = range(-2.5, 2.5, 0.01);
const DEFAULT_Y = range(-2.5, 2.5, 0.01);


const julia_plot_tracker = new StatefulPlot(JULIA_PLOT_DIV);
const mandelplot_tracker = new StatefulPlot(MANDELPLOT_DIV);

// Ugly hack to make the "click" event in plotly actually work in a 
// useful manner.
var updating_mandel = false;


function gen_structure(xs, ys, escape_times){
    // Kind of like a constructor that generates an empty DATA
    // object to be populated
    return {
        x: ys,
        y: xs,
        z: escape_times,

        type: 'heatmap', 
        colorscale: 'Jet',
    };
}


function gen_layout(xs, ys){
    return {margin: {}, 
            yaxis: {range: [xs[0], xs[xs.length - 1]], scaleanchor: 'x'}, 
            xaxis: {range: [ys[0], ys[ys.length - 1]]}};
}


// Set global variables here
const C_REAL_INPUT = document.getElementById('real_arg');
const C_IMAG_INPUT = document.getElementById('imag_arg');
const NUM_ITERS_INPUT = document.getElementById('num_iters');

// UI Callbacks


function on_scale_change(x_lims, y_lims, escape_time_generator){
    // When the x and y limits change, refresh plot data
    var res = (parseFloat(x_lims[1]) - parseFloat(x_lims[0])) / 500.0;
    var grid_x = range(parseFloat(x_lims[0]), parseFloat(x_lims[1]), res);
    var grid_y = range(parseFloat(y_lims[0]), parseFloat(y_lims[1]), res);
    var z_vals = gen_z_vals(grid_x, grid_y);
    var escape_times = escape_time_generator(z_vals);

    return [gen_structure(xs=grid_x, ys=grid_y, escape_times=escape_times),
            gen_layout(xs=grid_x, ys=grid_y)];
}


function on_c_change(c){
    // Invoke when C-value is changed
    var num_iters = parseInt(NUM_ITERS_INPUT.value);

    var z_vals = gen_z_vals(DEFAULT_X, DEFAULT_Y);
    var escape_times = julia.calc_escape_times(z_vals, c, num_iters);

    return [gen_structure(xs=DEFAULT_X, ys=DEFAULT_Y, escape_times=escape_times), 
            gen_layout(xs=DEFAULT_X, ys=DEFAULT_Y)];
}


function c_change_cb(){
    var c = new CPX(parseFloat(C_REAL_INPUT.value), parseFloat(C_IMAG_INPUT.value));
    var new_cfg = on_c_change(c);
    var layout = gen_layout(xs=DEFAULT_X, ys=DEFAULT_Y);

    // Wipe julia plotting history
    julia_plot_tracker.wipe_history();
    julia_plot_tracker.add_step(new_cfg, layout);
}


// Bind to zooms to update the grid
JULIA_PLOT_DIV.on('plotly_relayout',
    function(eventdata){
        // First do some filtering to see if we need to redraw the plot
        console.log(eventdata);
        if ((eventdata['xaxis.range[0]'] === undefined)){
            return;
        }
        var new_plot_cfg = on_scale_change(
            [eventdata['yaxis.range[0]'], eventdata['yaxis.range[1]']], 
            [eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]']], function(zs){
                var c = new CPX(parseFloat(C_REAL_INPUT.value), parseFloat(C_IMAG_INPUT.value));
                var num_iters = parseInt(NUM_ITERS_INPUT.value);
                return julia.calc_escape_times(zs, c, num_iters); });
        console.log(new_plot_cfg);
        julia_plot_tracker.add_step(new_plot_cfg[0], new_plot_cfg[1]);
    });


MANDELPLOT_DIV.on('plotly_relayout', 
    function(eventdata){
        // First do some filtering to see if we need to redraw the plot
        if ((eventdata['xaxis.range'] === undefined) || (eventdata['yaxis.range'] === undefined)){
            return;
        }

        updating_mandel = true;
        // Create escape_time_generator here
        var new_plot_cfg = on_scale_change(
            eventdata['yaxis.range'], eventdata['xaxis.range'], function(zs){
                var num_iters = parseInt(NUM_ITERS_INPUT.value);
                return mandelbrot.calc_escape_times(zs, num_iters); });

        mandelplot_tracker.add_step(new_plot_cfg[0], new_plot_cfg[1]);
});


MANDELPLOT_DIV.on('plotly_click',
function(eventdata){
    if (updating_mandel){
        updating_mandel = false;
        return;
    }
    console.log(eventdata);
    var selected_real = eventdata.points[0].y;
    var selected_imag = eventdata.points[0].x;

    C_REAL_INPUT.value = selected_real;
    C_IMAG_INPUT.value = selected_imag;

    var c = new CPX(selected_real, selected_imag);
    var new_plot_cfg = on_c_change(c);
    julia_plot_tracker.add_step(new_plot_cfg[0], new_plot_cfg[1]);
});


// Initializastion and creation of plots
(function create_plot(){
    // generate default Julia plot
    var z_vals = gen_z_vals(DEFAULT_Y, DEFAULT_X);
    var num_iters = NUM_ITERS_INPUT.value;
    var c = new CPX(parseFloat(C_REAL_INPUT.value), parseFloat(C_IMAG_INPUT.value));
    var escape_times = julia.calc_escape_times(z_vals, c, num_iters);
    var default_julia_config = gen_structure(DEFAULT_X, DEFAULT_Y, escape_times);
    var default_layout = gen_layout(xs=DEFAULT_X, ys=DEFAULT_Y);

    julia_plot_tracker.add_step(default_julia_config, default_layout);

    // generate default Mandelplot
    var c_vals = gen_z_vals(DEFAULT_Y, DEFAULT_X);
    var mandel_times = mandelbrot.calc_escape_times(c_vals, num_iters);
    var default_mandel_config = gen_structure(DEFAULT_X, DEFAULT_Y, mandel_times);
    mandelplot_tracker.add_step(default_mandel_config, default_layout);

})();


