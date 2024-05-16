const container = d3.select("#my_dataviz").node();

// Get the width and height of the container
const width = container.clientWidth;
const height = container.clientHeight;


let svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .append("g");

  svg.attr("viewBox", `0 0 ${width} ${height}`);

let node;
let simulation;
var xScale, yScale, color, size, yAxis;

// Container for nodes
let nodeG = svg.append("g")
  .attr("class", "nodes");

let allData = [];
let dataSubset = [];
let dataBeingUsed = [];

// Function to get a random subset of data
function getRandomSubset(data, size = 210) {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
}

// Load data and initialize plot
d3.csv("short_wines.csv").then(function(data) {
    data.forEach(d => {
        d.price = +d.price;
        d.points = +d.points;
    });

    allData = data.map(d => ({
        ...d,
        price: +d.price,
        points: +d.points
    }));

    // Select a random subset of 100 wines to display initially
    dataSubset = getRandomSubset(allData);
    initializePlot(dataSubset);  // Call function to create the plot with initial subset
    setupSliders(); // Initialize sliders after data is ready
});

function initializePlot(data) {
    nodeG.selectAll("*").remove(); // Clear the previous plot

    // If length data > 210, getRandomSubset
    if (data.length > 210) {
        data = getRandomSubset(data);
    }

    dataBeingUsed = data; // Store the data being used for filtering

    // Previous code for setting up colors, sizes, tooltip, etc.
    color = d3.scaleSequential(d3.interpolateRdYlGn)
        .domain(d3.extent(data, d => d.points));  // Dynamically set the domain to the lowest and highest scores

    const maxRadius = 10;  // Maximum node radius
    size = d3.scaleLog()
        .domain([Math.max(0.1, d3.min(data, d => d.price)), d3.max(data, d => d.price)])
        .range([3, maxRadius])
        .clamp(true);

    // Scales for the position of nodes
    xScale = d3.scaleLog()
        .domain(d3.extent(data, d => d.price))
        .range([0.07*width + maxRadius, width - 0.05*width - maxRadius]); // Adjusted for max node radius

    yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.points))
        .range([height - 0.078*height - maxRadius, 0 + maxRadius]); // Inverted and adjusted for max node radius

    svg.selectAll(".x-axis").remove();
    svg.selectAll(".y-axis").remove();
    
    // Create and append new x-axis
    const xAxis = d3.axisBottom(xScale)
        .ticks(5, "~s")  // Reduced number of ticks for better readability
        .tickFormat(d => `$${d.toLocaleString()}`); // Simplified tick formatting

    const xAxisG = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - 40})`)
        .call(xAxis);

    // Rotate x-axis tick labels for better readability
    xAxisG.selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em")
        .attr("transform", "rotate(-35)");

    // Create and append new y-axis
    yAxis = d3.axisLeft(yScale)
        .ticks(5) // Reduced number of ticks for better readability
        .tickFormat(d => `${d} pts`); // Custom formatting for clarity

    // Enter nodes
    enterNodes(data);
    
}



function enterNodes(data) {
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(40,0)`)
        .call(yAxis);

    function updateDetailPanel(d) {
        const detailPanel = d3.select(".detail-panel");

        // Update the table with the new data
        detailPanel.select("#country-value").text(d.country);
        detailPanel.select("#description-value").text(d.description);
        detailPanel.select("#designation-value").text(d.designation);
        detailPanel.select("#points-value").text(d.points);
        detailPanel.select("#price-value").text(`$${d.price}`);
        detailPanel.select("#province-value").text(d.province);
        detailPanel.select("#title-value").text(d.title);
        detailPanel.select("#variety-value").text(d.variety);
        detailPanel.select("#winery-value").text(d.winery);
        
        // Ensure the panel is visible
        detailPanel.style("opacity", 1);
    }

    var mouseover = function(event, d) {
        updateDetailPanel(d);
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 2);
    };
    
    var mouseleave = function(event, d) {
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 1);
    };

    // INSERT NODES
    // --------------------
    node = nodeG.selectAll("circle").data(data, d => d.id || d.winery + d.title);

    // Exit and remove old elements not present in new data
    node.exit().remove();
    
    // Enter new elements
    const nodeEnter = node.enter().append("circle")
        .attr("cx", d => xScale(d.price)) // Position according to price
        .attr("cy", d => yScale(d.points)) // Position according to points
        .style("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node = nodeEnter.merge(node)
        .attr("r", d => size(d.price))
        .style("fill", d => color(d.points))  // Use the color scale based on points
        .style("fill-opacity", 0.9);

    // DRAGGING CIRCLES
    // --------------------
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        // Optionally comment out the next two lines to let the node float freely after drag
        d.fx = null;
        d.fy = null;
    }
    
    data.forEach(d => {
        d.fx = xScale(d.price); // Fix nodes horizontally
        d.fy = yScale(d.points); // Fix nodes vertically
        delete d.fx;
        delete d.fy;

    });

    // Initialize simulation with data
    startSimulation(data, size);

}







function startSimulation(data, size) {
    if (simulation) {
        simulation.stop(); // Stops the current simulation if it's running
    }

    simulation = d3.forceSimulation(data)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(d => xScale(d.price)).strength(0.1))
        .force("y", d3.forceY(d => yScale(d.points)).strength(0.1))
        .force("charge", d3.forceManyBody().strength(0.1))
        .force("collide", d3.forceCollide().radius(d => size(d.price) + 1))
        .on("tick", ticked);

    // Optional: Remove center force, or use it conditionally
    simulation.force("center", null); // If you don't want nodes to gravitate towards center

    function ticked() {
        node
            .attr("cx", d => Math.max(40 + size(d.price), Math.min(width - 40 - size(d.price), d.x)))
            .attr("cy", d => Math.max(40 + size(d.price), Math.min(height - 40 - size(d.price), d.y)));
    }

}

// RESET FILTER
document.addEventListener('DOMContentLoaded', function() {
    var removeFilterButton = document.getElementById('removeFilterButton');
    removeFilterButton.addEventListener('click', removeFilter);
});

function removeFilter() {
    // Redraw the plot with all the data
    console.log(`Width: ${width}, Height: ${height}`);
    initializePlot(dataSubset);
    resetSliders();
    clearWineryDetailPanel();
    deleteWordCloud();
}



// RESET AND SHUFFLE
document.addEventListener('DOMContentLoaded', function() {
    var resetShuffleButton = document.getElementById('resetShuffleButton');
    resetShuffleButton.addEventListener('click', resetShuffle);
});

function resetShuffle() {
    // Redraw the plot with all the data
    dataSubset = getRandomSubset(allData);
    initializePlot(dataSubset);
    resetSliders();
    clearWineryDetailPanel();
    deleteWordCloud();
}











// Function to setup sliders with optimized event handling
function setupSliders() {
    if (!dataBeingUsed || dataBeingUsed.length === 0) {
        console.error('No data available to setup sliders.');
        return;
    }

    // Calculate and cache the price and points ranges
    const priceRange = calculateRange(dataBeingUsed, 'price');
    const pointsRange = calculateRange(dataBeingUsed, 'points');

    // Setup price slider
    setupSlider('priceSlider', priceRange, (values) => {
        document.getElementById('priceDisplay').textContent = `Range: $${parseInt(values[0])} - $${parseInt(values[1])}`;
        applyFilters();
    });

    // Setup points slider
    setupSlider('pointsSlider', pointsRange, (values) => {
        document.getElementById('pointsDisplay').textContent = `Range: ${parseInt(values[0])} - ${parseInt(values[1])}`;
        applyFilters();
    });
}

// Helper function to setup individual slider
function setupSlider(elementId, range, onUpdate) {
    const sliderElement = document.getElementById(elementId);
    if (sliderElement.noUiSlider) {
        sliderElement.noUiSlider.destroy();
    }

    // Ensure range values are numeric
    if (isNaN(range.min) || isNaN(range.max)) {
        console.error(`Invalid range for ${elementId}:`, range);
        return;
    }

    noUiSlider.create(sliderElement, {
        start: [range.min, range.max],
        connect: true,
        range: {
            'min': range.min,
            'max': range.max
        }
    });
    sliderElement.noUiSlider.on('update', onUpdate);
}

// Helper function to calculate min and max range for a given field
function calculateRange(data, field) {
    const values = data.map(item => item[field]).filter(value => !isNaN(value)); // Filter out non-numeric values
    return {
        min: Math.min(...values),
        max: Math.max(...values)
    };
}

// Function to apply filters and update plot based on slider values
function applyFilters() {
    const priceSliderElement = document.getElementById('priceSlider');
    const pointsSliderElement = document.getElementById('pointsSlider');

    if (!priceSliderElement || !priceSliderElement.noUiSlider || !pointsSliderElement || !pointsSliderElement.noUiSlider) {
        console.error('Sliders not initialized correctly.');
        return;
    }

    const priceValues = priceSliderElement.noUiSlider.get();
    const pointsValues = pointsSliderElement.noUiSlider.get();
    const priceMin = parseInt(priceValues[0], 10);
    const priceMax = parseInt(priceValues[1], 10);
    const pointsMin = parseInt(pointsValues[0], 10);
    const pointsMax = parseInt(pointsValues[1], 10);

    const filteredData = dataBeingUsed.filter(d => {
        return d.price >= priceMin && d.price <= priceMax &&
               d.points >= pointsMin && d.points <= pointsMax;
    });

    enterNodes(filteredData);
}



function resetSliders() {
    const priceRange = {
        min: Math.min(...dataBeingUsed.map(d => d.price)),
        max: Math.max(...dataBeingUsed.map(d => d.price))
    };
    const pointsRange = {
        min: Math.min(...dataBeingUsed.map(d => d.points)),
        max: Math.max(...dataBeingUsed.map(d => d.points))
    };

    // Reset price slider
    var priceSlider = document.getElementById('priceSlider').noUiSlider;
    priceSlider.updateOptions({
        range: {
            'min': priceRange.min,
            'max': priceRange.max
        }
    });
    priceSlider.set([priceRange.min, priceRange.max]);
    document.getElementById('priceDisplay').textContent = `Range: $${priceRange.min} - $${priceRange.max}`;

    // Reset points slider
    var pointsSlider = document.getElementById('pointsSlider').noUiSlider;
    pointsSlider.updateOptions({
        range: {
            'min': pointsRange.min,
            'max': pointsRange.max
        }
    });
    pointsSlider.set([pointsRange.min, pointsRange.max]);
    document.getElementById('pointsDisplay').textContent = `Range: ${pointsRange.min} - ${pointsRange.max}`;
}




















const userCardTemplate = document.querySelector("[data-user-template]");
const userCardContainer = document.querySelector("[data-user-cards-container]");
const searchInput = document.querySelector("[data-search]");

let users = [];
let hideDropdownTimer;



  searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    userCardContainer.innerHTML = '';  // Clear previous results
    let count = 0;  // Initialize counter for displayed cards

    users.forEach(user => {
        const isVisible = user.name.toLowerCase().includes(value);
        if (isVisible && count < 15) {
            const card = user.element.cloneNode(true);  // Clone the element to add to the container
            card.addEventListener('click', () => {
                console.log(`Card for winery ${user.name} clicked`);
                selectWinery(user.name);
                setupSliders();
            });
            userCardContainer.append(card);
            count++;
        }
    });

    if (count === 0) {
        userCardContainer.style.display = 'none';
    } else {
        userCardContainer.style.display = 'block';
    }
});








function selectWinery(wineryName) {
    console.log(`Selecting winery: ${wineryName}`);
    const wineryInfo = users.find(user => user.name === wineryName);
    console.log('Winery Info:', wineryInfo);

    if (wineryInfo) {
        updateWineryDetailPanel(wineryInfo.data);
        const filteredData = allData.filter(d => d.winery.toLowerCase() === wineryName.toLowerCase());
        generateWordCloud(filteredData);

        // list of descriptions of filteredData
        const descriptions = filteredData.map(d => d.description);
        console.log('Descriptions:', descriptions);
        console.log('Filtered Wine Data:', filteredData);
        if (filteredData.length > 0) {
            initializePlot(filteredData);
        } else {
            nodeG.selectAll("*").remove(); // Remove all circles if no data matches
            if (simulation) simulation.stop(); // Stop the simulation if no data
        }
    } else {
        clearWineryDetailPanel();
        deleteWordCloud();
    }
}





// Function to update the winery details panel
function updateWineryDetailPanel(d) {
    console.log("Updating detail panel with data:", d); // Debugging: log the data object

    const detailPanel = d3.select(".detail-panel-2");

    detailPanel.select("#Winery-winery").text(d.winery);
    detailPanel.select("#Country-winery").text(d.country.replace(/[{}'"]/g, "").split(",").map(country => country.trim()).join(", "));
    detailPanel.select("#Number-winery").text(d.num_wines);
    detailPanel.select("#Provinces-winery").text(d.provinces.replace(/[{}'"]/g, "").split(",").map(province => province.trim()).join(", "));
    detailPanel.select("#MeanPrice-winery").text(d.mean_price ? `$${d.mean_price.toFixed(2)}` : "N/A");
    detailPanel.select("#MinPrice-winery").text(d.min_price ? `$${d.min_price.toFixed(2)}` : "N/A");
    detailPanel.select("#MaxPrice-winery").text(d.max_price ? `$${d.max_price.toFixed(2)}` : "N/A");
    detailPanel.select("#MedianPrice-winery").text(d.median_price ? `$${d.median_price.toFixed(2)}` : "N/A");
    detailPanel.select("#PriceStdDev-winery").text(d.price_std_dev ? d.price_std_dev.toFixed(2) : "N/A");
    detailPanel.select("#MeanScore-winery").text(d.mean_score ? d.mean_score.toFixed(2) : "N/A");
    detailPanel.select("#MinScore-winery").text(d.min_score ? d.min_score.toFixed(2) : "N/A");
    detailPanel.select("#MaxScore-winery").text(d.max_score ? d.max_score.toFixed(2) : "N/A");
    detailPanel.select("#MedianScore-winery").text(d.median_score ? d.median_score.toFixed(2) : "N/A");
    detailPanel.select("#ScoreStdDev-winery").text(d.score_std_dev ? d.score_std_dev.toFixed(2) : "N/A");
    detailPanel.select("#Designations-winery").text(d.designations.replace(/[{}'"]/g, "").split(",").map(designation => designation.trim()).join(", "));
    detailPanel.select("#Varieties-winery").text(d.varieties.replace(/[{}'"]/g, "").split(",").map(variety => variety.trim()).join(", "));

    // Ensure the panel is visible
    detailPanel.style("opacity", 1);
}



function updateDetailPanel(d) {
    const detailPanel = d3.select(".detail-panel");
    
    // Update the table with the new data
    detailPanel.select("#country-value").text(d.country);
    detailPanel.select("#description-value").text(d.description);
    detailPanel.select("#designation-value").text(d.designation);
    detailPanel.select("#points-value").text(d.points);
    detailPanel.select("#price-value").text(`$${d.price}`);
    detailPanel.select("#province-value").text(d.province);
    detailPanel.select("#title-value").text(d.title);
    detailPanel.select("#variety-value").text(d.variety);
    detailPanel.select("#winery-value").text(d.winery);
    
    // Ensure the panel is visible
    detailPanel.style("opacity", 1);
}




// Function to clear the winery details panel
function clearWineryDetailPanel() {
    const detailPanel = d3.select(".detail-panel-2");

    detailPanel.selectAll("td").text('');

    // Ensure the panel is hidden
    detailPanel.style("opacity", 0);
}















// Close the dropdown when clicking outside of the input box
document.addEventListener('click', function(event) {
    const isClickInside = searchInput.contains(event.target) || userCardContainer.contains(event.target);
    if (!isClickInside) {
        userCardContainer.style.display = 'none';
    }
});

// Event listener for focus
searchInput.addEventListener("focus", () => {
  if (searchInput.value) { // Only display dropdown if there's something in the input
    userCardContainer.style.display = 'block';
  }
});

// Event listener for blur
searchInput.addEventListener("blur", () => {
  // Use a timeout to delay hiding to allow for click events on dropdown items
  hideDropdownTimer = setTimeout(() => {
    userCardContainer.style.display = 'none';
  }, 200); // Short delay to catch click events on dropdown items
});




let allWineries = [];

d3.csv("wineries_info.csv").then(data => {
    allWineries = data.map(d => {

        const card = userCardTemplate.content.cloneNode(true).children[0];
        const header = card.querySelector("[data-header]");
        const subtext = card.querySelector("[data-subtext]"); // Subtext for countries

        header.textContent = d.winery;

        // Extract and clean up countries
        let countries = d.country.replace(/[{}'"]/g, "").split(","); // Remove braces, single and double quotes, and split by comma
        countries = countries.map(country => country.trim()); // Trim whitespace from each country
        if (countries.length > 10) {
          countries = countries.slice(0, 10); 
        }
        subtext.textContent = countries.join(", "); // Join countries with a comma
        subtext.style.color = 'lightgray'; // Set the color to light gray for the countries

        // Parse numerical values
        const parsedData = {
            ...d,
            min_price: parseFloat(d.min_price),
            max_price: parseFloat(d.max_price),
            mean_price: parseFloat(d.mean_price),
            median_price: parseFloat(d.median_price),
            price_std_dev: parseFloat(d.price_std_dev),
            min_score: parseFloat(d.min_score),
            max_score: parseFloat(d.max_score),
            mean_score: parseFloat(d.mean_score),
            median_score: parseFloat(d.median_score),
            score_std_dev: parseFloat(d.score_std_dev),
            num_wines: parseInt(d.num_wines)
        };

        return { 
            name: d.winery, 
            element: card, 
            data: parsedData
        }; // Store card element and parsed data in the user object
    });

    users = allWineries; // Set users to allWineries after parsing
}).catch(error => console.error("Error fetching data:", error));


















// WORD CLOUD

function generateWordCloud(data) {
    let wordCounts = {};
    const widthwc = 500; // Smaller width
    const heightwc = 300; // Smaller height

    const customStopWords = ['its', 'drink', 'wine', 'winery', 'wines', 'wineries', 'shows', 'show', 'price', 'body', 'bodied'];


    // Process each item's description
    data.forEach(item => {
        // Split description into words, remove punctuation, and convert to lowercase
        let words = item.description.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").toLowerCase().split(" ");

        // Remove stopwords using the stopword library's default English stopwords
        let filteredWords = sw.removeStopwords(words);

        // Count each word's frequency
        filteredWords.forEach(word => {
            if (!customStopWords.includes(word) && word.length > 1) {  // Filter out single characters
                wordCounts[word] = (wordCounts[word] || 0) + 1;
            }
        });
    });

    // Convert word counts to an array, sort by frequency, and take the top 20
    const wordEntries = Object.entries(wordCounts)
        .map(([text, size]) => ({text, size}))
        .sort((a, b) => b.size - a.size)
        .slice(0, 20);  // Only include the top 20 words

    // Setup D3 color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Setup the word cloud layout
    const layout = d3.layout.cloud()
        .size([widthwc, heightwc])
        .words(wordEntries)
        .padding(5)  // Increased padding to prevent overlap
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
        .fontSize(d => Math.max(20, Math.min(d.size * 1.5, 60)))  // Dynamic font size scaling
        .on("end", draw);

    layout.start();

    function draw(words) {
        const svg = d3.select("#word-cloud").append("svg")
            .attr("width", widthwc)
            .attr("height", heightwc)
            .append("g")
            .attr("transform", "translate(250,150)");  // Adjusted centering for the smaller size

        svg.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-family", "Impact")
            .style("fill", (d, i) => color(i))
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
            .text(d => d.text);
    }
}


function deleteWordCloud() {
    const svg = d3.select("#word-cloud svg");
    svg.remove();
}




