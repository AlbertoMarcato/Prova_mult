const svgDOM = document.querySelector('#barchart')
// getting the svg element size
let svgWidth = svgDOM.getAttribute('width') 
let svgHeight = svgDOM.getAttribute('height')
// selecting the svg with d3 so that we can manipulate it with the library
const svg = d3.select('#barchart')

// setting a margin inside the svg, so that the viz is well contained
const vizPadding = 48
const barPadding = 2
const barColor = '#3CB371'
const textColor = '#194d30'

// Set up the scales (mapping the dataset's values to the size of the svg)
const xScale = d3.scaleLinear()
	.domain([0, data.length]) // the number of records in the dataset (the bars)
	.range([vizPadding, svgWidth-vizPadding]) // the output range (the size of the svg except the padding)

const yScale = d3.scaleLinear()
	.domain([0, d3.max(data, d => d.Total_emissions)]) // the dataset values' range (from 0 to its max)
	.range([svgHeight - vizPadding, vizPadding]) 

let barWidth = xScale(1) - xScale(0) - (barPadding * 2) // the width of a bar is the difference btw 2 discrete intervals of the xscale

const yAxis = d3.axisLeft(yScale)
	.ticks(10)
	.tickSize(- (svgWidth - (vizPadding * 2)))

const yTicks = svg
	.append('g')
	.attr('transform', `translate(${vizPadding}, 0)`)
	.call(yAxis)

// colouring the ticks' text
svg
	.selectAll('.tick text')
	.style('color', textColor)

// hiding the vertical ticks' line
svg
	.selectAll('path.domain')
	.style('stroke-width', 0)

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("y", vizPadding-30)
    .attr("x", -svgHeight/2)
    .attr("dy", "1")
    .attr("transform", "rotate(-90)")
    .text("Total Emissions (Kg CO2 - equivalents per kg product)")
	.style("font-size", "18px");

svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", svgWidth/2)
    .attr("y", svgHeight - vizPadding/4)
	.style("font-size", "18px")
    .text("Food type");
	
svg.append("svg:defs")
	.append("svg:marker")
		.attr("id", "triangle")
		.attr("refX", 6)
		.attr("refY", 6)
		.attr("markerWidth", 30)
		.attr("markerHeight", 30)
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M 0 0 12 6 0 12 3 6")
		.style("fill", "black");

const AsseY = svg
    .append("g")
    .append('line')
        .attr('x1', vizPadding)
        .attr('y1', svgHeight-vizPadding)
        .attr('x2', vizPadding)
        .attr('y2', vizPadding-20)
        .style('marker-end', "url(#triangle)")
        .style("stroke",'black')
        .style('width', 2)

// Bind the data to the DOM
const bars =  svg// adding the dataviz to the correct element in the DOM
	.selectAll('rect') // if there is any rect, update it with the new data
	.data(data)
	.enter() // create new elements as needed
	.append('rect') // create the actual rects
		.attr('x', (d, i) => barPadding + xScale(i))
		.attr('y', d => yScale(d.Total_emissions))
		.attr('width', barWidth)
		.attr('height', d => (svgHeight - vizPadding) - yScale(d.Total_emissions))
		.attr('fill', barColor)
		.style('opacity', 0.8)

const labels = svg // adding the dataviz to the correct element in the DOM
	.selectAll('text.labels') // if there is any rect, update it with the new data
	.data(data)
	.enter() // create new elements as needed
	.append('text') // create the actual rects
	.attr('x', (d, i) => xScale(i) + barWidth / 2)
		.attr('y', d => svgHeight - vizPadding + 16) // positioning the text at the middle of the bar
		.text(d => d.Food_product)
		.attr('text-anchor', 'middle') // centring the text
		.attr('class', 'labels')
		.style("font-size", "13px")
		.style('font-weight','600')

const values = svg // adding the dataviz to the correct element in the DOM
	.selectAll('text.values') // if there is any rect, update it with the new data
	.data(data)
	.enter() // create new elements as needed
	.append('text') // create the actual rects
	.attr('x', (d, i) => xScale(i) + barWidth / 2)
		.attr('y', d => yScale(d.Total_emissions) - 12) // positioning the text at the middle of the bar
		.text(d => d.Total_emissions)
		.attr('text-anchor', 'middle') // centring the text
		.attr('class', 'values')
		.attr('fill', textColor)

bars.on('mouseover', event => {
	d3.select(event.target) // select only the touched bar
		.style('opacity', 1)
})

bars.on('mouseout', event => {
	d3.select(event.target) // select only the touched bar
		.style('opacity', .8)
})