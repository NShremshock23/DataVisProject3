class Scatterplot {
    
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 600,
            margin: { top: 30, bottom: 50, right: 60, left: 60}
        }

        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.getId = (d) => d.toLowerCase().replace(/\s+/g, '').replace('\'', '').replace('\"', '')

        // Set up chart area
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

            vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);

        // Initialize line
        vis.linePath = vis.chart.append('path')
            .attr('class', 'chart-line');
        
        // Initialize linear scales
        // Domain for each scale is set in updateVis() to match possibly filtered data
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);
    
        vis.xScale = d3.scaleLinear()
            .range([0, vis.width]);
    
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);
    
        // Draw axes (at first without accurate scale domains, fixed by renderVis)
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`) 
            .call(vis.xAxis);

        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);
        
        // Append Y axis title
        vis.yAxisTitle = vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('text-anchor', 'middle')
            .attr('x', 15)
            .attr('y', (vis.height / 2) + vis.config.margin.top)
            .text('Total Dialog (Lines)')
            .attr('dy', 1)
            
        // Rotate title
        vis.yAxisTitle
            .attr('transform', `rotate(270, ${vis.yAxisTitle.attr('x')}, ${vis.yAxisTitle.attr('y')})`);

        // Append X axis title
        vis.xAxisTitle = vis.svg.append('text')
            .attr('class', 'axis-title')
            .attr('x', (vis.width / 2) + vis.config.margin.left)
            .attr('y', vis.height + vis.config.margin.top + 40)
            .attr('text-anchor', 'middle')
            .text('# Episodes Appeared In');
    }

    updateVis() {
        let vis = this;

        vis.characters = []

        vis.data.forEach(d => {
            if (d.character != '') {
                // console.log(d.character)
                // console.log(vis.getId(d.character))

                let character = vis.characters.find((o, i) => { 
                    if (o.id == vis.getId(d.character)) {
                        // Count line
                        o.lines++
                        
                        // Count the ep if it hasn't already been counted for current character (ASSUMES CHRONOLOGICAL DATA ORDER)
                        if (o.lastSeason < d.season || (o.lastSeason == d.season && o.lastEp < +d.ep_num)) {
                            o.episodes++
                            o.lastSeason = +d.season
                            o.lastEp = +d.ep_num
                        }
                        return true
                    }
                })

                // Add a record for the current character if they don't already have one
                if (!character) {
                    vis.characters.push({
                        'id': vis.getId(d.character),
                        'name': d.character,
                        'episodes': 1,
                        'lines': 1,
                        'words': 0,     // TODO
                        'lastSeason': +d.season,
                        'lastEp': +d.ep_num
                    })
                }
            }
        })

        console.log(vis.characters)

        vis.xValue = d => d.episodes;
        vis.yValue = d => d.lines;

        // Domains are scaled to give some space between extreme values and chart borders/axes
        vis.xScale.domain(d3.extent(vis.characters, d => vis.xValue(d)));
        vis.yScale.domain(d3.extent(vis.characters, d => vis.yValue(d)));

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // Add circles
        vis.circles = vis.chart.selectAll('.point')
            .data(vis.characters)
            .join('circle')
                .attr('class', 'point')
                .attr('r', 4)
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('fill', 'steelblue')
                .on('mouseover', (event,d) => {
                    d3.select('#tooltip')
                        .style('display', 'block')
                        .style('left', (event.pageX + 10) + 'px')   
                        .style('top', (event.pageY + 10) + 'px')
                        .style('text-align', 'left')
                        .html(`
                            <div class="tooltip-title">${d.name}</div>
                            <div>Episode Appearances: ${d.episodes}</div>
                            <div>Lines of Dialog: ${d.lines}</div>
                        `);
                })
                .on('mouseleave', () => {
                    d3.select('#tooltip').style('display', 'none');
                })

        // Update axes
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }
}