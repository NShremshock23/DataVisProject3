let data

d3.tsv('data/adventure_time_all_eps_with_scene_num.tsv')
    .then(_data => {
        data = _data

        data.forEach(d => {
            d.seasonEpisodeScene = d.season + "-" + d.ep_num + "-" + d.scene_num
        });
        data.scenes = [...new Map(data.map(item => [item.seasonEpisodeScene,
            item.chars_in_scene.split(', ')
                .filter(c => !c.includes('&') 
                    && !c.toLowerCase().includes(' and '))
                .map(d => d.replace(/\[.*?\]/, '').replace("\""))]))]

        //need list of characters in more than one scene
        data.characters = data.scenes.map(i => i[1]).flat()
        let characterFreq = []

        for(character of data.characters){
            if(characterFreq[0] == getId(character))
                characterFreq.indexOf(getId(character))++
            else
                characterFreq[getId(character)] = 1
        }
        
        data.links = []
        data.nodes = []


        data.scenes.forEach(d => {
            for (target of d[1]) {
                if(data.nodes.filter(n => getId(n.label) == getId(target)).length < 1) {
                    data.nodes.push({id: getId(target), label: target})
                }
                for(source of d[1]) {
                    if(source != target) {
                        if(data.links.some(l => l.target == getId(target) && l.source == getId(source)))
                        {
                            data.links.filter(l => (l.target == target && l.source == source))[0].strength++
                        }
                        else if(data.links.some(l => (l.target == getId(source) && l.source == getId(target))).length == 1)
                        {
                            console.log("foo")
                            continue
                        }
                        else 
                        {
                            data.links.push({ target: getId(target), source: getId(source), strength: 1})
                        }
                    }
                }
            }
        })
        
    console.log(data.links.filter(l => l.strength > 1))

        // let forceDirectedGraph = new ForceDirectedGraph({
		// 	parentElement: '#force-directed-graph',
		// 	'containerHeight': 1000,
		// 	'containerWidth': 1000
		// }, data)
		// forceDirectedGraph.updateVis()
    })

    let getId = (d) => d.toLowerCase().replace(/\s+/g, '')

    function processCharacters(character) {
        switch(character){
            case "simon":
            case "simon":

            default:
                return character
        }
    }