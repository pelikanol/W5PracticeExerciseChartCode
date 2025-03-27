

d3.csv("../data/transport_type_data.csv", row => {
    return {
    
        transport_mode: row.transport_mode,
        billions_passenger_km: +row.billions_passenger_km,
    
    };
}).then(data => {
    console.log("Loaded transport:", data)

    sortData = data.sort((a, b) => d3.descending(a.billions_passenger_km, b.billions_passenger_km));

    
    drawBarChart(data);
});

const  drawBarChart = (data) => {
    // Set up chart dimensions
    const margin = { top: 40, right: 170, bottom: 25, left: 40 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const aubergine = "#75485E";

 // Set up x-scale using band scale for transport modes
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.transport_mode)) // Map transport modes to bands
      .range([0, innerWidth]) // Set the range to fit within the chart width
      .padding(0.1); // Add padding between bands

    // const maxKM = d3.max(data, d => d.cars + d.buses + d.rail + d.air + d.other);
    const maxKM = d3.max(data, d => d.billions_passenger_km);
        console.log("maxKM", maxKM);
    
    const yScale = d3.scaleLinear()
        .domain([0, maxKM])
        .range([innerHeight, 0]);

    // Set up axes
    const bottomAxis = d3.axisBottom(xScale)
    const leftAxis = d3.axisLeft(yScale);

    // Create SVG container
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`);

    // Create inner chart
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add axes
    innerChart.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(bottomAxis);

    innerChart.append("g")
        .call(leftAxis);

    // Add axis label
    innerChart
        .append("text")
        .text("billions km")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("text-anchor", "start");

    // Draw bars
    innerChart
        .selectAll(".bar")
        .data(data)
        .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.transport_mode))
            .attr("y", d => yScale(d.billions_passenger_km))
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight - yScale(d.billions_passenger_km))
            .attr("fill", aubergine);



    
};