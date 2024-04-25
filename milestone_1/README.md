## Milestone 1 (29th March, 5pm)

**10% of the final grade**

Welcome to **Vinemap**—your digital sommelier. We aim to create an interactive website to bring to life the rich data of over 100,000 wines from across the globe.

At the heart of Vinemap lies an interactive map, a feature that sets it apart from existing platforms, as the main goal of Vinemap is to serve as the gateway to a richer understanding and appreciation of _global_ wine culture. Did you know that there are over 10,000 grape varieties throughout the world? Each region offers its own incredible stories, grape varieties, and unique wine-making traditions that contribute to the immense diversity of wine.

But Vinemap will be more than just a map; a toolkit for any wine lovers that will match you to your specific tastes, budget, and a particular fondness for regional wines.

Join us on this expedition to explore and celebrate the diversity of wines from across the world.

<span style="color:gray">*(add the word count of this intro to Problematic section).*</span>


### Dataset

**Wine Information**

The dataset we have selected contains data on ~130k wine reviews published to WineEnthusiast, and can be accessed [here](https://www.kaggle.com/datasets/mysarahmadbhat/wine-tasting).

The information provided in the dataset are as follows:

- **Wine identification**: `id` (unique identifier for each entry), `winery`, `title` (of wine review). 
- **Geographic description**: `country`, `province` (canton, state, province...), `region_1` and `region_2` (more specific location).
- **Description**: `description` (tasting notes provided for the wine).
- **Wine Characteristics**: `points` (rating), `price`, `designation`, `variety`.
- **Taster (reviewer) Characteristics**: `taster_name`, `taster_twitter_handle`.

Preprocessing will focus on addressing inconsistencies arising from it coming from a non-standarized community of wine enthusiasts. This may include incorrect or missing wine information, as well as grouping reviews that refer to the same wine. Another key preprocessing step is standardizing geographical information to a format that can be displayed on the interactive map.


**Geographic Information**

To enhance the understanding of how geographic factors influence wine characteristics, we will integrate additional datasets focusing on climate data and the social, cultural, and economic attributes of each region.

- **Climate Data**: Region-specific climate data, including temperature and humidity insights, can be found [here](https://www.kaggle.com/datasets/goyaladi/climate-insights-dataset?select=climate_change_data.csv).
- **Regional Characteristics**: Data on the social, cultural, and economic aspects of each region is available in the World Factbook from the US CIA, with a cleaned version accessible [here](https://www.kaggle.com/datasets/usdod/world-factbook-country-profiles). Further details on data scraping are provided [here](https://github.com/factbook/factbook.json).

Preprocessing will consist on matching the locations from these datasets to those of the wine reviews. Furthermore, the World Factbook dataset contains more data than needed, so it fill be filtered to focus on the parameters relevant to the project.


### Problematic

Today, there are numerous resources to get information about wine, such as [Vivino](https://www.vivino.com/), [Wine Spectator](https://www.winespectator.com/), [Wine Enthusiast](https://www.winemag.com/), or [Decanter](https://www.decanter.com/). While they all provide comprehensive data about different wines, none of them is organized around the geographic aspect of the wine. Our visualization's main objective is to enhance the discovery and appreciation of wines from around the world by integrating detailed wine characteristics with geographic and climatic data.

Key Features of Vinemap Visualization:

- **Interactive World Wine Map**: geographical distribution of wines, showing common characteristics, what types of wine are produced in each region, differences in prices, tastes, etc.
- **Wine Recommender Tool**: match taste preferences, budget, and interest in regional varieties with wines.
- **Insights into Wine Characteristics and Terroir**: how geographic, climatic, and cultural factors influence the flavor profiles and qualities of wines.


### Exploratory Data Analysis




#### Distribution of Wine Scores
<img src="charts/winescores.png" width="700" height="400">

- Wine scores are centered around 88 to 90 points, indicating a generally high quality across the dataset.

#### Distribution of Wine Prices
<img src="charts/wineprices.png" width="700" height="400">

- Prices are right-skewed, with most wines in the lower price range and a few expensive outliers.

#### Relationship between Price and Points
<img src="charts/price&points.png" width="700" height="400">

- There is no strong linear relationship between price and points; high-priced wines do not necessarily have higher scores.

#### Distribution of Wines by Country

<img src="charts/countries.png" width="600" height="600">
- The United States, France, and Italy are the top countries by number of wines listed.
- These countries are major players in the global wine market, with a significant number of wines produced.


#### Wine Production by Province


<img src="charts/provinces.png" width="700" height="1600">

- **United States**: California significantly leads in wine production.
- **Italy**: Tuscany, Piedmont, and Veneto are major wine-producing regions.
- **France**: A balanced wine production with regions like Burgundy and Alsace at the forefront.
- **Spain**: Northern Spain is the top producing region, followed by Catalonia, Levante and Andalucia.
- **Portugal**: Douro and Alentejo are key to Portugal's wine production.

#### Wine Variety Popularity
<img src="charts/varieties.png" width="600" height="600">

The pie chart shows Pinot Noir and Chardonnay as the most popular varieties, with a notable presence of Cabernet Sauvignon and Red Blend.

#### Distribution of Wine Years
<img src="charts/years.png" width="700" height="400">

There is a peak in recent vintages, particularly around 2010 to 2013, indicating a trend towards newer wines.



### Related work

Drawing inspiration from "The World Atlas of Wine" by Hugh Johnson and Jancis Robinson, our project seeks to enhance the way wine enthusiasts explore the world of viticulture and oenology via an innovative digital and interactive map.  This map aims to encapsulate the rich and detailed information found within the book, while providing the added advantage of interactive elements that allow users to easily access the specificities of each region's wine production. Our motivation to pursue this digital transformation stems from the limitations of static print media, which, while informative, cannot offer the dynamic engagement a digital platform can.

During our search for inspiration among previous projects, we came across one particularly interesting project titled "Wine 101."  While this offered valuable insights into the basics of wine tasting, our interests lied in mapping the terroir and climate that define each wine region, thereby presenting a more rounded perspective of the global wine landscape. The originality of our approach lies not just in the map’s interactivity but in its educational potential to transform casual wine appreciation into a well-informed hobby. Through this project, we present a comprehensive global overview of wine production, while simultaneously offering detailed insights into each individual wine, ensuring a balanced exploration at both large and small scales.
