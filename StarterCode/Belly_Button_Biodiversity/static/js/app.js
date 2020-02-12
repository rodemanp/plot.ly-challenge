//create necessary functions to retrieve data:
// 1. Top ten OTU for graphs
// 2. Demogrphic Info for dempograhpic panel
// Use console.log throughout to check work and code

// Create function for plott data retreival and to be used for Bar graph (top 10 OTI), Gauge graph (wfreq), Bubble ()
function getPlot(id) {

    // Use json library to retreive data from the json file
    d3.json("DataSets/samples.json").then((data) => {
        // console.log(data)

        // Create var for washing frequency gauge data
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        // Create var to filter sample values by id - using .tostring() conversion method
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        // console.log(samples);

        // Create var to retrive the top 10 values - use .slice(index start, index finish) and .reverse() methods
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        // console.log(samplevalues)

        // Create var to retrieve only the top 10 otu ids - use slice (index start, index finish) and .reverse() methods  
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        // console.log(OTU_top)

        // Create var to get OTU string form for plot (d is ID number)
        var OTU_id = OTU_top.map(d => "OTU " + d)
        // console.log(OTU_id)

        // Create var to get the top 10 labels for the plot - use .slice(index start, index finish) method
        var labels = samples.otu_labels.slice(0, 10);
        // console.log(labels)

        // Creating Bar graph - Step 1 - create trace, step 2 - pass the data into trace, step 3 - setup layout, then plot
        // Step 1 - Create trace
        var trace_bar = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'light blue'
            },
            type: "bar",
            orientation: "h",
        };

        // Step 2 - Create data variable
        var data_bar = [trace_bar];

        // Step 3 - Create layout variable and setup layout 
        var layout_bar = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 50,
                t: 50,
                b: 30
            }
        };

        //  Plot Bar Graph - use .newplot(type of graph, var data, var layout)
        Plotly.newPlot("bar", data_bar, layout_bar);

        // Creating Gauge graph - https://plot.ly/javascript/gauge-charts/ and https://plot.ly/python/v3/gauge-charts/#gauge-chart-outline
        // Step 1 - Create data, no trace
        var data_gauge = [
            {
            domain: { x: [0, 1], y: [0, 1] },
            value: parseFloat(wfreq),
            title: { text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color: 'rgb(255,245,235)' },
                    { range: [1, 2], color: 'rgb(232,226,202)' },
                    { range: [2, 3], color: 'rgb(226,210,172)' },
                    { range: [3, 4], color: 'rgb(223,189,139)' },
                    { range: [4, 5], color: 'rgb(223,162,103)' },
                    { range: [5, 6], color: 'rgb(226,126,64)' },
                    { range: [6, 7], color: 'rgb(226,110,64)' },
                    { range: [7, 8], color: 'rgb(223,110,44)' },
                    { range: [8, 9], color: 'rgb(226,66,44)' },
                ]}
            }
        ];

        // Step 2 - Create Layout variable and setup layout
        var layout_gauge = {
            width: 700,
            height: 600,
            margin: { t: 20, b: 40, l: 100, r: 100 }
        };

        // Plot Gauge graph - use .newplot(type of graph, var data, var layout)
        Plotly.newPlot("gauge", data_gauge, layout_gauge);

        // Creating Bubble graph - Step 1 - create trace, step 2 - pass the data into trace, step 3 - setup layout
        // Step 1 - Create trace
        var trace_bubble = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // Step 2 - Create data variable
        var data_bubble = [trace_bubble];

        // Step 3 -  Create layout variable and setup layout
        var layout_bubble = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // Plot Bubble chart - - use .newplot(type of graph, var data, var layout)
        Plotly.newPlot("bubble", data_bubble, layout_bubble);
    });
};

// Create function to get demographic information 
function getInfo(id) {

    // Use json library to retreive data from the json file
    d3.json("DataSets/samples.json").then((data) => {

        // Create metadata var to obtain demographic panel info
        var metadata = data.metadata;
        // console.log(metadata)

        // Filter results by ID - covert to a string using .tostring() method
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Create demographic panel info variable as a select response to html (use d3.select())
        var demographicInfo = d3.select("#sample-metadata");

        // Clear demographic info panel when a new ID is being retrived
        demographicInfo.html("");

        // Create call back function to get demographic info data and append in the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}

// Create change event function; one for the plots, and another for the demographin info panel
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Create init() function for the initial data callback
function init() {

    // Select dropdown menu variable  
    var dropdown = d3.select("#selDataset");

    // Use json library to retreive data from the json file 
    d3.json("DataSets/samples.json").then((data) => {
        // console.log(data)

        // Retrieve id data to the dropdown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });
      
        // Call function to display the plot data
        getPlot(data.names[0]);

        // Call function to display the demographics panel information 
        getInfo(data.names[0]);
    });
}

// Close init() function
init();