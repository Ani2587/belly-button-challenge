//url to sample.json file
url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// function to initialize dashboard
function init() {

d3.json(url).then(data =>{
    // Dropdown menu with Subject IDs
    var otu_dropdown = d3.select("#selDataset");

    data.names.forEach(name => {
        otu_dropdown.append("option").text(name).property("value", name);
    //console.log(data);
    });
    
    updateCharts(data.names[0], data);
    });
}

//function to update plots based on choosen subject ID
function updateCharts(selectedID, data) {
    //filter data for the choosen subject ID
    var selectedData = data.samples.filter(sample => sample.id === selectedID)[0];
    var selectedMetaData = data.metadata.filter(metadata => metadata.id.toString() === selectedID)[0];

    // Slice the top 10 OTUs 
    const top10Values = selectedData.sample_values.slice(0, 10).reverse();
    const top10Labels = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const top10HoverText = selectedData.otu_labels.slice(0, 10).reverse();

    //set data for creating a horizontal bar chart
    var barData = {
        x: top10Values,
        y: top10Labels,
        text : top10HoverText,
        type: "bar",
        orientation: "h"
    };
    //Create a bar chart
    Plotly.newPlot("bar", [barData]);

    //set data for creating a bubble chart
    var bubbleChart = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        text: selectedData.otu_labels,
        mode: 'markers',
        marker: {
            size: selectedData.sample_values,
            color: selectedData.otu_ids,
            colorScale: 'Earth'
        }
    };

    var layout = {
        xaxis: { title: "OTU ID" }
        };
    //Create a bubble chart
    Plotly.newPlot("bubble", [bubbleChart], layout);

    //display meta data
    const metadataPanel = d3.select('#sample-metadata');
    metadataPanel.html('');
    Object.entries(selectedMetaData).forEach(([key,value]) => {
        metadataPanel.append('p').text(`${key} : ${value}`);
    });

}
// Function to handle dropdown change based on choosen subject Id
function optionChanged(selectedID) {
    // Fetch data again if needed
    d3.json(url).then(data => {
      updateCharts(selectedID, data);
    });
  }

init();

 