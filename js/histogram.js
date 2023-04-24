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
        vis.seasonSelected = [true, true, true, true, true, true, true, true, true, true]
        
        // vis.charSelected = {"Finn": true, 
        //                     "BMO": true, 
        //                     "Princess Bubblegum": true,
        //                     "Flame Princess": true, 
        //                     "Jake": true, 
        //                     "LSP": true, 
        //                     "Ice King": true, 
        //                     "Marceline": true, 
        //                     "Lady Rainicorn": true, 
        //                     "Tree Trunks": true}

        vis.charSelected = {}
        for (let char of vis.mainCharacters) {
            vis.charSelected[vis.getId(processCharacters(char))] = true
        }
        vis.charSelected['other'] = true

        vis.lineKeysMain = vis.mainCharacters
        for (let i = 0; i < vis.lineKeysMain.length; i++) {
            vis.lineKeysMain[i] = 'lines_' + getId(processCharacters(vis.lineKeysMain[i]))
        }
        vis.lineKeysMain.push('lines_other')

        vis.data.episodeData.forEach(d => {
            let lineKeys = Object.getOwnPropertyNames(d).filter(d => {return d.includes('lines_')})

            d.lines_other = 0
            d.otherChars = 0

            for (let key of vis.lineKeysMain) {
                if(!d[key]) d[key] = 0
            }

            for (let key of lineKeys) {
                // If the current key isn't for one of the main characters
                if (!vis.lineKeysMain.some(keyMain => key == keyMain)) {
                    d.lines_other += d[key]
                    d.otherChars++
                }
            }
        })

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
        vis.yScaleLinear = d3.scaleLinear()
            .range([vis.height, 0]);
        vis.yScaleLog = d3.scaleLog()
            .range([vis.height, 0]);

        vis.colorScale = d3.scaleOrdinal()
            .domain(["Finn", "Jake", "Princess Bubblegum", "Ice King", "BMO", "Lady Rainicorn", "Tree Trunks", "LSP", "Marceline", "Flame Princess"])
            .range([vis.finnColor, vis.jakeColor, vis.bubblegumColor, vis.iceColor, vis.BMOColor, vis.rainacornColor, vis.treeTrunkColor, vis.lumpyColor, vis.vampireColor, vis.flameColor]);
    
        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickSizeOuter(0)
            // .tickFormat(x => /[0-9]-1/.test(x) ? x : "")
            .tickValues(['1-1', '2-1', '3-1', '4-1', '5-1', '6-1', '7-1', '8-1', '10-1']);
        vis.yAxis = d3.axisLeft(vis.yScaleLinear).tickSizeOuter(0);
    
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

        vis.oneButton = document.getElementById('szn1').addEventListener('click', () => { vis.seasonSelected[0] ? vis.seasonSelected[0] = false : vis.seasonSelected[0] = true; vis.updateVis()});
        vis.twoButton = document.getElementById('szn2').addEventListener('click', () => { vis.seasonSelected[1] ? vis.seasonSelected[1] = false : vis.seasonSelected[1] = true; vis.updateVis()});
        vis.threeButton = document.getElementById('szn3').addEventListener('click', () => { vis.seasonSelected[2] ? vis.seasonSelected[2] = false : vis.seasonSelected[2] = true; vis.updateVis()});
        vis.fourButton = document.getElementById('szn4').addEventListener('click', () => { vis.seasonSelected[3] ? vis.seasonSelected[3] = false : vis.seasonSelected[3] = true; vis.updateVis()});
        vis.fiveButton = document.getElementById('szn5').addEventListener('click', () => { vis.seasonSelected[4] ? vis.seasonSelected[4] = false : vis.seasonSelected[4] = true; vis.updateVis()});
        vis.sixButton = document.getElementById('szn6').addEventListener('click', () => { vis.seasonSelected[5] ? vis.seasonSelected[5] = false : vis.seasonSelected[5] = true; vis.updateVis()});
        vis.sevenButton = document.getElementById('szn7').addEventListener('click', () => { vis.seasonSelected[6] ? vis.seasonSelected[6] = false : vis.seasonSelected[6] = true; vis.updateVis()});
        vis.eightButton = document.getElementById('szn8').addEventListener('click', () => { vis.seasonSelected[7] ? vis.seasonSelected[7] = false : vis.seasonSelected[7] = true; vis.updateVis()});
        vis.nineButton = document.getElementById('szn9').addEventListener('click', () => { vis.seasonSelected[8] ? vis.seasonSelected[8] = false : vis.seasonSelected[8] = true; vis.updateVis()});
        vis.tenButton = document.getElementById('szn10').addEventListener('click', () => { vis.seasonSelected[9] ? vis.seasonSelected[9] = false : vis.seasonSelected[9] = true; vis.updateVis()});
            
        vis.finnButton = document.getElementById('Finn').addEventListener('click', () => { vis.charSelected['finn'] ? vis.charSelected['finn'] = false : vis.charSelected['finn'] = true; vis.updateVis()});
        vis.jakeButton = document.getElementById('Jake').addEventListener('click', () => { vis.charSelected['jake'] ? vis.charSelected['jake'] = false : vis.charSelected['jake'] = true; vis.updateVis()});
        vis.bubblegumButton = document.getElementById('bubblegum').addEventListener('click', () => { vis.charSelected['princessbubblegum'] ? vis.charSelected['princessbubblegum'] = false : vis.charSelected['princessbubblegum'] = true; vis.updateVis()});
        vis.marcilineButton = document.getElementById('Marciline').addEventListener('click', () => { vis.charSelected['marceline'] ? vis.charSelected['marceline'] = false : vis.charSelected['marceline'] = true; vis.updateVis()});
        vis.BMOButton = document.getElementById('BMO').addEventListener('click', () => { vis.charSelected['bmo'] ? vis.charSelected['bmo'] = false : vis.charSelected['bmo'] = true; vis.updateVis()});
        vis.LSPButton = document.getElementById('LSP').addEventListener('click', () => { vis.charSelected['lumpyspaceprincess'] ? vis.charSelected['lumpyspaceprincess'] = false : vis.charSelected['lumpyspaceprincess'] = true; vis.updateVis()});
        vis.iceButton = document.getElementById('IceKing').addEventListener('click', () => { vis.charSelected['iceking'] ? vis.charSelected['iceking'] = false : vis.charSelected['iceking'] = true; vis.updateVis()});
        vis.flamePrincessButton = document.getElementById('flamePrincess').addEventListener('click', () => { vis.charSelected['flameprincess'] ? vis.charSelected['flameprincess'] = false : vis.charSelected['flameprincess'] = true; vis.updateVis()});
        vis.treeTrunkButton = document.getElementById('TreeTrunk').addEventListener('click', () => { vis.charSelected['treetrunks'] ? vis.charSelected['treetrunks'] = false : vis.charSelected['treetrunks'] = true; vis.updateVis()});

        vis.yScaleCheckbox = d3.select('#histogram-y-scale').on('click', () => {vis.updateVis()})
        vis.otherCheckbox = d3.select('#histogram-other-toggle').on('click', () => {vis.charSelected['other'] = vis.otherCheckbox.property('checked'); vis.updateVis()})
    }

    updateVis() {
        let vis = this;

        // TODO: Data processing
        vis.stackedData = []

        console.log(vis.charSelected)

        // Stack order reversed to place Other at the bottom
        // stack keys are filtered for character selection
        vis.stack = d3.stack().keys(vis.lineKeysMain.filter(k => { return vis.charSelected[k.split('_')[1]] })).order(d3.stackOrderReverse)
        vis.epData = vis.data.episodeData.filter(d => {return vis.seasonSelected[d.id.split('-')[0] - 1]})
        console.log(vis.epData)
        // vis.epData.forEach(d => {
        //     for (let key of vis.lineKeysMain) {
        //         if(!vis.charSelected[key.split('_')[1]]) d[key] = 0
        //     }
        // })
        console.log(vis.epData)
        console.log(vis.data.episodeData)

        vis.stackedData = vis.stack(vis.epData)
        console.log(vis.stackedData)

        vis.xValue = d => d.id;
        vis.yValue = d => d.linesTotal;

        vis.xScale.domain(vis.epData.map(m => vis.xValue(m)))
        // vis.yScale.domain([0, d3.max(vis.epData, d => vis.yValue(d))])

        if (vis.yScaleCheckbox.property('checked')) {
            vis.yAxis.scale(vis.yScaleLog)
            vis.yScaleLog.domain([1, d3.max(vis.epData, d => vis.yValue(d))])
        }
        else {
            vis.yAxis.scale(vis.yScaleLinear)
            // vis.yScaleLinear.domain([0, d3.max(vis.epData, d => vis.yValue(d))])
            vis.yScaleLinear.domain([0, d3.max(vis.stackedData, d => d3.max(d, g => g[1])) + 5])
            console.log(d3.max(vis.stackedData, d => d3.max(d, g => g[1])))
        }

        vis.renderVis();
    }

    renderVis() {
        let vis = this;
        let yScale = vis.yAxis.scale()

        // TODO Add rectangles
        vis.rectangles = vis.chart.selectAll('.epBar')
            .data(vis.stackedData)
            .join('g')
                .attr('class', d => `epBar char-${d.key.replace('lines_', '')}`)
                .selectAll('rect')
                    .data(g => g)
                    .join('rect')
                        .on('mouseover', (event,x) => {
                            d3.select('#tooltip')
                                .style('display', 'block')
                                .style('left', (event.pageX + 10) + 'px')   
                                .style('top', (event.pageY + 10) + 'px')
                                .style('text-align', 'left')
                                .html(`
                                    <div class="tooltip-title">${x.data.id}</div>
                                    <div>Character: TODO</div>
                                    <div>Lines of Dialog: ${x[1] - x[0]}</div>
                                    <div>Total Words Spoken: TODO</div>
                                `);
                        })
                        .on('mouseleave', () => {
                            d3.select('#tooltip').style('display', 'none');
                        })    
                        .transition().duration(1600)
                        .attr('x', d => vis.xScale(d.data.id) + 1)
                        .attr('y', d => {
                            if(yScale(d[1]))
                                return yScale(d[1]);
                            else 
                                return yScale(1) })
                        .attr('height', d => {
                            if (d[0] - d[1] == 0) return 0;
                            else if (!yScale(d[0])) return yScale(1) - yScale(d[1])
                            return yScale(d[0]) - yScale(d[1])
                        })
                        .attr('width', vis.xScale.bandwidth() - 2);

        // Update axes
        let xTicks = []
        for (let i = 0; i < vis.seasonSelected.length; i++) {
            if ((i + 1) != 9 && vis.seasonSelected[i]) xTicks.push((i + 1).toString() + '-1')
        }

        vis.xAxis.tickValues(xTicks)
        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }
}