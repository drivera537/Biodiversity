function buildMetadata(sample) {

  var url = `/metadata/${sample}`;
  d3.json(url).then(function (response) {
    var sample_metadata = d3.select("#sample-metadata")


    sample_metadata.html("");


    Object.entries(response).forEach(function([key, value]) {      
     
      var row = sample_metadata.append("tr");
      
     
      var cell = row.append("td");


  cell.text(`${key}: ${value}`);

// Build the Gauge Chart
  buildGauge(response.WFREQ);

});
});
}

    // BONUS: Build the Gauge Chart
    

function buildCharts(sample) {
  var url = `/samples/${sample}`;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response){
    console.log(response);
    var tenSam = response.sample_values.slice(0,10);
    var tenID = response.otu_ids.slice(0,10);
    var tenLabels = response.otu_labels.slice(0,10);
   
        // @TODO: Build a Pie Chart

    var pieTrace = {
        values: tenID,
        labels: tenSam,
        type: "pie",
        hoverinfo: tenLabels,
    };
        // @TODO: Build a Bubble Chart using the sample data

    var bubbleChart = {
      x: tenID,
      y: tenSam,
      mode: 'markers',
      text: tenLabels,
      marker:{
        size:  tenSam,
        color: tenID,
      }
    };
    pie = [pieTrace];
    bubble = [bubbleChart];
    
    Plotly.newPlot('pie', pie);
    Plotly.newPlot('bubble', bubble);
    
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
