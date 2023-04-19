class ForceDirectedGraph {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerHeight: _config.containerHeight || 500,
            containerWidth: _config.containerWidth || 140,
            margin: {top: 40, right: 20, bottom: 30, left: 5},
            toolTipPadding: _config.toolTipPadding || 15,
        }

        this.data = _data

        this.initVis()
    }

    initVis() {
        let vis = this;
        
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.chart = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth )
            .attr('height', vis.config.containerHeight)
            .append('g')
                .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    }

    updateVis() {
        let vis = this;

        // Create simulation
        // Force Many Body: Makes elements attract(+) or repel(-) each other
        // Force center: Sets center of gravity
        // Force link: Sets link force based on strength
        // On Tick: updates element position each tick (gives the fun animation)
        vis.simulation = d3.forceSimulation(vis.data.nodes)
            .force('charge', d3.forceManyBody().strength(-800))
            .force('center', d3.forceCenter(vis.width / 2, vis.height / 2))
            .force('link', d3.forceLink().id(l => l.id).strength(l => l.strength))
            .on('tick', ticked);

        // Applies links to the link force
        vis.simulation.force('link').links(vis.data.links)

        // Updates Element Positions
        function ticked() {

            // Node Circle Positions
            vis.nodeElements
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            // Text Label Positions
            vis.textElements
                .attr('x', n => n.x)
                .attr('y', n => n.y)

            // Link Line Positions
            vis.linkElements
                .attr('x1', l => l.source.x)
                .attr('y1', l => l.source.y)
                .attr('x2', l => l.target.x)
                .attr('y2', l => l.target.y)
        }

        // Creates SVG for link lines
        vis.linkElements = vis.chart.append('g')
            .selectAll('line')
            .data(vis.data.links)
            .join('line')
            .attr('stroke-width', 1)
            .attr('stroke', '#E5E5E5')
            .attr('class', 'link')

        // Creates SVG for node circles
        vis.nodeElements = vis.chart.append('g')
            .selectAll('circle')
            .data(vis.data.nodes)
            .join('circle')
              .attr('r', 5)
              .attr('class', 'node')

        // Creates SVG for text labels
        vis.textElements = vis.chart.append('g')
            .selectAll('text')
            .data(vis.data.nodes)
            .join('text')
            .text(n => n.label)
                .attr('font-size', 15)
                .attr('dx', 15)
                .attr('dy', 4)
    }

    renderVis(){
        // Nothing yet
    }
}