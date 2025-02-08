import streamlit.components.v1 as components

def render_pie_chart_with_filter(data_json):
    # Read the d3.min.js file from node_modules
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    # Read your custom chart JS
    with open("src/assets/chart4.js") as chart_file:
        script = chart_file.read()

    # Inject both d3.min.js and your custom chart4.js into the HTML
    components.html(
        f"""
        <div id="pie-chart"></div>
        <script>
            {d3_script}  <!-- Injected D3 code -->
        </script>
        <script>
            {script}     <!-- Injected custom chart JS -->
            drawPieChart({data_json});  <!-- Call your pie chart function -->
        </script>
        """,
        height=500,
    )
