class Histogram {
    
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
        vis.getEpId = (d) => d.season + "-" + d.ep_num

        vis.mainCharacters = ["Finn", "BMO", "Princess Bubblegum","Flame Princess", "Jake", "LSP", "Ice King", "Marceline", "Lady Rainicorn", "Tree Trunks"];

        // Set up chart area
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
    
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`);
        
        // Initialize scales
        vis.xScale = d3.scaleBand()
            .range([0, vis.width]);
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.colorScale = d3.scaleOrdinal()
        .domain(["Finn", "Jake", "Princess Bubblegum", "Ice King", "BMO", "Lady Rainicorn", "Tree Trunks", "LSP", "Marceline", "Flame Princess"])
        .range([vis.finnColor, vis.jakeColor, vis.bubblegumColor, vis.iceColor, vis.BMOColor, vis.rainacornColor, vis.treeTrunkColor, vis.lumpyColor, vis.vampireColor, vis.flameColor]);
    
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0)
            // .tickFormat(x => /[0-9]-1/.test(x) ? x : "")
            .tickValues(['1-1', '2-1', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '10-1']);
        vis.yAxis = d3.axisLeft(vis.yScale).tickSizeOuter(0);
    
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
            .text('Character Representation (by Lines)')
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
            .text('Episodes');
            
    }

    updateVis() {
        let vis = this;

        // TODO: Data processing
        vis.stackedData = []

        let lineKeysMain = vis.mainCharacters
        for (let i = 0; i < lineKeysMain.length; i++) {
            lineKeysMain[i] = 'lines_' + getId(lineKeysMain[i])
        }
        lineKeysMain.push('lines_other')

        // Stack order reversed to place Other at the bottom
        vis.stack = d3.stack().keys(lineKeysMain).order(d3.stackOrderReverse)
        vis.epData = vis.data.episodeData

        vis.epData.forEach(d => {
            let lineKeys = Object.getOwnPropertyNames(d).filter(d => {return d.includes('lines_')})

            d.lines_other = 0
            d.otherChars = 0

            for (let key of lineKeys) {
                // If the current key isn't for one of the main characters
                if (!lineKeysMain.some(keyMain => key == keyMain)) {
                    d.lines_other += d[key]
                    d.otherChars++
                }
            }
        })

        vis.stackedData = vis.stack(vis.epData)

        vis.xValue = d => d.id;
        vis.yValue = d => d.linesTotal;

        vis.xScale.domain(vis.epData.map(m => vis.xValue(m)))
        vis.yScale.domain(d3.extent(vis.epData, d => vis.yValue(d)))

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // TODO Add rectangles
        vis.rectangles = vis.chart.selectAll('epBar')
            .data(vis.stackedData)
            .join('g')
                .attr('class', d => `epBar char-${d.key.replace('lines_', '')}`)
                .selectAll('rect')
                    .data(d => d)
                    .join('rect')
                        .attr('x', d => vis.xScale(d.data.id) + 1)
                        .attr('y', d => vis.yScale(d[1]))
                        .attr('height', d => vis.yScale(d[0]) - vis.yScale(d[1]))
                        .attr('width', vis.xScale.bandwidth() - 2);

        // Update axes
        vis.xAxisGroup.transition().duration(1600).call(vis.xAxis);
        vis.yAxisGroup.transition().duration(1600).call(vis.yAxis);
    }
}