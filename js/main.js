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
        let frequentCharacters = {}

        for(character of data.characters){
            if(characterFreq[(getId(character))])
                characterFreq[getId(character)]++
            else
                characterFreq[getId(character)] = 1
        }

        console.log("foo")

        for (let character in characterFreq){
            if(characterFreq[getId(character)] > 2)
                frequentCharacters[getId(character)] = characterFreq[getId(character)]
        }

        frequentCharacters = Object.entries(frequentCharacters)
        
        console.log(frequentCharacters)
        data.links = []
        data.nodes = []

        data.scenes.forEach(d => {
            for (let target of d[1].filter(c => frequentCharacters.some(f => getId(f[0]) == getId(c)))){
                let targetId = getId(target)

                if(!data.nodes.some(n => getId(n.label) == targetId)) {
                    data.nodes.push({id: targetId, label: target})
                }
                for(let source of d[1].filter(c => frequentCharacters.some(f => getId(f[0]) == getId(c)))) {
                    let sourceId = getId(source)

                    if(source != target) {
                        if(data.links.some(l => l.target == targetId && l.source == sourceId))
                        {
                            data.links.filter(l => (l.target == targetId && l.source == sourceId))[0].strength += 1
                        }
                        else if(data.links.some(l => (l.target == sourceId && l.source == targetId)))
                        {
                            continue
                        }
                        else 
                        {
                            data.links.push({ target: targetId, source: sourceId, strength: 1 })
                        }
                    }
                }
            }
        })

        console.log(data.links)

        data.links.forEach(d => {
            if(d.strength == 1){
                console.log(data.links.splice(data.links.indexOf(d), 1))
                data.links.splice(data.links.indexOf(d), 1)
            }
            
            d.strength = (1.0 / d.strength)
        })
        
    console.log(data.links)

        let forceDirectedGraph = new ForceDirectedGraph({
			parentElement: '#force-directed-graph',
			'containerHeight': 1000,
			'containerWidth': 1000
		}, data)
		forceDirectedGraph.updateVis()
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