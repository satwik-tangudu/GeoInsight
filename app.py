import streamlit as st
import pandas as pd
import json

from src.components.chart1 import render_chart as render_line_chart
from src.components.chart4 import render_pie_chart_with_filter
from src.components.chart3 import render_stacked_bar_chart
from src.components.chart2 import render_chart as render_sunburst_chart
from src.components.chart5 import render_chart as render_treemap
from src.components.chart6 import render_parallel_coordinates_chart
from src.components.chart7 import render_chart as render_diff_chart
from src.components.chart8 import render_chart as render_choropleth_map
from src.components.chart9 import render_chart as render_proportional_symbol_map
from src.components.chart10 import render_chart as render_dot_map
from src.components.chart11 import render_chart as render_chord_chart
from src.components.chart12 import render_chart as render_force_directed_chart
from src.components.chart13 import render_chart as render_circle_packing_chart



internet_data = pd.read_csv('data/Internet_Usage.csv')
education_data = pd.read_csv('data/Education_Expenditure.csv')
fertility_data = pd.read_csv('data/Fertility.csv')
infectious_data = pd.read_csv('data/Infectious_Diseases.csv')
electricity_data = pd.read_csv('data/Total_Electricity.csv')
rates_data = pd.read_csv('data/Rates.csv')
life_expectancy_data = pd.read_csv('data/Life_Expectancy.csv')
armed_forces_data = pd.read_csv('data/Armed_Forces.csv')
enrollment_data = pd.read_csv('data/Enrollment.csv')
cost_export_data = pd.read_csv('data/Cost_Export.csv')
tourism_data = pd.read_csv('data/Tourism_Flow.csv', index_col=0)
trade_data = pd.read_csv('data/Trade.csv')
spending_data = pd.read_csv('data/Spending.csv')



def build_hierarchy(data):
    hierarchy = {"name": "World", "children": []}
    countries = data['Country'].unique()

    for country in countries:
        country_data = data[data['Country'] == country]
        country_node = {"name": country, "children": []}

        cities = country_data['City'].unique()
        for city in cities:
            city_data = country_data[country_data['City'] == city]
            city_node = {"name": city, "children": []}

            sectors = city_data['Government Sector'].unique()
            for sector in sectors:
                sector_value = city_data[city_data['Government Sector'] == sector]['Spending (billion USD)'].values[0]
                sector_node = {"name": sector, "value": sector_value}
                city_node["children"].append(sector_node)

            country_node["children"].append(city_node)
        hierarchy["children"].append(country_node)

    return hierarchy

spending_hierarchy_dict = build_hierarchy(spending_data)

# Convert to JSON format for D3.js
spending_hierarchy_json = json.dumps(spending_hierarchy_dict)


st.set_page_config(layout="wide", page_title="Countries Dashboard", page_icon="🌍")

internet_json = internet_data.to_json(orient='records')
education_data_json = education_data.to_json(orient='records')
fertility_data_json = fertility_data.to_json(orient='records')
rates_data_json = rates_data.to_json(orient='records')
electricity_data_json = electricity_data.to_json(orient='records')
infectious_json = infectious_data.to_json(orient='records')
# tourism_json = tourism_data.to_json(orient='records')
trade_json = trade_data.to_json(orient='records')
spending_json = spending_data.to_json(orient='records')
life_expectancy_json = life_expectancy_data.to_json(orient='records')








st.markdown("""
    <style>
    /* Set background for title container */
    .title-container {
        background-color: #ff7f00;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
    }
    
    /* Set background color for the rest of the page */
    .main-container {
        background-color: #000000;
    }

    /* Title style */
    .title-container h1 {
        color: white;
        font-family: 'Arial', sans-serif;
    }
    
    /* Set background for the chart container */
    .chart-container {
        background-color: white;
        padding: 15px;
        border-radius: 10px;
        margin: 10px;
    }

    /* Custom spacing */
    .block-container {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
    }

    </style>
""", unsafe_allow_html=True)

st.markdown('''
    <style>
    .title-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 200px; /* Adjust height to accommodate both title and subtitle */
        background-color: #ff7f00;  /* Orange color for title background */
        color: white;
        padding-top: 60px;
        text-align: center;
        position: relative;
    }
    h1 {
        margin: 0; /* Remove default margins */
        font-size: 46px;
        position: relative;
    }
    p.subtitle {
        margin: 0;
        font-size: 14px;
        color: white; /* White text for the subtitle */
        position: absolute;
        top: 75%; /* Position it below the title */
        left: 70%; /* Adjust left to align with the middle of the last word */
        transform: translateX(-50%); /* Offset to ensure it aligns with the center of the last word */
    }
    </style>
    <div class="title-container">
        <h1>Country Data Dashboard</h1>
        <p class="subtitle">- An interactive dashboard displaying various metrics for selected countries.</p>
    </div>
    ''', unsafe_allow_html=True)



col1, col2 = st.columns(2)

# First row with Internet Usage and GDP Per Capita charts
with col1:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown("""
    <div style="text-align: center;">
        <h2>Internet Usage</h2>
    </div>
""", unsafe_allow_html=True)
    # st.write("The chart demonstrates the steady growth in internet adoption across five countries and incorporates filtering as an interactive technique, allowing users to focus on specific countries of interest.")
    st.markdown("""
        <p style="margin-bottom: 42px;">
            The chart demonstrates the steady growth in internet adoption across five countries and incorporates filtering as an interactive technique, allowing users to focus on specific countries of interest.
        </p>
        """, unsafe_allow_html=True)

    selected_countries = st.multiselect(
        "Select countries for Internet Usage:",
        options=internet_data.columns[1:],
        default=internet_data.columns[1:6],
    )

    filtered_internet_data = internet_data[['Year'] + selected_countries]
    filtered_internet_json = filtered_internet_data.to_json(orient='records')
    render_line_chart(filtered_internet_json)
    st.markdown('</div>', unsafe_allow_html=True)

with col2:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown("""
    <div style="text-align: center;">
        <h2>Education Expenditure by Year</h2>
    </div>
""", unsafe_allow_html=True)
    st.write("The chart highlights differences in education investment over time. This pie chart displays the distribution of education expenditure across five countries for a selected year, using a filter to show data specific to the chosen year, allowing for easy comparison of resource allocation.")
    # Ensure 'Time Period' is sorted in ascending order (oldest to newest)
    years = education_data['Time Period'].astype(str).sort_values(ascending=True).unique()

    # Dropdown for selecting the year (now in ascending order)
    selected_year = st.selectbox("Select Year:", years)

    # Filter the data for the selected year
    filtered_education_data = education_data[education_data['Time Period'] == int(selected_year)]
    filtered_education_json = filtered_education_data.to_json(orient='records')
    render_pie_chart_with_filter(filtered_education_json)
    st.markdown('</div>', unsafe_allow_html=True)

col3, col4 = st.columns(2)

with col3:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown("""
    <div style="text-align: left; margin-left: 165px;">
        <h2>Total Fertility Rate</h2>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("""
        <p style="margin-right: 100px; margin-top: 10px">
            This chart shows fertility rate trends across five countries over time. The stacked bars display total fertility rates (live births per woman) by country, allowing comparison of changes across periods. Interactive hover effects reveal detailed information, including the year range, country name, and specific fertility rate, highlighting demographic and social shifts.        
        </p>
        """, unsafe_allow_html=True)   
    render_stacked_bar_chart(fertility_data_json)

    st.markdown('</div>', unsafe_allow_html=True)

with col4:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown("""
    <div style="text-align: center;">
        <h2>Socio-Economic Indicators</h2>
    </div>
""", unsafe_allow_html=True)
    st.markdown("""
        <p style="margin-right: 10px; margin-top: 10px; margin-left:20px;">
            This chart displays socio-economic indicators. Each line connects a country’s values across these metrics, making it easy to compare trends and variations. Hovering over lines reveals specific data points for each indicator, enabling detailed analysis.        
        </p>
        """, unsafe_allow_html=True) 
    render_parallel_coordinates_chart(rates_data_json)

col5, col6 = st.columns(2)

with col5:
    # Display the treemap with Streamlit components
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown(
        '''
        <div style="text-align: center;">
            <h2>Total Electricity Production by Country and Type</h2>
        </div>
        ''',
        unsafe_allow_html=True
    )
    st.write("The treemap below displays electricity production data grouped by type and country for the selected year.")
    # Sidebar dropdown for year selection
    year = st.selectbox("Select Year:", ['2018', '2019', '2020', '2021'])

    # Prepare data for hierarchical structure
    # Group data by electricity type and country for the selected year
    grouped_data = (
        electricity_data[['Country', 'Commodity - Transaction', year]]
        .groupby(['Commodity - Transaction', 'Country'])
        .sum()
        .reset_index()
    )

    # Format data to create a nested structure
    nested_data = grouped_data.groupby('Commodity - Transaction').apply(
        lambda x: x[['Country', year]].rename(columns={'Country': 'name', year: 'value'}).to_dict(orient='records')
    ).reset_index().rename(columns={'Commodity - Transaction': 'name', 0: 'children'}).to_dict(orient='records')

    # Convert nested data to JSON format for d3.js
    electricity_json = json.dumps({"name": "Electricity Production", "children": nested_data})

    render_treemap(electricity_json)
    st.markdown('</div>', unsafe_allow_html=True)
    
with col6:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown("""
        <div style="text-align: center;">
            <h2>Infectious Diseases Distribution</h2>
        </div>
    """, unsafe_allow_html=True)
    st.write("This sunburst chart shows the distribution of patient percentages for various infectious diseases, organized by country and year.")

    render_sunburst_chart(infectious_json)
    st.markdown('</div>', unsafe_allow_html=True)

col7, col8 = st.columns(2)
with col7:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown("""
        <div style="text-align: center;">
            <h2>Life Expectancy Difference Chart</h2>
        </div>
    """, unsafe_allow_html=True)
    st.write("This chart illustrates the life expectancy difference between males and females over time for each country.")

    # Multiselect for country selection
    selected_countries = st.multiselect(
        "Select countries to display:",
        options=life_expectancy_data.columns[2:],  # Skip 'Subgroup' and 'Time Period'
        default=life_expectancy_data.columns[2:4]  # Default to the first two countries
    )

    # Filter data for the selected countries
    filtered_data = life_expectancy_data[['Subgroup', 'Time Period'] + selected_countries]
    filtered_json = filtered_data.to_json(orient='records')

    # Render the difference chart
    render_diff_chart(filtered_json)

with col8:
    country_names = tourism_data.columns.tolist()

    # Interface for chord diagram
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown("""
        <div style="text-align: center;">
            <h2>Tourism Flow Between Countries</h2>
        </div>
    """, unsafe_allow_html=True)
    st.write("Select countries to visualize the tourism flow relationships between them.")

    selected_countries = st.multiselect(
        "Select countries:",
        options=country_names,
        default=country_names[:5]  # Select first five countries by default
    )

    # Filter matrix data based on selected countries
    if selected_countries:
        filtered_tourism_data = tourism_data.loc[selected_countries, selected_countries]
        chord_data_json = {
            "names": selected_countries,
            "matrix": filtered_tourism_data.values.tolist()
        }
        chord_data_json_str = json.dumps(chord_data_json)
        
        # Render chord diagram
        render_chord_chart(chord_data_json_str)
    else:
        st.warning("Please select at least one country to display the chord diagram.")





# Render Choropleth Map
st.markdown('<div class="chart-container">', unsafe_allow_html=True)
st.markdown("""
    <div style="text-align: center;">
        <h2>Armed Forces Personnel by Country</h2>
    </div>
""", unsafe_allow_html=True)

# Ensure 'Year' is sorted in ascending order (oldest to newest)
years = armed_forces_data['Year'].astype(str).sort_values(ascending=True).unique()

# Dropdown for selecting the year (now in ascending order)
selected_year = st.selectbox("Select Year:", years)

# Filter the data for the selected year
filtered_data = armed_forces_data[armed_forces_data['Year'] == int(selected_year)]
# Convert filtered data to JSON format for D3.js
filtered_data_json = filtered_data.to_json(orient='records')

render_choropleth_map(filtered_data_json)
st.markdown('</div>', unsafe_allow_html=True)




# Render Proportional Symbol Map
st.markdown('<div class="chart-container">', unsafe_allow_html=True)
st.markdown("""
    <div style="text-align: center;">
        <h2>Primary Education Enrollment by Country</h2>
    </div>
""", unsafe_allow_html=True)

years = enrollment_data['Year'].astype(str).sort_values(ascending=True).unique()

# Dropdown for selecting the year (now in ascending order)
selected_year = st.selectbox("Select Year:", years)

# Filter the data for the selected year
filtered_data = enrollment_data[enrollment_data['Year'] == int(selected_year)]

# Convert filtered data to JSON format for D3.js
filtered_data_json = filtered_data.to_json(orient='records')

render_proportional_symbol_map(filtered_data_json)
st.markdown('</div>', unsafe_allow_html=True)




# Render Dot Map
st.markdown('<div class="chart-container">', unsafe_allow_html=True)
st.markdown("""
    <div style="text-align: center;">
        <h2>Cost to Export by Country</h2>
    </div>
""", unsafe_allow_html=True)
st.markdown("""
<div style="text-align: center; margin-top: 10px;">
    <p style="font-size: 14px; color: #555;">
        <strong>Note:</strong> Each dot represents 2 dollars of export cost.
    </p>
</div>
""", unsafe_allow_html=True)

# Ensure 'Year' is sorted in ascending order (oldest to newest)
years = cost_export_data['Year'].astype(str).sort_values(ascending=True).unique()

# Dropdown for selecting the year (now in ascending order)
selected_year = st.selectbox("Select Year:", years)

# Filter the data for the selected year
filtered_data = cost_export_data[cost_export_data['Year'] == int(selected_year)]

# Convert filtered data to JSON format for D3.js
filtered_data_json = filtered_data.to_json(orient='records')

render_dot_map(filtered_data_json)
st.markdown('</div>', unsafe_allow_html=True)



st.markdown('<div class="chart-container">', unsafe_allow_html=True)
st.markdown("""
<div style="text-align: center;">
    <h2>Trade and Migration Network</h2>
</div>
""", unsafe_allow_html=True)

st.markdown("""
        <div style="text-align: center;">
        <p>
            This force-directed graph visualizes the relationships between countries and trade categories, highlighting trade volume and migration flow dependencies.
        </p>
    </div>
        """, unsafe_allow_html=True)
# Pass data to render the chart
render_force_directed_chart(trade_json)
st.markdown('</div>', unsafe_allow_html=True)




# Render circle packing chart

st.markdown('<div class="chart-container">', unsafe_allow_html=True)
st.markdown("""
    <div style="text-align: center;">
        <h2 style="margin-bottom: 30px;">Government Spending Across Sectors</h2>
    </div>
""", unsafe_allow_html=True)

# Render circle packing chart
render_circle_packing_chart(spending_hierarchy_json)
st.markdown('</div>', unsafe_allow_html=True)