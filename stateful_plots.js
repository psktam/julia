// Contains code for a stateful plot that keeps track of zooms and 
// positions over time so you can go back and forth between them.


class StatefulPlot{

    constructor(plot_div){
        // Keep track of the plot div and instantiate some stateful parameters
        this.plot_history = [];
        this.plot_idx = -1;
        this.plot_div = plot_div;

        // At this point, create an empty plotly plot in it
        Plotly.newPlot(plot_div, []);
    }

    get current_config(){
        // Getter to the current plotting configuration
        return this.plot_history[this.plot_idx];
    }

    render(){
        // Method to render the plot, as it is now
        var plot_data = this.current_config[0];
        var plot_layout = this.current_config[1];
        console.log("Data ", plot_data, "layout ", plot_layout);

        // Before passing along the data, you need to deep-copy it because plotly 
        // modifies the shit that you pass in. Fantastic.
        var copy_data = JSON.parse(JSON.stringify(plot_data));
        var copy_layout = JSON.parse(JSON.stringify(plot_layout));
        Plotly.react(this.plot_div, [copy_data], copy_layout, {responsive: true});
    }

    add_step(plot_data, plot_layout){
        // Insert the given plot configuration into the plot history, and
        // wipe out the history if need be.
        this.plot_history = this.plot_history.slice(0, this.plot_idx + 1);
        this.plot_history.push([plot_data, plot_layout]);
        this.plot_idx++;
        this.render();
    }

    go_back(){
        // Set the plot index back by one and re-render
        if (this.plot_idx > 0){
            this.plot_idx--;
        }
        this.render();
    }

    go_forward(){
        // same as go forward
        if (this.plot_idx < (this.plot_history.length - 1)){
            this.plot_idx++;
        }
        this.render();
    }

    go_to(plot_idx){
        this.plot_idx = plot_idx;
        this.render();
    }

    wipe_history(){
        // Empty out plot history and reset index to -1
        this.plot_history = [];
        this.plot_idx = -1;
    }
}