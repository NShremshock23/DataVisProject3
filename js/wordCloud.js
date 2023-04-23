class WordCloud{
    constructor(_data){
        this.finnColor = '#1897CA';
        this.bubblegumColor = '#FF61D0';
        this.jakeColor = '#FF971A';
        this.iceColor = '#344980';
        this.BMOColor = '#59877C';
        this.vampireColor = '#851F1D';
        this.flameColor = '#FF4006';
        this.lumpyColor = '#CC93FA';
        this.treeTrunkColor = '#e3e00a';

       // Lumpy Space Princess
        this.allData = _data;
        this.data = _data;

        this.oneButton = document.getElementById('szn1');
        this.twoButton = document.getElementById('szn2');
        this.threeButton = document.getElementById('szn3');
        this.fourButton = document.getElementById('szn4');
        this.fiveButton = document.getElementById('szn5');
        this.sixButton = document.getElementById('szn6');
        this.sevenButton = document.getElementById('szn7');
        this.eightButton = document.getElementById('szn8');
        this.nineButton = document.getElementById('szn9');
        this.tenButton = document.getElementById('szn10');

        this.finnButton = document.getElementById('Finn');
        this.jakeButton = document.getElementById('Jake');
        this.bubblegumButton = document.getElementById('bubblegum');
        this.marcilineButton = document.getElementById('Marciline');
        this.BMOButton = document.getElementById('BMO');
        this.LSPButton = document.getElementById('LSP');
        this.iceButton = document.getElementById('IceKing');
        this.flamePrincessButton = document.getElementById('flamePrincess');
        this.treeTrunkButton = document.getElementById('TreeTrunk');

        this.finnPic = document.getElementById('finnPic');
        this.jakePic = document.getElementById('jakePic');
        this.bubblegumPic = document.getElementById('bubblegumPic');
        this.marclinePic = document.getElementById('marclinePic');
        this.BMOPic = document.getElementById('BMOPic');
        this.LSPPic= document.getElementById('LSPPic');
        this.icePic = document.getElementById('icePic');
        this.flamePic = document.getElementById('flamePic');
        this.treeTrunkPic = document.getElementById('treePic');

        let pictures = [this.finnPic, this.jakePic, this.bubblegumPic, this.marclinePic, this.BMOPic, this.LSPPic, this.icePic, this.flamePic, this.treePic];

        let chars = ["Finn", "Jake","Princess Bubblegum", "Marceline", "BMO", "LSP","Ice King", "Flame Princess", "Tree Trunks"];
        let picArr = new Map;
        let j = 0;
        pictures.forEach(b =>{
            picArr.set(b,chars[j]);
            j++; 
        });

        this.pictureArray = Array.from(picArr, function(d){return {picture: d[0], character: d[1]};});
        console.log(this.pictureArray);


        let buttons = [this.finnButton, this.jakeButton, this.bubblegumButton, this.marcilineButton, this.BMOButton, this.LSPButton, this.iceButton, this.flamePrincessButton,  this.treeTrunkButton];

        let buttonArr = new Map;
        let i = 0;
        buttons.forEach(b =>{
            buttonArr.set(b,chars[i]);
            i++; 
        });

        this.buttonArray = Array.from(buttonArr, function(d){return {button: d[0], character: d[1], status: true};});
        console.log(this.buttonArray);



        this.characters = ["Finn", "BMO", "Princess Bubblegum","Flame Princess", "Jake", "LSP", "Ice King", "Marceline", "Tree Trunks"];
        this.character = "Finn";

        let seasonButton = [this.oneButton,this.twoButton, this.threeButton, this.fourButton, this.fiveButton, this.sixButton, this.sevenButton, this.eightButton, this.nineButton, this.tenButton];
        let sn = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        let seasonArr = new Map;
        let k = 0;
        seasonButton.forEach(b =>{
            seasonArr.set(b,sn[k]);
            k++; 
        });

        this.seasonArray = Array.from(seasonArr, function(d){return {button: d[0], season: d[1], status: true};});
        console.log(this.seasonArray);
        
        
       // this.seasons = this.addSeasons(this.seasonArray);

        this.words = this.getAllWords();
        this.allWords = this.words;

       // this.color = this.getCharacterColor();
  

        this.innitVis();

    }
    innitVis(){
        let vis = this;

        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        vis.width = 350 - this.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select('#wordCloud').append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.left + vis.margin.right)
        .append("g").attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.colorScale = d3.scaleOrdinal()
        .domain(["Finn", "Jake", "Princess Bubblegum", "Ice King", "BMO", "Lady Rainicorn", "Tree Trunks", "LSP", "Marceline", "Flame Princess"])
        .range([vis.finnColor, vis.jakeColor, vis.bubblegumColor, vis.iceColor, vis.BMOColor, vis.rainacornColor, vis.treeTrunkColor, vis.lumpyColor, vis.vampireColor, vis.flameColor]);

        vis.buttonArray.forEach(b =>{
            b.button.addEventListener('click', function() {
                if(b.status){
                    vis.removeCharacters(b.character);
                    
                    b.status = false;
                    b.button.style.backgroundColor = '#F9F6F0';

                }
                else{
                    vis.addCharacters(b.character);

                    b.status = true;
                    b.button.style.backgroundColor = vis.colorScale(b.character);
                    
                }
                
                vis.updateVis();
            });
                
        });


        vis.seasonArray.forEach(s =>{
            s.button.addEventListener('click', function() {
                if(s.status){
                    s.status = false;
                    vis.removeSeasons(vis.seasonArray);
                    s.button.style.backgroundColor = '#F9F6F0';

                }
                else{
                    s.status = true;
                    vis.addSeasons(vis.seasonArray);
                    s.button.style.backgroundColor = 'rgba(204, 246, 204, 0.877)';

                    // if(s.season == "all"){
                    //     s.status = false;
                    //     s.button.style.backgroundColor = '#F9F6F0';
                    // }
                }
                
                vis.updateVis();
            });
                
        });


        vis.updateVis();
    }

    updateVis(){
        let vis = this;

        vis.words = vis.getAllWords();

        vis.fontScale = d3.scaleLinear()
        .domain([d3.max(vis.words, d=> d.size), d3.min(vis.words, d => d.size)])
        .range([ 70, 10]);

        vis.layout = d3.layout.cloud().size([vis.width, vis.height])
        .words(vis.words.map(function(d) {return {text: d.word, size:d.size, character: d.character};}))
        .padding(5).rotate(function() {return ~~(Math.random() * 2) * 90;})
        .fontSize(function(d) { return vis.fontScale(d.size);})
        .on("end", draw);

         

        vis.layout.start();

        function draw(words) {
            console.log(words);
            vis.word = vis.svg.join("g")
            .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
                  .join("text")
                  .style("font-size", function(d) { return d.size + "px"; })
                  .style("fill", function (d) {return vis.colorScale(d.character);})
                  .attr("text-anchor", "middle")
                  .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                  .text(function(d) { return d.text; })
                  .on("mouseover",(event, d) =>{
                            d3.select('body').select('#word_tooltip')
                            .style('display', 'block')
                            .style('left', (event.pageX + vis.margin.tooltipPadding) + 'px')   
                            .style('top', (event.pageY + vis.margin.tooltipPadding) + 'px')
                            .html(`
                                <div> Character : ${d.character}</div>
                                <div> Number of Times: ${d.size}</div>
                      `).attr("class", "tooltip")
                      .style("background-color", "white")
                      .style("border", "solid")
                      .style("border-width", "2px")
                      .style("border-radius", "5px")
                      .style("padding", "5px")
                      .style("position", "absolute");
                          });
          }

    //       vis.word.on('mouseover', (event, d) =>{
    //         d3.select('body').select('#tooltip')
    //         .style('display', 'block')
    //         .style('left', (event.pageX + vis.margin.tooltipPadding) + 'px')   
    //         .style('top', (event.pageY + vis.margin.tooltipPadding) + 'px')
    //         .html(`
    //             <div><h>${vis.title}<h><div>
    //             <div>${vis.right} : ${d.key}</div>
    //             <div> Number of Exoplanets: ${d.value}</div>
    //   `).attr("class", "tooltip")
    //   .style("background-color", "white")
    //   .style("border", "solid")
    //   .style("border-width", "2px")
    //   .style("border-radius", "5px")
    //   .style("padding", "5px")
    //   .style("position", "absolute");
    //       })

    }
    addCharacters(character){
        this.characters.push(character);
        console.log("added", this.characters)
    }
    removeCharacters(character){
        this.characters = this.characters.filter(function(d) {return !(character == d) });
        console.log("removd", this.characters)
    }

    getAllWords(){
        let vis = this;
        let wordArr = [];
        vis.characters.forEach(d => {
            //console.log(this.getAllChartacterWords(d));
            let chars = this.getAllChartacterWords(d);
            chars.forEach(s =>{
                wordArr.push(s);
            });

        })
        wordArr = wordArr.slice().sort((a,b) => d3.descending(a.size, b.size));
        console.log(wordArr);
        return wordArr;
        
        //vis.words = wordArr;
    }
    addSeasons(seasons){
        let vis = this;

        let temp = new Array;
        let szn = new Array;

            seasons.forEach(s =>{
                if(s.status == true && s.season == "all"){
                    szn =vis.allData;
                    this.data = szn;
                    return szn;

                }
                else if(s.status == true){
                    temp = vis.allData.filter(function(d) {return d.season == s.season });
                    temp.forEach(i =>{
                        szn.push(i);
                    });

                }
                
            });

        this.data = szn;
        console.log("all data", this.data);
        return szn;

    }

    removeSeasons(seasons){
        let vis = this;

        let temp = new Array;
        let szn = new Array;

            seasons.forEach(s =>{
                if(s.status == false){
                    temp = vis.data.filter(function(d) {return !(d.season == s.season) });
                    temp.forEach(i =>{
                        szn.push(i);
                    });

                } 
            });


        console.log(szn);
        this.data = szn;
        return szn;

    }

    getAllChartacterWords(chara){
        let vis = this;
        let characterWords = [];

        //removes anything within () 
        let regEx = / *\([^)]*\) */g;
        
        //list of stop words
        let stopwords = ["", "a","about", "it", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up", "us", "get", "got", "very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];


        vis.data.forEach(d => {

            if(d.character == chara){
                //get rid of punctuation and transform [] into () bc regExs have weird rules with []
                let quote = d.quote.replaceAll("!", "").replaceAll("[", "(").replaceAll("]", ")").replaceAll("?", "").replaceAll(".", "").replaceAll(",", "");
                
                //gets rid of all the unspoken text
                quote = quote.replaceAll(regEx, "");

                //splits the string by word
                quote = quote.split(" ");

                //pushes all of the words into the character word array
                quote.forEach(d =>{
                    characterWords.push(d);
                })
            }  
        });


      //Count frequency of words
        characterWords = d3.rollup(characterWords, v => v.length, d => d.toUpperCase());
        let characterWordArray = Array.from(characterWords, function(d){return {word: d[0], size: d[1], character: chara};});

        //remove stop words
        stopwords.forEach(s =>{
            characterWordArray = characterWordArray.filter(function(w) {return w.word.toLowerCase() !== s});
        });

        //sort by frequency
        let characterWordsSorted = characterWordArray.slice().sort((a,b) => d3.descending(a.size, b.size));

        let finalArray =new Array;
        let i = 0;
        while(i < 50 / vis.characters.length){
            finalArray.push(characterWordsSorted[i]);
            i++;

        }
        //console.log(finalArray);
        return finalArray;

    }

}