function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    console.log(data);

    // 3. Create a variable that holds the samples array. 

    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.

    var filterdata = samples.filter(obj => obj.id == sample);

    //  5. Create a variable that holds the first sample in the array.

    var firstSample = filterdata[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    // Create a variable that holds the washing frequency.

    var metadata = data.metadata;
    var metadataArr = metadata.filter(sampleObj => sampleObj.id == sample);
    var metaValue = metadataArr[0];
    var washingFreq = parseInt(metaValue.wfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).reverse().map(function (desc) {return `OTU ${desc}`});
    var xticks = sample_values.slice(0,10).reverse();
    var labels = otu_labels.slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      marker:{
        // color: ['#1f77b4','#ff7f0e','#2ca02c', '#d62728','#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']        
        color: ['#636EFA', '#EF553B', '#00CC96', '#AB63FA', '#FFA15A', '#19D3F3', '#FF6692', '#B6E880', '#FF97FF', '#FECB52']
      },
      type: "bar",
      orientation:'h',
      text: labels    
    };

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", [barData], barLayout);
  
    // 11. Create the trace for the bubble Chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };
    
    // 12. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      
    };

    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
    
    //14. Create the trace for the gauge chart.
    var gaugeData = {
      value: washingFreq,
      title: {text: "Belly Button Washing Frequency<br>Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10]},
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          {range: [0,2], color: 'rgb(252,44,3)'},
          {range: [2,4], color: 'rgb(242,130,2)'},
          {range: [4,6], color: 'rgb(252,190,3)'},
          {range: [6,8], color: 'rgb(111,232,81)'},
          {range: [8,10], color: 'rgb(3,153,28)'}
        ]
      }
    };

    //15. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, height: 450, margin: {t:0, b:0}
    };

    //16. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
};