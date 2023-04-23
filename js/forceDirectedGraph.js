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

        vis.radiusScale = d3.scaleSqrt()
            .domain(d3.extent(Object.values(vis.data.characterFreq), f => f))
            .range([1, 40])

        vis.chart = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth )
            .attr('height', vis.config.containerHeight)
            .append('g')
                .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    }

    updateVis() {
        let vis = this;

        vis.selectedNode = null;

        // Turning frequent characters into a list, sorting, and getting top 50
        vis.data.frequentCharacters = Object.entries(vis.data.frequentCharacters).sort((a,b) => b[1] - a[1])
        console.log(vis.data.showFullData)
        if(!vis.data.showFullData)
            vis.data.frequentCharacters = vis.data.frequentCharacters.splice(0,100)

        vis.data.links = []
        vis.data.nodes = []

        // Create links and nodes
        vis.data.scenes.forEach(d => {
            // Loop through the frequent characters from the current scene to be a link target
            for (let target of d[1].filter(c => vis.data.frequentCharacters.some(f => getId(f[0]) == getId(c)))){

                let targetId = getId(target) // Get id form of target

                // If that character doesn't have a node yet, make one
                if(!vis.data.nodes.some(n => getId(n.label) == targetId)) {
                    vis.data.nodes.push({id: targetId, label: target, sceneCount: vis.data.characterFreq[targetId]})
                }
                // Loop through the frequent characters from the current scene again (not including the target character) to be a link source
                for(let source of d[1].filter(c => getId(c) != targetId && vis.data.frequentCharacters.some(f => getId(f[0]) == getId(c)))) {

                    let sourceId = getId(source) // get id form of source

                    // if((!((sourceId == "finn" || sourceId == "jake") || (targetId == "finn" || targetId == "jake"))
                    //     || mainCharacters.includes(targetId) && (sourceId == "finn" || sourceId == "jake"))
                    //     || (mainCharacters.includes(sourceId) && (targetId == "finn" || targetId == "jake"))){
                        // If the two characters have an existing link, increment the strength
                        if(vis.data.links.some(l => l.target == targetId && l.source == sourceId))
                            vis.data.links.filter(l => (l.target == targetId && l.source == sourceId))[0].strength += 1
    
                        // If the characters have a link in the opposite direction, skip (avoids double dipping links)
                        else if(vis.data.links.some(l => (l.target == sourceId && l.source == targetId)))
                            continue
    
                        // Otherwise create a new link
                        else 
                            vis.data.links.push({ target: targetId, source: sourceId, strength: 1})

                    // }
                }
            }
        })

        // Go through links and calculate actual strength (occurrences together / total scenes of source + target)
        data.links.forEach(d => {
            d.strength = d.strength / (vis.data.characterFreq[d.target] + vis.data.characterFreq[d.source])
        })


        vis.renderVis()
    }

    renderVis(){
        let vis = this

        // Create simulation
        // Force Many Body: Makes elements attract(+) or repel(-) each other
        // Force center: Sets center of gravity
        // Force link: Sets link force based on strength
        // On Tick: updates element position each tick (gives the fun animation)
        vis.simulation = d3.forceSimulation(vis.data.nodes)
            .force('charge', d3.forceManyBody().strength(-1000))
            .force('center', d3.forceCenter(vis.width / 2, vis.height / 2))
            .force('link', d3.forceLink().id(l => l.id).strength(l => l.strength * 2).distance(30))
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

    vis.chart.selectAll('line')
    vis.chart.selectAll('circle')
    vis.chart.selectAll('text')
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
          .attr('r', d => vis.radiusScale(d.sceneCount))
          .attr('opacity', 0.5)
          .attr('class', 'node')

    // Creates SVG for text labels
    vis.textElements = vis.chart.append('g')
        .selectAll('text')
        .data(vis.data.nodes)
        .join('text')
        .text(n => n.label)
            .attr('class', "label")
            .attr('font-size', 15)
            .attr('text-anchor', "middle")
            .attr('dx', 0)
            .attr('dy', d => -4 - vis.radiusScale(d.sceneCount))

    vis.nodeElements.on('click', selected => vis.selectNode(selected))
    vis.textElements.on('click', selected => vis.selectNode(selected))

    vis.selectNode = (selected) => {
        if(vis.selectedNode == null || vis.selectedNode.target.__data__ != selected.target.__data__) {
            const neighbors = vis.getNeighbors(selected.target.__data__, vis.data.links)

            vis.nodeElements
                .transition()
                .attr('opacity', node => vis.getNodeOpacity(node, neighbors, vis.data.hideNotSelected)) 
            vis.textElements
                .transition()
                .attr('fill', node => vis.getTextColor(node, neighbors, vis.data.hideNotSelected))
            vis.linkElements
                .transition()
                .attr('stroke', link => vis.getLinkColor(selected.target.__data__, link))
            vis.selectedNode = selected;
        }
        else {
            vis.nodeElements
                .transition()
                .attr('opacity', 0.5) 
            vis.textElements
                .transition()
                .attr('fill', '#303030')
            vis.linkElements
                .transition()
                .attr('stroke', '#E5E5E5')
            vis.selectedNode = null;
        }
    }
    }

    getNeighbors(node, links) {
        return links.reduce((neighbors, link) => {
            if(link.target.id === node.id)
                neighbors.push(link.source.id)
            else if (link.source.id === node.id)
                neighbors.push(link.target.id)
            return neighbors
        }, [node.id])
    }

    getNodeOpacity(node, neighbors, hideNotSelected) {
        if (neighbors.indexOf(node.id) != -1)
            return 0.75
        return hideNotSelected ? 0 : 0.25
    }
    
    getLinkColor(node, link) {
        return (link.target.id === node.id || link.source.id === node.id) ? '#565656' : 'transparent'
    }

    getTextColor(node, neighbors, hideNotSelected) {
        if (neighbors.indexOf(node.id) != -1)
            return '#303030'
        return hideNotSelected ? 'transparent' :'#d0d0d0'
    }
}