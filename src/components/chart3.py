import streamlit.components.v1 as components

def render_stacked_bar_chart(data_json):
    with open("node_modules/d3/dist/d3.min.js") as d3_file:
        d3_script = d3_file.read()

    with open("src/assets/chart3.js") as chart_file:
        script = chart_file.read()

    components.html(
        f"""
        <div id="bar-chart"></div>
        <script>
            {d3_script}
        </script>
        <script>
            {script}
            drawStackedBarChart({data_json});
        </script>
        """,
        height=500,
    )