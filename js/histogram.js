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

        vis.getEpId = (d) => d.season + "-" + d.ep_num

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
    
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0);
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

        vis.data.episodeData.forEach(d => {
            
        })

        // vis.xValue = d => d.episodes;
        // vis.yValue = d => d.lines;

        // vis.xScale.domain(extent[...])
        // vis.yScale.domain(extent[...])

        vis.renderVis();
    }

    renderVis() {
        let vis = this;

        // TODO Add rectangles
        vis.circles = vis.chart.selectAll('.point')
            .data(vis.data.characterData)
            .join('circle')
                .attr('class', 'point')
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
                            <div>Scene Appearances: ${d.scenes}</div>
                            <div>Lines of Dialog: ${d.lines}</div>
                            <div>Total Words Spoken: ${d.words}</div>
                        `);
                })
                .on('mouseleave', () => {
                    d3.select('#tooltip').style('display', 'none');
                })
                .transition().duration(1600)
                .attr('cx', d => xScale(vis.xValue(d)))
                .attr('cy', d => yScale(vis.yValue(d)))
                .attr('r', d => vis.radScale(vis.radValue(d)))

        // Update axes
        vis.xAxisGroup.transition().duration(1600).call(vis.xAxis);
        vis.yAxisGroup.transition().duration(1600).call(vis.yAxis);
    }

    countAllQuoteWords(d){
        let vis = this
        
        // Get rid of punctuation and transform [] into () bc regExs have weird rules with []
        let quoteWords = d.quote.replaceAll("!", "").replaceAll("[", "(").replaceAll("]", ")").replaceAll("?", "").replaceAll(".", "").replaceAll(",", "");
        
        // Catches anything within () 
        let regEx = / *\([^)]*\) */g;

        // Gets rid of all the unspoken text
        quoteWords = quoteWords.replaceAll(regEx, "");

        // Splits the string by word
        quoteWords = quoteWords.split(" ");

        // Return the number of words
        return quoteWords.length 
    }
}