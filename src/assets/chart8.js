function drawChoroplethMap(data) {
    const parsedData = JSON.parse(data);
    console.log("parsedData is")
    console.log(parsedData[0].Brazil)
    // Set dimensions and margins
    const width = 1200;
    const height = 600;
    
    // Create an SVG element or clear existing one
    d3.select("#choropleth-map").selectAll("*").remove();
    
    const svg = d3.select("#choropleth-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Projection and path generator for the map
    const projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Tooltip setup
    const tooltip = d3.select("#choropleth-map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background-color", "#333")
        .style("color", "#fff")
        .style("padding", "10px")
        .style("border-radius", "8px");

    // Color scale based on Armed Forces personnel numbers
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(parsedData, d => Math.max(...Object.values(d).slice(1)))]);

    // Load GeoJSON data (world countries)
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then(function(geoData) {
        
        
        const personnelByCountry = {
                    'Brazil': +parsedData[0].Brazil,
                    'China': +parsedData[0].China,
                    'India': +parsedData[0].India,
                    'Russia': +parsedData[0].Russia,
                    'Saudi Arabia': +parsedData[0]['Saudi Arabia']
                };
        
        const countryNameMap = {
        
            "Russia": "Russia",
            "India": "India",
            "China": "China",
            "Brazil": "Brazil",
            "Saudi Arabia": "Saudi Arabia"
            // Add other mappings as necessary
        };

        // Draw countries on the map and color them based on personnel values
        svg.selectAll("path")
            .data(geoData.features)
            .join("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryName = d.properties.name;
                // console.log("@@@@@")
                // console.log(countryName)
                const mappedName = countryNameMap[countryName];
                // console.log("*********")
                // console.log(mappedName)
                console.log(personnelByCountry)
                const personnel = personnelByCountry[mappedName];
                // console.log("========")
                // console.log(personnel);
                return personnel ? colorScale(personnel) : "#eee"; // Grey for countries without data
            })
            .on("mouseover", function(event, d) {
                const countryName = d.properties.name;
                const mappedName = countryNameMap[countryName];
                const personnel = personnelByCountry[mappedName] || "No data";

                tooltip.transition().duration(200).style("opacity", 1);
                tooltip.html(`<strong>${countryName}</strong><br>Personnel: ${personnel.toLocaleString()}`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px");

                d3.select(this).transition().duration(200).style("stroke-width", "2px").style("stroke", "#333");
            })
            .on("mousemove", function(event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 50) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition().duration(200).style("opacity", 0);
                d3.select(this).transition().duration(200).style("stroke-width", "0px");
            });
        
        // Add legend for color scale (optional)
        const legendGroup = svg.append('g')
           .attr('transform', `translate(${width - 100}, ${height / 2})`);

        legendGroup.append('text')
           .attr('x', -40)
           .attr('y', -20)
           .text('Personnel')
           .style('font-size', '14px');

        const legendColors = [100000, 500000, 1000000, 2000000, 3000000];
        
        legendColors.forEach((d, i) => {

           legendGroup.append('rect')
              .attr('x', -40)
              .attr('y', i * 20)
              .attr('width', 18)
              .attr('height', 18)
              .style('fill', colorScale(d));

           legendGroup.append('text')
              .attr('x', -15)
              .attr('y', i * 20 + 9)
              .text(d.toLocaleString())
              .style('font-size', '12px');
       });
    });
}