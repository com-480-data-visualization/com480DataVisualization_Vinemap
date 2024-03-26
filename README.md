
=======
# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Sinan ULCAY  | 296887  |
| Malena MENDILAHARZU  | 369702  |
| Carlos CAPELL COLLADO | 377896 |
| Mohammed KERRAZ | 288922 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (29th March, 5pm)

**10% of the final grade**

Welcome to **Vinemap**—your digital sommelier. We aim to create an interactive website to bring to life the rich data of over 100,000 wines from across the globe.

At the heart of Vinemap lies an interactive map, a feature that sets it apart from existing platforms, and serves as the gateway to a richer understanding and appreciation of global wine culture. Did you know that there are over 10,000 grape varieties throughout the world? Each region offers its own incredible stories, grape varieties, and unique wine-making traditions that contribute to the immense diversity of wine.

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

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work

Drawing inspiration from "The World Atlas of Wine" by Hugh Johnson and Jancis Robinson, our project seeks to enhance the way wine enthusiasts explore the world of viticulture and oenology via an innovative digital and interactive map.  This map aims to encapsulate the rich and detailed information found within the book, while providing the added advantage of interactive elements that allow users to easily access the specificities of each region's wine production. Our motivation to pursue this digital transformation stems from the limitations of static print media, which, while informative, cannot offer the dynamic engagement a digital platform can.

During our search for inspiration among previous projects, we came across one particularly interesting project titled "Wine 101."  While this offered valuable insights into the basics of wine tasting, our interests lied in mapping the terroir and climate that define each wine region, thereby presenting a more rounded perspective of the global wine landscape. The originality of our approach lies not just in the map’s interactivity but in its educational potential to transform casual wine appreciation into a well-informed hobby. Through this project, we present a comprehensive global overview of wine production, while simultaneously offering detailed insights into each individual wine, ensuring a balanced exploration at both large and small scales.


## Milestone 2 (26th April, 5pm)

**10% of the final grade**


## Milestone 3 (31st May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

>>>>>>> f80772e6b268d652a14c1f7311726e79421e3d4b
