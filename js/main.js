let data
let nonCharacters = ["monster", "woman", "man","audience", "crowd", "alltheanimals", "voice", "unknownvoice", "malevoice", "episodeends.", "episodeends", "all", "everyoneelse", "everyone", "both", ""]
let mainCharacters = ["princessbubblegum", "marceline", "bmo", "iceking", "flameprincess", "lumpyspaceprincess"]

d3.tsv('data/adventure_time_all_eps_with_scene_num.tsv')
    .then(_data => {
        data = _data

        data.characterData = [] // Array of objects containing character-specific stats (lines/words spoken, # episodes, etc.)
        data.episodeData = []   // Array of objects for episode-specific stats

        // Episode, Character Data Processing
        data.forEach(d => {
            d.seasonEpisodeScene = d.season + "-" + d.ep_num + "-" + d.scene_num
            d.season = +d.season;
            d.ep_num  = +d.ep_num;
            d.scene_num = +d.scene_num;

            let ep = data.episodeData.find((o, i) => { 
                if (o.id == (d.season + "-" + d.ep_num)) {
                    // Count line, words
                    o.linesTotal += 1
                    o.wordsTotal += countAllQuoteWords(d)
                    
                    // Count scenes within same ep
                    if (o.scenes < d.scene_num) {
                        o.scenes = d.scene_num
                    }

                    return true
                }
            })

            // Add a record for the current episode if it doesn't already have one
            if (!ep) {
                ep = {
                    'id': (d.season + "-" + d.ep_num),
                    'linesTotal': 1,
                    'wordsTotal': countAllQuoteWords(d),
                    'scenes': d.scene_num
                }
                data.episodeData.push(ep)
            }

            if (d.character != '' &&
                !(nonCharacters.includes(getId(d.character)) || // filters out "all" and similar characters
                d.character.includes('&') ||
                d.character.toLowerCase().includes(' and ') || // filters out characters that are actually multiple speaking at once
                d.character.toLowerCase().includes('and ') || // filters out characters that are actually multiple speaking at once
                d.character.toLowerCase().includes('/'))) {

                // Find character if they already exist in characterData[]
                let character = data.characterData.find((o, i) => { 
                    if (o.id == getId(processCharacters(d.character))) {
                        // Count line, words
                        o.lines += 1
                        o.words += countAllQuoteWords(d)
                        
                        // Count the ep if it hasn't already been counted for current character (ASSUMES CHRONOLOGICAL DATA ORDER)
                        if (o.lastSeason < d.season || (o.lastSeason == d.season && o.lastEp < d.ep_num)) {
                            o.episodes++
                            o.scenes++
                            o.lastSeason = d.season
                            o.lastEp = d.ep_num
                            o.lastScene = d.scene_num
                        }
                        // Count scenes within same ep
                        else if (o.lastScene < d.scene_num) {
                            o.scenes++
                            o.lastScene = d.scene_num
                        }

                        return true
                    }
                })

                // Add a record for the current character if they don't already have one
                if (!character) {
                    character = {
                        'id': getId(processCharacters(d.character)),
                        'name': processCharacters(d.character),
                        'episodes': 1,
                        'scenes': 1,
                        'lines': 1,
                        'words': countAllQuoteWords(d),
                        'lastSeason': d.season,
                        'lastEp': d.ep_num,
                        'lastScene': d.scene_num
                    }
                    data.characterData.push(character);
                }

                // Add character data to appropriate episodeData object
                if (ep['lines_' + character.id]) {
                    ep['lines_' + character.id] += 1
                    ep['words_' + character.id] += countAllQuoteWords(d)
                }
                else {
                    ep['lines_' + character.id] = 1
                    ep['words_' + character.id] = countAllQuoteWords(d)
                }
            }
        });

        let hideNotSelectedInput = document.getElementById('hide-not-selected')
        data.hideNotSelected = hideNotSelectedInput.checked

        // Get list of scenes in format {season-episode-scene, characters in scene}
        data.scenes = [...new Map(data.map(item => [item.seasonEpisodeScene,
            item.chars_in_scene.split(', ')
                .filter(c => !(nonCharacters.includes(getId(c)) // filters out "all" and similar characters
                    || c.includes('&') 
                    || c.toLowerCase().includes(' and ') // filters out characters that are actually multiple speaking at once
                    || c.toLowerCase().includes('and ') // filters out characters that are actually multiple speaking at once
                    || c.toLowerCase().includes('/')))
                // removes brackets and parentheses along with their contents, and removes quotes from names
                // TODO: Removing quotes not working correctly
                .map(d => processCharacters(d.replace(/\[.*?\]/, '').replace(/\(.*?\)/, '').replace('"', '')))]))]

        data.characters = data.scenes.map(i => i[1]).flat() // List of all characters (not unique)
        data.characterFreq = [] //list of all characters and their counts
        data.frequentCharacters = {} // list of frequent characters (in more than one scene)

        // loop through all characters and calculates their scene count
        for(character of data.characters){
            if(data.characterFreq[(getId(character))])
                data.characterFreq[getId(character)]++
            else
            data.characterFreq[getId(character)] = 1
        }
        
        // Remove characters in just one scene
        for (let character in data.characterFreq){
            if(data.characterFreq[getId(character)] > 1)
                data.frequentCharacters[getId(character)] = data.characterFreq[getId(character)]
        }

        let wordCloud = new WordCloud(data);

        let forceDirectedGraph = new ForceDirectedGraph({
			parentElement: '#force-directed-graph',
			'containerHeight': 3000,
			'containerWidth': 3200
		}, data)
		forceDirectedGraph.updateVis()

        let scatterplot = new Scatterplot({
			parentElement: '#scatterplot',
			'containerHeight': 600,
			'containerWidth': 800
		}, data)
		scatterplot.updateVis()

        let histogram = new Histogram({
			parentElement: '#histogram',
			'containerHeight': 600,
			'containerWidth': 1500
		}, data)
		histogram.updateVis()
        
        const graphContainer = document.querySelector("#graph-container")

        graphContainer.scrollTo({
            left: 700,
            top: 600,
            behavior: "smooth"
        });

        hideNotSelectedInput.addEventListener('change', (event) => {
            data.hideNotSelected = !data.hideNotSelected
        })
    })

let getId = (d) => d.toLowerCase().replace(/\s+/g, '')

    function countAllQuoteWords(d) {
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

//Take in character, get it's id form and return it's actual character
function processCharacters(character) {
    switch(getId(character)){
        case "pen":
        case "futurefinn":
        case "pastfinn":
            return "Finn"

        case "jake'ssubconscious":
        case "babyjake":
            return "Jake"

        case "simon":
        case "simonpetrikov":
            return "Ice King"

        case "princessbubblegum'svoice":
        case "bubblegum":
        case "youngbubblegum":
        case "youngprincessbubblegum":
        case "princess":
        case "bonnie": 
            return "Princess Bubblegum"

        case "marcy":
            return "Marceline"

        case "lady":
            return "Lady Rainicorn"

        case "lsp":
            return "Lumpy Space Princess"

        case "normalman":
            return "Magic Man"

        case "gunther":
        case "icething":
            return "Gunter"
        
        case "lich":
            return "The Lich"

        case "starchie":
            return "Starchy"

        case "t.v.":
            return "TV"

        case "vampireking":
        case "hunson":
            return "Hunson Abadeer"
        
        case "earloflemongrab":
        case "lemongrabclone":
        case "lemongrab":
        case "lemongrab2":
        case "lemongrab3":
            return "Lemongrabs"

        case "holo-margaret":
            return "Margaret"
        
        case "fernface":
            return "Fern"
            
        case "gob":
        case "glob":
        case "grob":
        case "grod":
            return "Grob Gob Glob Grod"
        
        case "mrpig":
            return "Mr. Pig"

        case "unclegumbald":
            return "Gumbald"

        case "fionna\"":
            return "Fionna"

        case "dirtbeerguy":
            return "Root Beer Guy"

        case "hotdogknight#1":
        case "hotdogknight#2":
        case "hotdogknight#3":
        case "hotdogknight#4":
            return "Hot Dog Knights"

        case "goblinguard1":
        case "goblinguard2":
        case "goblin":
            return "Goblins"
        
        case "gnomeruler":
            return "Gnomes"

        case "long-hairednymph":
        case "short-hairednymph":
        case "nymph":
            return "Nymphs"

        case "gumballguardian":
            return "Gumball Guardians"

        case "bananaguard#1":
        case "bananaguard#2":
        case "anotherbananaguard":
        case "bananaguard":
        case "bananaguard1":
        case "bananaguard2":
        case "unidentifiablebananaguard":
            return "Banana Guards"

        case "headmarauder":
        case "marauder":
            return "Marauders"

        case "candyperson":
        case "candyperson1":
        case "candyperson2":
        case "candyperson#29":
        case "candyperson#1":
            return "Candy People"

        case "red-tiebusinessman":
            return "Businessmen"

        case "oneballoon":
            return "Balloons"

        case "penguin":
            return "Penguins"

        case "flameguard":
            return "Flame Guards"

        case "greenlollipopgirl":
            return "Lollipop Girl"

        case "moldo":
            return "Moldos"
        
        case "headclownnurse":
        case "bigclownnurse":
            return "Clown Nurses"

        case "fatvillager":
        case "fatvillagers":
        case "villager":
            return "Villagers"

        case "candychild2":
        case "candychild3":
        case "candychild":
            return "Candy Children"

        case "dmo":
        case "smo1":
        case "smo3":
        case "smo4":
        case "mo":
        case "allmo":
            return "MOs"

        default:
            return character
    }
}