function drawDifferenceChart(data) {
    const parsedData = JSON.parse(data);
    const margin = { top: 40, right: 200, bottom: 60, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const timePeriods = [...new Set(parsedData.map(d => d["Time Period"]))];
    const x = d3.scalePoint()
        .domain(timePeriods)
        .range([0, width]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    const y = d3.scaleLinear()
        .domain([40, d3.max(parsedData, d => Math.max(...Object.values(d).slice(2)))])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    const countries = Object.keys(parsedData[0]).slice(2);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Tooltip setup
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "#f4f4f4")
        .style("border", "1px solid #d3d3d3")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("visibility", "hidden");

    const countryGroup = svg.append("g").attr("class", "country-group");

    countries.forEach((country, index) => {
        const femaleData = parsedData.filter(d => d.Subgroup === "Female").map(d => ({ time: d["Time Period"], value: d[country] }));
        const maleData = parsedData.filter(d => d.Subgroup === "Male").map(d => ({ time: d["Time Period"], value: d[country] }));

        const femaleLine = d3.line()
            .x(d => x(d.time))
            .y(d => y(d.value));

        const maleLine = d3.line()
            .x(d => x(d.time))
            .y(d => y(d.value));

        const area = countryGroup.append("path")
            .datum(femaleData)
            .attr("class", `area-${country}`)
            .attr("fill", color(index))
            .attr("fill-opacity", 0.2)
            .attr("d", d3.area()
                .x(d => x(d.time))
                .y0(d => y(d.value))
                .y1((d, i) => y(maleData[i].value))
            )
            .on("mouseover", () => {
                countryGroup.selectAll("path").attr("opacity", 0.1);
                svg.selectAll(`.line-${country}, .area-${country}`).attr("opacity", 1);
            })
            .on("mousemove", event => {
                tooltip.html(`<strong>${country}</strong> Life Expectancy Gap`)
                       .style("top", (event.pageY - 10) + "px")
                       .style("left", (event.pageX + 10) + "px")
                       .style("visibility", "visible");
            })
            .on("mouseout", () => {
                countryGroup.selectAll("path").attr("opacity", 1);
                tooltip.style("visibility", "hidden");
            });

        const femalePath = countryGroup.append("path")
            .datum(femaleData)
            .attr("class", `line-${country}`)
            .attr("fill", "none")
            .attr("stroke", color(index))
            .attr("stroke-width", 1.5)
            .attr("d", femaleLine);

        const malePath = countryGroup.append("path")
            .datum(maleData)
            .attr("class", `line-${country}`)
            .attr("fill", "none")
            .attr("stroke", d3.color(color(index)).darker(1))
            .attr("stroke-width", 1.5)
            .attr("d", maleLine);

        femaleData.forEach(d => {
            svg.append("circle")
                .attr("class", `dot-${country}`)
                .attr("cx", x(d.time))
                .attr("cy", y(d.value))
                .attr("r", 3)
                .attr("fill", color(index))
                .on("mouseover", event => {
                    tooltip.html(`<strong>Country: ${country}</strong><br><strong>Year: ${d.time}</strong><br><strong>Female: ${d.value}</strong>`)
                        .style("visibility", "visible");
                })
                
                .on("mousemove", event => {
                    tooltip.style("top", (event.pageY - 10) + "px")
                           .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", () => tooltip.style("visibility", "hidden"));
        });

        maleData.forEach(d => {
            svg.append("circle")
                .attr("class", `dot-${country}`)
                .attr("cx", x(d.time))
                .attr("cy", y(d.value))
                .attr("r", 3)
                .attr("fill", d3.color(color(index)).darker(1))
                .on("mouseover", event => {
                    tooltip.html(`<strong>Country: ${country}</strong><br><strong>Year: ${d.time}</strong><br><strong>Male: ${d.value}</strong>`)
                        .style("visibility", "visible");
                })
                
                .on("mousemove", event => {
                    tooltip.style("top", (event.pageY - 10) + "px")
                           .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", () => tooltip.style("visibility", "hidden"));
        });
    });

    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 10)
        .text("Time Period");

    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .text("Life Expectancy (Age)");
}





