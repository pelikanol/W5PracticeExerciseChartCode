

d3.csv("../data/passanger_data.csv", row => {
    return {
        date: d3.timeParse("%Y")(row.date),
        cars: +row.cars,
        buses: +row.buses,
        rail: +row.rail,
        air: +row.air,
        other: +row.other
    };
}).then(data => {
    console.log("Loaded data:", data);

    // Define the lines array for each transportation mode
    const lines = [
        { key: "cars", name: "Cars", values: data.map(d => ({ date: d.date, value: d.cars })), color: "#6A5ACD" },
        { key: "buses", name: "Buses", values: data.map(d => ({ date: d.date, value: d.buses })), color: "#5F9EA0" },
        { key: "rail", name: "Rail", values: data.map(d => ({ date: d.date, value: d.rail })), color: "#4682B4" },
        { key: "air", name: "Air", values: data.map(d => ({ date: d.date, value: d.air })), color: "#00CED1" },
        { key: "other", name: "Other", values: data.map(d => ({ date: d.date, value: d.other })), color: "#20B2AA" }
    ];

    console.log("Lines data:", lines);

    // Pass the data and lines to the chart function (github copilot)
    drawMultiLineChart2(data, lines);
});



const drawMultiLineChart2 = (data, lines) => {
    // Set up chart dimensions
    const margin = { top: 40, right: 170, bottom: 25, left: 40 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const aubergine = "#75485E";
    // Set up scales
    const firstDate = new Date(1974, 0, 1);
    const lastDate = d3.max(data, d => d.date);

    const xScale = d3.scaleTime()
        .domain([firstDate, lastDate])
        .range([0, innerWidth]);

    // const maxKM = d3.max(data, d => d.cars + d.buses + d.rail + d.air + d.other);
    const maxKM = d3.max([
        d3.max(data, d => d.cars),
        d3.max(data, d => d.buses),
        d3.max(data, d => d.rail),
        d3.max(data, d => d.air),
        d3.max(data, d => d.other)
    ]);
    
    const yScale = d3.scaleLinear()
        .domain([0, maxKM])
        .range([innerHeight, 0]);

    // Set up axes
    const bottomAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"))


    const leftAxis = d3.axisLeft(yScale);

    // Create SVG container
    const svg = d3.select("#multi-line-chart")
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
        .text("billions KM")
        .attr("x", -margin.left)
        .attr("y", -10)
        .attr("text-anchor", "start");

    // Line generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveCatmullRom);;

    // Draw lines
    lines.forEach(series => {
        innerChart
            .selectAll(`.line-${series.key}`) // Select elements with a class specific to this series
            .data([series.values]) // Bind the data (array of points for this line)
            .join("path") // Join the data to path elements
                .attr("class", `line-${series.key}`) // Add a class for styling or identification
                .attr("d", lineGenerator)
                .attr("fill", "none")
                .attr("stroke", series.color)
                .attr("stroke-width", 2);

        // Add labels at the end of each line
        innerChart
            .selectAll(`.label-${series.key}`) // Select elements with a class specific to this series
            .data([series.values[series.values.length - 1]]) // Bind the last point of the series
            .join("text") // Join the data to text elements
                .attr("class", `label-${series.key}`) // Add a class for styling or identification
                .attr("x", d => xScale(d.date) + 5)
                .attr("y", d => yScale(d.value))
                .attr("fill", series.color)
                .style("font-size", "12px")
                .text(series.name);
    });
};