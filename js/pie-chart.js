d3.csv("../data/transport_type_data.csv", row => {
    return {
    
        transport_mode: row.transport_mode,
        billions_passenger_km: +row.billions_passenger_km,
    
    };
}).then(data => {
    console.log("Loaded transport type:", data)

    sortData = data.sort((a, b) => d3.descending(a.billions_passenger_km, b.billions_passenger_km));

    
    drawPieCharts(data);
});

    // Create the pie chart 
    const drawPieCharts = (data) => { 
    // set up chart dimensions
        const pieChartWidth = 200;
        const pieChartHeight = 200;

    //add color scale for segments
        const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.transport_mode)) // Map transport modes
        .range(["#6A5ACD", "#5F9EA0", "#4682B4", "#00CED1", "#20B2AA"]);

    // Create SVG container
    const svg = d3.select("#pie-chart")
      .append("svg")
        // .attr("viewBox", [0, 0, pieChartWidth, pieChartHeight]);
        .attr("viewBox", `0 0 ${pieChartWidth} ${pieChartHeight}`)
        // .attr("preserveAspectRatio", "xMidYMid meet");
      
    // Create inner chart
      const innerChart = svg
      .append("g")
        .attr("transform", `translate(${pieChartWidth/2}, ${pieChartHeight/2})`);



    const formattedData = [];

    data.forEach(d => {
    formattedData.push({ 
        format: d.transport_mode, 
        production: d.billions_passenger_km
        });
    });
        console.log("formattedData", formattedData);
    
    const pieGenerator = d3.pie()
        .value(d => d.production)
        .sort(null);
        
    const annotatedData = pieGenerator(formattedData);

    const arcGenerator = d3.arc()
        .startAngle(d => d.startAngle)  
        .endAngle(d => d.endAngle)     
        .innerRadius((Math.min(pieChartWidth, pieChartHeight) / 2 - 20)*0.6)
        .outerRadius(Math.min(pieChartWidth, pieChartHeight) / 2 - 20)
        .padAngle(0.02)
        .cornerRadius(5);
  
    const arcs = innerChart
        .selectAll(".arc")  
        .data(annotatedData)          
        .join("g")                 
            .attr("class", "arc")
    arcs
        .append("path")
            .attr("d", arcGenerator)
            .attr("fill", d => colorScale(d.data.format));  

    // % labels
    arcs
        .append("text")
          .text(d => {
            d["percentage"] = (d.endAngle - d.startAngle)/ (2 * Math.PI);                                             
            return d3.format(".0%")(d.percentage);                         
          })
          .attr("x", d => {               
            d["centroid"] = arcGenerator 
              .startAngle(d.startAngle)  
              .endAngle(d.endAngle)      
              .centroid();               
            return d.centroid[0];        
          })         
          .attr("y", d => d.centroid[1]) 
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("fill", "#f6fafc")
          .attr("fill-opacity", d => d.percentage< 0.05 ? 0 : 1)                       
          .style("font-size", "10px")
          .style("font-weight", 500);



    // arcs
    // .append("text")
    //     .text(d => d.data.format) // Display only the transport_mode
    //     .attr("x", d => {               
    //     d["centroid"] = arcGenerator 
    //         .startAngle(d.startAngle)  
    //         .endAngle(d.endAngle)      
    //         .centroid();               
    //     return d.centroid[0];        
    //     })         
    //     .attr("y", d => d.centroid[1]) 
    //     .attr("text-anchor", "middle")
    //     .attr("dominant-baseline", "middle")
    //     .attr("fill", "black")
    //     .attr("fill-opacity", d => d.percentage< 0.05 ? 0 : 1)                       
    //     .style("font-size", "9px")
    //     .style("font-weight", 500);


//   innerChart
//       .append("text")
//         .text("done")
//         .attr("text-anchor", "middle")
//         .attr("dominant-baseline", "middle")
//         .style("font-size", "24px")
//         .style("font-weight", 500);
   
};
