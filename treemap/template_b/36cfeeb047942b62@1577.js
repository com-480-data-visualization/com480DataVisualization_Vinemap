function _1(md){return(
md`# The Global Human Day
Data set provided by R for Data Science, featuring a research study called [The Global Human Day](https://www.pnas.org/doi/10.1073/pnas.2219564120). The study aims to create a "global estimate of time use by all humans" and provides a snapshot of how humans allocate time across various activities. 

There are a total of 20 activity classifications, or subcategories, that align with 8 parent categories (Somatic maintenance, Experience oriented, Food provision, Nonfood provision, Organization, Deliberate neural restructuring, Maintenance of surroundings, and Technosphere modification).

Information is available per country. This notebook explores how countries compare across different categories.`
)}

function _2(selectedCountry,md){return(
md`## Breakdown by Category: ${selectedCountry}`
)}

function _selectedCountry(Inputs,countries){return(
Inputs.select(countries, {label: "Country"})
)}

function _4(treemap,plot2,htl){return(
htl.html`<div class='container'>
 <div class='treemap'>${treemap}</div>
 <div class='comparison'>${plot2} </div>
</div>\``
)}

function _5(selectedCountry,md){return(
md`## How does ${selectedCountry} compare to other countries?
Select a subcategory in the dropdown below or the diagram above.`
)}

function _selectedSubcategory(Inputs,subcategories,clickedSubcategory){return(
Inputs.select(subcategories, {label: "Subcategory", value: clickedSubcategory})
)}

function _dynamic_text(selectedCountry,decimalToHoursMinutes,textHours,selectedSubcategory,compareHours,textMedian,md){return(
md`People in <span style='color:#1B98E0;'>**${selectedCountry}**</span> spend on average **${decimalToHoursMinutes(textHours)}** for **${selectedSubcategory}**. This is **${compareHours(textHours, textMedian)} than** the <span style='border-bottom:2px dashed;'>global median</span> by **${decimalToHoursMinutes(textHours-textMedian)}**.`
)}

function _horizontal_swarm(Plot,customTickFormat,subset,selectedIsoCode,getCountryNameByISO3,decimalToHoursMinutes){return(
Plot.plot({
  height: 600,
  width: 1200,
  marginBottom: 50,
  className: "horizontal-swarm",
  style: {background:"transparent", fontSize:15, fontFamily:"Roboto Condensed"},
  x: {
    tickSize: 0,
    label: 'HRS : MIN',
    tickFormat: customTickFormat
  },
  y: {ticks:false},
  marks: [
    Plot.dot(subset, Plot.dodgeY({
      r: 9,
      anchor: "middle",
      title : "country_iso3",
      padding: 2,
      fill: d => d.country_iso3 === selectedIsoCode ? '#1B98E0' : '#DFDFDF',
      x: "hoursPerDayCombined",
    })),
    Plot.dot(subset, Plot.dodgeY(
      Plot.pointer({
      r: 9,
      anchor: "middle",
      title : d=> getCountryNameByISO3(d.country_iso3) + '\n' + decimalToHoursMinutes(d.hoursPerDayCombined),
      padding: 2,
      fill: '#00C49A',
      tip: "xy",
      x: "hoursPerDayCombined"})
    )),
    Plot.ruleX(subset, Plot.groupZ({ x: "median" }, {
      x: "hoursPerDayCombined",
      stroke: "#393939",
      strokeWidth: 2.5,
      strokeDasharray: [5, 5],
    })),
  ],
})
)}

function _vertical_swarm(Plot,customTickFormat,subset,selectedIsoCode){return(
Plot.plot({
  height: 1200,
  width: 600,
  className: "vertical-swarm",
  style: {background:"transparent", fontSize:15, fontFamily:"Roboto Condensed"},
  y: {
    tickSize: 0,
    label: 'HRS : MIN',
    tickFormat: customTickFormat
  },
  x: {ticks:false},
  marks: [
    Plot.dot(subset, Plot.dodgeX({
      r: 9,
      anchor: "middle",
      title : "country_iso3",
      padding: 2,
      fill: d => d.country_iso3 === selectedIsoCode ? '#1B98E0' : '#DFDFDF',
      y: "hoursPerDayCombined",
    })),
    Plot.dot(subset, Plot.dodgeX(
      Plot.pointer({
      r: 9,
      anchor: "middle",
      title : "country_iso3",
      padding: 2,
      fill: '#00C49A',
      tip: "xy",
      y: "hoursPerDayCombined"})
    )),
    Plot.ruleY(subset, Plot.groupZ({ y: "median" }, {
      y: "hoursPerDayCombined",
      stroke: "#393939",
      strokeWidth: 2.5,
      strokeDasharray: [5, 5],
    })),
  ],
})
)}

function _10(selectedSubcategory,md){return(
md`## Choropleth Map: ${selectedSubcategory}`
)}

function _11(Plot,d3,minHours,maxHours,decimalToHoursMinutes){return(
Plot.legend({width:700,
             height:60,
             marginLeft:10,
             style: {fontFamily: "Roboto Condensed"},
             color: {type: "linear", 
                     scheme:"BuPu", 
                     domain: d3.range(minHours, maxHours, (maxHours - minHours) / 7),
                     tickFormat: decimalToHoursMinutes}})
)}

function _hoveredCountryValue(){return(
null
)}

function _mymap(d3,countriesGeo,subset,$0)
{

  const width = 960;
  const height = 500;

 // Define a projection
  const projection = d3.geoNaturalEarth1() 
    .scale(200) 
    .translate([width / 2, height / 1.5]);

  countriesGeo.features = countriesGeo.features.filter(feature => feature.properties.ADMIN !== "Antarctica");

  // Create a path generator with the projection
  const path = d3.geoPath().projection(projection);

  const bounds = path.bounds(countriesGeo);

  // Calculate the viewBox values
  const viewBoxX = bounds[0][0];
  const viewBoxY = bounds[0][1];
  const viewBoxWidth = bounds[1][0] - bounds[0][0];
  const viewBoxHeight = bounds[1][1] - bounds[0][1];

  // Create the SVG element with the calculated viewBox
  const svg = d3.create("svg")
  .attr("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);

  // Calculate the minimum and maximum values of hoursPerDayCombined
  var minHours = d3.min(subset, d => d.hoursPerDayCombined);
  var maxHours = d3.max(subset, d => d.hoursPerDayCombined);
  
  // Define the number of threshold values you want (adjust as needed)
  var numThresholds = 7;

  const tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  // Create a dynamic color scale
  var colorScale = d3.scaleThreshold()
    .domain(d3.range(minHours, maxHours, (maxHours - minHours) / numThresholds))
    .range(d3.schemeBuPu[numThresholds]);

  // Draw map
    svg.append("g")
    .selectAll("path")
    .data(countriesGeo.features)
    .enter().append("path")
      .attr("d", path)
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      //function to create choropleth fill
      .attr("fill", function(d) {
  var country = d.properties.ISO_A3;
  var countryData = subset.filter(x => x.country_iso3 === country);
  if (countryData.length > 0) {
    return colorScale(countryData[0].hoursPerDayCombined);
  } else {
    return "#ccc"; // default color for missing data
  }
})
  .on("mouseover", function (event, i) {

    const hoveredCountryISO = countriesGeo.features[i].properties.ISO_A3;
    const hoveredCountry = countriesGeo.features[i].properties.ADMIN;


    svg.selectAll("path")
      .style("fill-opacity", (x => x.properties.ADMIN === hoveredCountry ? 1 : 0.2));


    $0.value = 'x';


    console.log(hoveredCountry);
    
  })
  .on("mouseout", function (d) {
    svg.selectAll("path").style("fill-opacity", 1);

  });


      //clicked on outline
    const select_outline = svg.append("path")
      .attr("fill", "#F45B69")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("pointer-events", "none");

  
  return svg.node()


}


function _14(md){return(
md`### Dynamic Text Test`
)}

function _textHours(subset,selectedSubcategory,selectedIsoCode){return(
subset.filter(d => (d.Subcategory === selectedSubcategory & d.country_iso3 === selectedIsoCode))[0].hoursPerDayCombined
)}

function _textMedian(d3,subset,selectedSubcategory){return(
d3.median(subset.filter(d => d.Subcategory === selectedSubcategory), d=> d.hoursPerDayCombined)
)}

function _compareHours(){return(
function compareHours(textHours, textMedian) {
  // Convert the input values to numbers (assuming they represent numbers)
  const hours = parseFloat(textHours);
  const median = parseFloat(textMedian);

  if (!isNaN(hours) && !isNaN(median)) {
    if (hours > median) {
      return "higher";
    } else {
      return "less";
    }
  } else {
    // Handle the case where input values are not valid numbers
    return "Invalid input";
  }
}
)}

function _18(decimalToHoursMinutes,textMedian){return(
decimalToHoursMinutes(textMedian)
)}

function _19(decimalToHoursMinutes,textHours){return(
decimalToHoursMinutes(textHours)
)}

function _20(decimalToHoursMinutes,textHours,textMedian){return(
decimalToHoursMinutes(Math.abs(textHours-textMedian))
)}

function _21(compareHours,textHours,textMedian){return(
compareHours(textHours, textMedian)
)}

function _minHours(d3,subset){return(
d3.min(subset, d => d.hoursPerDayCombined)
)}

function _maxHours(d3,subset){return(
d3.max(subset, d => d.hoursPerDayCombined)
)}

function _domain(d3,minHours,maxHours){return(
d3.range(minHours, maxHours, (maxHours - minHours) / 7)
)}

function _countriesGeo(FileAttachment){return(
FileAttachment("countries.geojson").json()
)}

function _26(md){return(
md`## Behind The Scenes Code

### Plot 1: Voronoi Treemap (D3)
The Voronoi treemap code is modeled off of [Will Chase's example](https://observablehq.com/@will-r-chase/voronoi-treemap) with GDP.`
)}

function _voronoiMap(d3,width,margin,height,ellipse,category_hierarchy,colorHierarchy,$0,decimalToHoursMinutes){return(
function voronoiMap(hoveredCategory) {
  //const svg = d3.select(DOM.svg(width + margin.left + margin.right, height + margin.left + margin.right));
  // svg
  //    .append("rect")
 //     .attr("width", "100%")
//      .attr("height", "100%")
//      .style("fill", "white");


const svg = d3.create("svg")
.attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.left + margin.right])
.attr("style", "max-width: 100%; height: auto; height: intrinsic; background-color:transparent;");
  
  const voronoi = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  const labels = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  const hour_labels = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  let seed = new Math.seedrandom(20);
  let voronoiTreeMap = d3.voronoiTreemap()
    .prng(seed)
    .clip(ellipse);
  
  voronoiTreeMap(category_hierarchy);
  colorHierarchy(category_hierarchy);
  
  let allNodes = category_hierarchy.descendants()
    .sort((a, b) => b.depth - a.depth)
    .map((d, i) => Object.assign({}, d, {id: i}));
  
  let hoveredShape = null;
  
  voronoi.selectAll('path')
    .data(allNodes)
    .enter()
    .append('path')
    .attr('d', d => "M" + d.polygon.join("L") + "Z")
    .style('fill', d => d.parent ? d.parent.color : d.color)
    .attr("stroke", "white")
    .attr("stroke-width", 0)
    .style('fill-opacity', d => d.depth === 2 ? 1 : 0)
    .style('opacity', d => hoveredCategory === null || d.data.Category === hoveredCategory ? 1 : 0.5) // Use hoveredCategory variable
    .attr('pointer-events', d => d.depth === 2 ? 'all' : 'none')
.on('mouseenter', function (d) {
  // Select the current element and set its opacity to 1
   d3.select(this).style('fill-opacity', 1);
   d3.select(this).style("cursor", "pointer"); 

  // Set opacity to 0.5 for all other elements
  voronoi.selectAll('path')
    .filter(e => e.id !== d.id)
    .style('opacity', 0.4);

  // Other actions you want to perform on mouse enter
  let label = labels.select(`.label-${d.id}`);
  label.attr('opacity', 1);
  let hour_label = hour_labels.select(`.label-${d.id}`);
  hour_label.attr('opacity', 1);
})
.on('mouseleave', function (d) {
  // Select the current element and restore its original fill opacity
  d3.select(this).style('fill-opacity', d => d.depth === 2 ? 1 : 0.5);

  // Restore opacity to 1 for all other elements
  voronoi.selectAll('path')
    .filter(e => e.id !== d.id)
    .style('opacity', d => d.depth === 2 ? 1 : 0);

  // Other actions you want to perform on mouse leave
  let label = labels.select(`.label-${d.id}`);
  label.attr('opacity', d => d.data.hoursPerDayCombined > 0.8 ? 1 : 0);
  let hour_label = hour_labels.select(`.label-${d.id}`);
  hour_label.attr('opacity', d => d.data.hoursPerDayCombined > 0.8 ? 1 : 0);
})
.on('click', d => {
    $0.value = d.data.key || d.data.Subcategory; // Store the label's value in clickedCategory

    // Find the target div with class "beeswarm"
    const targetDiv = document.getElementById('node-568');

    // Scroll to the target div smoothly
    if (targetDiv) {
      targetDiv.scrollIntoView({behavior: 'smooth' });
    } else {
      console.log('Target div was not found.');
    }
  })
    .transition()
    .duration(500)
    .attr("stroke-width", d => 7 - d.depth*2.8)
    .style('fill', d => d.color);

  //category labels
  labels.selectAll('text')
    .data(allNodes.filter(d => d.depth === 2 ))
    .enter()
    .append('text')
    .attr('class', d => `label-${d.id}`)
    .attr('text-anchor', 'middle')
    .attr("transform", d => "translate("+[d.polygon.site.x, d.polygon.site.y+6]+")")
    .text(d => d.data.key || d.data.Subcategory) 
  //  .attr('opacity', d => d.data.key === hoveredShape | d.data.hoursPerDayCombined > 0.8 ? 1 : 0)   
    .attr('opacity', d => (hoveredCategory !== null && d.data.Category === hoveredCategory) || (hoveredCategory === null && d.data.hoursPerDayCombined) > 0.8 ? 1 : 0)
    .attr('cursor', 'pointer')
    .attr('pointer-events', 'none')
    .attr('fill', d => d.data.Category === 'Experience oriented' ? 'white' : 'black')
    .style('font-family', 'Oswald')
    .style('text-transform', 'capitalize')
    .style('font-size', d => d.data.hoursPerDayCombined > 3 ? "30px" : d.data.hoursPerDayCombined > 1 ? "20px": d.data.hoursPerDayCombined > 0.8 ? "16px" : "14px");


  //hours combined labels
  hour_labels.selectAll('text')
    .data(allNodes.filter(d => d.depth === 2 ))
    .enter()
    .append('text')
    .attr('class', d => `label-${d.id}`)
    .attr('text-anchor', 'middle')
    .attr("transform", d => "translate("+[d.polygon.site.x, d.polygon.site.y+25]+")")
    .text(d => decimalToHoursMinutes(d.data.hoursPerDayCombined))
    .attr('opacity', d => (hoveredCategory !== null && d.data.Category === hoveredCategory) || (hoveredCategory === null && d.data.hoursPerDayCombined) > 0.8 ? 1 : 0)                                
    .attr('cursor', 'pointer')
    .attr('pointer-events', 'none')
    .attr('fill', d => d.data.Category === 'Experience oriented' ? 'white' : 'black')
    .style('font-size', d=> d.data.hoursPerDayCombined > 0.3 ? '14px' : "12px")
    .style('font-family', 'Roboto Condensed');
  
  return svg.node();

}
)}

function _28(md){return(
md`Set up mutable variable to pass into voronoiMap function. Selected category from map will be stored in this value when a user clicks on it. This is then passed to the selectedCategory dropdown input.`
)}

function _clickedSubcategory(){return(
"Food preparation"
)}

function _hoveredCategory(){return(
null
)}

function _treemap(voronoiMap,hoveredCategory){return(
voronoiMap(hoveredCategory)
)}

function _32(md){return(
md`### Plot 2: Category Allocation
This chart represents the text next to the voronoi treemap above. Aggregates total hours and minutes by parent country (e.g. Somatic maintenance, Food provision, etc).`
)}

function _33(plot2){return(
plot2
)}

function _plot2(d3,query,y_axis_list,categoryColor,$0,decimalToHoursMinutes)
{
const width = 550;
const height = 600;
const margin = { top: 20, right: 10, bottom: 30, left: 10 };

const svg = d3.create("svg")
.attr("viewBox", [0, 0, width, height])
.attr("style", "max-width: 100%; height: auto; height: intrinsic; background-color:transparent");


// Define your data (assuming you have a 'query' dataset)
const data = query

// Create scales for x and y axes
const xScale = d3.scaleLinear()
  .domain([0, 30])
  .range([margin.left, width - margin.right]);

const yScale = d3.scaleBand()
  .domain(y_axis_list)
  .range([margin.top, height - margin.bottom])
  .padding(0.1);


// ... Your existing code ...

// Add circles and assign unique IDs based on 'category'
svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(2))
  .attr("cy", d => yScale(d.category))
  .attr("r", 15)
  .attr("fill", d => categoryColor(d.category))
  .attr("id", d => `${d.category}`) // Assign a unique ID based on 'category'
  .style("fill-opacity", 1) // Set initial fill-opacity to 0.5 for all circles
  .on("mouseover", function (d) {
    
    const hoveredId = `${d.category}`;

    $0.value = hoveredId;
    
    svg.selectAll("circle")
      .style("fill-opacity", circle => (circle.category === hoveredId ? 1 : 0.5));

    svg.selectAll(".title")
      .style("fill-opacity", circle => (circle.category === hoveredId ? 1 : 0.5))
      .style("font-weight", circle => (circle.category === hoveredId ? 'bold' : 'normal'));

    svg.selectAll(".value")
      .style("fill-opacity", circle => (circle.category === hoveredId ? 1 : 0.5))
      .style("font-weight", circle => (circle.category === hoveredId ? 'bold' : 'normal'));

  })
  
  .on("mouseout", function () {

    $0.value = null;
    // Reset fill-opacity for all circles
    svg.selectAll("circle").style("fill-opacity", 1);
    svg.selectAll(".title").style("fill-opacity", 1).style('font-weight','normal');
    svg.selectAll(".value").style("fill-opacity", 1).style('font-weight','normal');
  });





svg.selectAll(".title")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "title")
  .attr("x", d => xScale(4))
  .attr("y", d => yScale(d.category))
  .attr("font-size", 20)
  .attr("font-family", "Oswald")
  .attr("dy", "0.35em")
  .text(d => d.category)
  .on("mouseover", function (d) {
    
    const hoveredId = `${d.category}`;

    $0.value = hoveredId;
    
    svg.selectAll("circle")
      .style("fill-opacity", circle => (circle.category === hoveredId ? 1 : 0.5));

    svg.selectAll(".title")
      .style("fill-opacity", circle => (circle.category === hoveredId ? 1 : 0.5))
      .style("font-weight", circle => (circle.category === hoveredId ? 'bold' : 'normal'));

    svg.selectAll(".value")
      .style("fill-opacity", circle => (circle.category === hoveredId ? 1 : 0.5))
      .style("font-weight", circle => (circle.category === hoveredId ? 'bold' : 'normal'));

  })
  
  .on("mouseout", function () {

    $0.value = null;
    // Reset fill-opacity for all circles
    svg.selectAll("circle").style("fill-opacity", 1);
    svg.selectAll(".title").style("fill-opacity", 1).style('font-weight','normal');
    svg.selectAll(".value").style("fill-opacity", 1).style('font-weight','normal');
  });;
  
svg.selectAll(".value")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "value")
  .attr("x", d => xScale(25))
  .attr("y", d => yScale(d.category))
  .attr("font-size", 18)
  .attr("font-family", "Roboto Condensed")
  .attr("text-anchor", "end")
  .attr("dy", "0.35em")
  .text(d => decimalToHoursMinutes(d.country_stat))
  .sort((a, b) => d3.ascending(a.text, b.text));

  return svg.node();
}


function _35(md){return(
md`## Utils
Borrowed from Will Chase's notebook.`
)}

function _height(margin){return(
700 - margin.top - margin.bottom
)}

function _width(margin){return(
700 - margin.left - margin.right
)}

function _margin(){return(
{top: 20, right: 20, bottom: 50, left: 50}
)}

function _ellipse(d3,width,height){return(
d3
  .range(100)
  .map(i => [
    (width * (1 + 0.99 * Math.cos((i / 50) * Math.PI))) / 2,
    (height * (1 + 0.99 * Math.sin((i / 50) * Math.PI))) / 2
  ])
)}

function _40(md){return(
md`## Libraries`
)}

function _d3(require){return(
require("d3@5", "d3-weighted-voronoi", "d3-voronoi-map", "d3-voronoi-treemap", 'seedrandom@2.4.3/seedrandom.min.js')
)}

function _flubber(require){return(
require("flubber@0.4")
)}

function _43(md){return(
md`## Other Functions`
)}

function _customTickFormat(){return(
function customTickFormat(value) {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}
)}

function _decimalToHoursMinutes(){return(
function decimalToHoursMinutes(decimal) {
  // Calculate the hours by rounding down the decimal number
  const hours = Math.floor(decimal);

  // Calculate the remaining minutes by multiplying the decimal part by 60
  const minutes = Math.round((decimal - hours) * 60);

  let timeString = '';

  // Add hours to the output only if it's greater than 0
  if (hours > 0) {
    timeString += `${hours} hr${hours > 1 ? 's' : ''}`;
  }

  // Add minutes to the output only if it's greater than 0
  if (minutes > 0) {
    if (timeString) {
      timeString += ' ';
    }
    timeString += `${minutes} min`;
  }

  // If neither hours nor minutes are greater than 0, return "0 min"
  if (!timeString) {
    timeString = "0 min";
  }

  return timeString;
}
)}

function _getCountryNameByISO3(tt_countries){return(
function getCountryNameByISO3(code) {
  // Assuming tt_countries is an array of country objects
  // with 'country_name' and 'country_iso3' fields
  const country = tt_countries.find((item) => item.country_iso3 === code);

  if (country) {
    return country.country_name;
  } else {
    return "Country not found"; // You can customize the error message
  }
}
)}

function _47(md){return(
md`## Data
Provided by The Global Human Day. Imported directly from R for Data Science TidyTuesday's GitHub repository.`
)}

function _tt_ghd_countries(d3){return(
d3.csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2023/2023-09-12/all_countries.csv", d3.autoType)
)}

function _tt_countries(d3){return(
d3.csv("https://raw.githubusercontent.com/rfordatascience/tidytuesday/master/data/2023/2023-09-12/country_regions.csv", d3.autoType)
)}

function _50(md){return(
md`Subset data based on country input.`
)}

function _selectedIsoCode(tt_countries,selectedCountry){return(
tt_countries.filter(d => {return d.country_name === selectedCountry})[0].country_iso3
)}

function _tt_country(tt_ghd_countries,selectedIsoCode){return(
tt_ghd_countries.filter(d => {return d.country_iso3 === selectedIsoCode})
)}

function _53(md){return(
md`Color mapping - these functions are written by Will Chase, I modified to fit the data.`
)}

function _colorHierarchy(categoryColor){return(
function colorHierarchy(hierarchy) {
  if(hierarchy.depth === 0) {
    hierarchy.color = 'black';
  } else if(hierarchy.depth === 1){
    hierarchy.color = categoryColor(hierarchy.data.key);
  } else {
    hierarchy.color = hierarchy.parent.color;
  }
  if(hierarchy.children) {
    hierarchy.children.forEach( child => colorHierarchy(child))
  } 
}
)}

function _categoryColor(){return(
function(category) {
  var colors = {
    "Food provision": "#48EB70",
    "Nonfood provision": "#FF9D13",
    "Technosphere modification": "#DCDCDC",
    "Maintenance of surroundings": "#F95738",
    "Somatic maintenance": "#EBCD49",
    "Deliberate neural restructuring": "#4DEAFF",
    "Organization" : "#00BFB2", 
    "Experience oriented" : "#7F2FFF"
  };
  return colors[category];
}
)}

function _56(md){return(
md`Reshape data in nested format for treemap diagram.`
)}

function _category_hierarchy(d3,country_nested){return(
d3.hierarchy(country_nested, d => d.values)
  .sum(d => d.hoursPerDayCombined)
)}

function _country_nested(d3,tt_country)
{
  let country_nest = d3.nest()
      .key(d => d.Category)
      .entries(tt_country)
  
  return {key: "country_nest", values: country_nest}
}


function _countries(tt_countries){return(
[...new Set(tt_countries.map(f => f.country_name))].sort()
)}

function _subcategories(tt_ghd_countries){return(
[...new Set(tt_ghd_countries.map(f => f.Subcategory))]
)}

function _categories(query){return(
[...new Set(query.map(f => f.category))]
)}

function _y_axis_list(categories){return(
['Title', ...categories]
)}

function _subset(tt_ghd_countries,selectedSubcategory){return(
tt_ghd_countries.filter(d => d.Subcategory === selectedSubcategory)
)}

function _query(selectedIsoCode,__query,tt_ghd_countries,invalidation){return(
__query.sql(tt_ghd_countries,invalidation,"tt_ghd_countries")`SELECT
  Category as category,
  SUM(CASE WHEN country_group = 'USA' THEN hrs ELSE 0 END) AS country_stat,
  AVG(CASE WHEN country_group = 'World Avg' THEN hrs ELSE 0 END) AS global_stat
FROM (
  SELECT
    country_iso3
    ,CASE WHEN country_iso3 = ${selectedIsoCode} THEN 'USA' ELSE 'World Avg' END AS country_group,
    Category,
    SUM(hoursPerDayCombined) as hrs
  FROM tt_ghd_countries
  GROUP BY 1,2,3
) a
GROUP BY Category
  ORDER BY 2 desc;
`
)}

function _65(md){return(
md`## CSS`
)}

function _66(htl){return(
htl.html`<style>
  @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Roboto:wght@400;700&display=swap');

.container {
  display: flex;
  flex-direction: row; /* Default: Left-right layout on larger screens */
  justify-content: center;
  align-items: center;
}

.treemap,
.comparison {
  flex-basis: 49%;
}

/* Use media query to switch to top-bottom layout on smaller screens */
@media (max-width: 800px) {
  .container {
    flex-direction: column; /* Top-bottom layout on smaller screens */
  }

  .treemap,
  .comparison {
    flex-basis: auto; /* Reset flex-basis to allow content to determine width */
    width: 100%; /* Force both items to take full width */
  }
}


/* Tooltip arrow (optional, for pointing to the map element) */
.toolTip::before {
  content: "";
  position: absolute;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent rgba(0, 0, 0, 0.7);
  left: 50%;
  bottom: -12px;
  transform: translateX(-50%);
}



  h1, h2, h3 {
    font-family:Oswald;
    max-width:none;
  }

  h1 {
    font-size:45px;
  }

  h2 {
    font-size:35px;
  }

  p {
    font-family: Roboto;
    max-width:none;
  }

  label {
    font-size:16px!important;
    font-weight:bold!important;
  }

  select {
    font-size:16px!important;
  }

  .-swatches-plot-legend {
    font-family:Roboto;
    font-size:14px;
  }


  /* Media query for screens wider than 700px */
@media (min-width: 701px) {
  .vertical-swarm {
    display: none!important; /* Hide vertical_swarm */
  }
}

/* Media query for screens less than 700px */
@media (max-width: 700px) {
  .horizontal-swarm {
    display: none!important; /* Hide horizontal_swarm */
  }
}
  
</style>`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["countries.geojson", {url: new URL("./files/fda2fa7b13c1bd81ebc16555beb918c6a12145cd5a435654314fd15748b601ce4d0a77fe2b07d24249b53903d0ec145de71b47daaf712000714535b298310923.geojson", import.meta.url), mimeType: "application/geo+json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["selectedCountry","md"], _2);
  main.variable(observer("viewof selectedCountry")).define("viewof selectedCountry", ["Inputs","countries"], _selectedCountry);
  main.variable(observer("selectedCountry")).define("selectedCountry", ["Generators", "viewof selectedCountry"], (G, _) => G.input(_));
  main.variable(observer()).define(["treemap","plot2","htl"], _4);
  main.variable(observer()).define(["selectedCountry","md"], _5);
  main.variable(observer("viewof selectedSubcategory")).define("viewof selectedSubcategory", ["Inputs","subcategories","clickedSubcategory"], _selectedSubcategory);
  main.variable(observer("selectedSubcategory")).define("selectedSubcategory", ["Generators", "viewof selectedSubcategory"], (G, _) => G.input(_));
  main.variable(observer("dynamic_text")).define("dynamic_text", ["selectedCountry","decimalToHoursMinutes","textHours","selectedSubcategory","compareHours","textMedian","md"], _dynamic_text);
  main.variable(observer("horizontal_swarm")).define("horizontal_swarm", ["Plot","customTickFormat","subset","selectedIsoCode","getCountryNameByISO3","decimalToHoursMinutes"], _horizontal_swarm);
  main.variable(observer("vertical_swarm")).define("vertical_swarm", ["Plot","customTickFormat","subset","selectedIsoCode"], _vertical_swarm);
  main.variable(observer()).define(["selectedSubcategory","md"], _10);
  main.variable(observer()).define(["Plot","d3","minHours","maxHours","decimalToHoursMinutes"], _11);
  main.define("initial hoveredCountryValue", _hoveredCountryValue);
  main.variable(observer("mutable hoveredCountryValue")).define("mutable hoveredCountryValue", ["Mutable", "initial hoveredCountryValue"], (M, _) => new M(_));
  main.variable(observer("hoveredCountryValue")).define("hoveredCountryValue", ["mutable hoveredCountryValue"], _ => _.generator);
  main.variable(observer("viewof mymap")).define("viewof mymap", ["d3","countriesGeo","subset","mutable hoveredCountryValue"], _mymap);
  main.variable(observer("mymap")).define("mymap", ["Generators", "viewof mymap"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _14);
  main.variable(observer("textHours")).define("textHours", ["subset","selectedSubcategory","selectedIsoCode"], _textHours);
  main.variable(observer("textMedian")).define("textMedian", ["d3","subset","selectedSubcategory"], _textMedian);
  main.variable(observer("compareHours")).define("compareHours", _compareHours);
  main.variable(observer()).define(["decimalToHoursMinutes","textMedian"], _18);
  main.variable(observer()).define(["decimalToHoursMinutes","textHours"], _19);
  main.variable(observer()).define(["decimalToHoursMinutes","textHours","textMedian"], _20);
  main.variable(observer()).define(["compareHours","textHours","textMedian"], _21);
  main.variable(observer("minHours")).define("minHours", ["d3","subset"], _minHours);
  main.variable(observer("maxHours")).define("maxHours", ["d3","subset"], _maxHours);
  main.variable(observer("domain")).define("domain", ["d3","minHours","maxHours"], _domain);
  main.variable(observer("countriesGeo")).define("countriesGeo", ["FileAttachment"], _countriesGeo);
  main.variable(observer()).define(["md"], _26);
  main.variable(observer("voronoiMap")).define("voronoiMap", ["d3","width","margin","height","ellipse","category_hierarchy","colorHierarchy","mutable clickedSubcategory","decimalToHoursMinutes"], _voronoiMap);
  main.variable(observer()).define(["md"], _28);
  main.define("initial clickedSubcategory", _clickedSubcategory);
  main.variable(observer("mutable clickedSubcategory")).define("mutable clickedSubcategory", ["Mutable", "initial clickedSubcategory"], (M, _) => new M(_));
  main.variable(observer("clickedSubcategory")).define("clickedSubcategory", ["mutable clickedSubcategory"], _ => _.generator);
  main.define("initial hoveredCategory", _hoveredCategory);
  main.variable(observer("mutable hoveredCategory")).define("mutable hoveredCategory", ["Mutable", "initial hoveredCategory"], (M, _) => new M(_));
  main.variable(observer("hoveredCategory")).define("hoveredCategory", ["mutable hoveredCategory"], _ => _.generator);
  main.variable(observer("treemap")).define("treemap", ["voronoiMap","hoveredCategory"], _treemap);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["plot2"], _33);
  main.variable(observer("plot2")).define("plot2", ["d3","query","y_axis_list","categoryColor","mutable hoveredCategory","decimalToHoursMinutes"], _plot2);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("height")).define("height", ["margin"], _height);
  main.variable(observer("width")).define("width", ["margin"], _width);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("ellipse")).define("ellipse", ["d3","width","height"], _ellipse);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("flubber")).define("flubber", ["require"], _flubber);
  main.variable(observer()).define(["md"], _43);
  main.variable(observer("customTickFormat")).define("customTickFormat", _customTickFormat);
  main.variable(observer("decimalToHoursMinutes")).define("decimalToHoursMinutes", _decimalToHoursMinutes);
  main.variable(observer("getCountryNameByISO3")).define("getCountryNameByISO3", ["tt_countries"], _getCountryNameByISO3);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer("tt_ghd_countries")).define("tt_ghd_countries", ["d3"], _tt_ghd_countries);
  main.variable(observer("tt_countries")).define("tt_countries", ["d3"], _tt_countries);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer("selectedIsoCode")).define("selectedIsoCode", ["tt_countries","selectedCountry"], _selectedIsoCode);
  main.variable(observer("tt_country")).define("tt_country", ["tt_ghd_countries","selectedIsoCode"], _tt_country);
  main.variable(observer()).define(["md"], _53);
  main.variable(observer("colorHierarchy")).define("colorHierarchy", ["categoryColor"], _colorHierarchy);
  main.variable(observer("categoryColor")).define("categoryColor", _categoryColor);
  main.variable(observer()).define(["md"], _56);
  main.variable(observer("category_hierarchy")).define("category_hierarchy", ["d3","country_nested"], _category_hierarchy);
  main.variable(observer("country_nested")).define("country_nested", ["d3","tt_country"], _country_nested);
  main.variable(observer("countries")).define("countries", ["tt_countries"], _countries);
  main.variable(observer("subcategories")).define("subcategories", ["tt_ghd_countries"], _subcategories);
  main.variable(observer("categories")).define("categories", ["query"], _categories);
  main.variable(observer("y_axis_list")).define("y_axis_list", ["categories"], _y_axis_list);
  main.variable(observer("subset")).define("subset", ["tt_ghd_countries","selectedSubcategory"], _subset);
  main.variable(observer("query")).define("query", ["selectedIsoCode","__query","tt_ghd_countries","invalidation"], _query);
  main.variable(observer()).define(["md"], _65);
  main.variable(observer()).define(["htl"], _66);
  return main;
}
