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
        this.rainacornColor = '#FFB1FD';
        this.treeTrunkColor = '#B52C33';

       // Lumpy Space Princess
        this.allData = _data;
        this.data = _data;

        this.finnButton = document.getElementById('Finn');
        this.jakeButton = document.getElementById('Jake');
        this.bubblegumButton = document.getElementById('bubblegum');
        this.marcilineButton = document.getElementById('Marciline');
        this.BMOButton = document.getElementById('BMO');
        this.LSPButton = document.getElementById('LSP');
        this.iceButton = document.getElementById('IceKing');
        this.flamePrincessButton = document.getElementById('flamePrincess');
        this.rainicornButton = document.getElementById('Rainicorn');
        this.treeTrunkButton = document.getElementById('TreeTrunk');

        this.finnPic = document.getElementById('finnPic');
        this.jakePic = document.getElementById('jakePic');
        this.bubblegumPic = document.getElementById('bubblegumPic');
        this.marclinePic = document.getElementById('marclinePic');
        this.BMOPic = document.getElementById('BMOPic');
        this.LSPPic= document.getElementById('LSPPic');
        this.icePic = document.getElementById('icePic');
        this.flamePic = document.getElementById('flamePic');
        this.rainicornPic = document.getElementById('rainicornPic');
        this.treeTrunkPic = document.getElementById('treePic');

        let pictures = [this.finnPic, this.jakePic, this.bubblegumPic, this.marclinePic, this.BMOPic, this.LSPPic, this.icePic, this.flamePic, this.rainicornPic, this.treePic];

        let chars = ["Finn", "Jake","Princess Bubblegum", "Marceline", "BMO", "LSP","Ice King", "Flame Princess", "Rainicorn", "Tree Trunks"];
        let picArr = new Map;
        let j = 0;
        pictures.forEach(b =>{
            picArr.set(b,chars[j]);
            j++; 
        });

        this.pictureArray = Array.from(picArr, function(d){return {picture: d[0], character: d[1]};});
        // console.log(this.pictureArray);


        let buttons = [this.finnButton, this.jakeButton, this.bubblegumButton, this.marcilineButton, this.BMOButton, this.LSPButton, this.iceButton, this.flamePrincessButton, this.rainicornButton, this.treeTrunkButton];

       // let chars = ["Finn", "Jake","Princess Bubblegum", "Marcline", "BMO", "LSP","Ice King", "Flame Princess", "Rainicorn", "Tree Trunks"];
        let buttonArr = new Map;
        let i = 0;
        buttons.forEach(b =>{
            buttonArr.set(b,chars[i]);
            i++; 
        });

        this.buttonArray = Array.from(buttonArr, function(d){return {button: d[0], character: d[1], status: true};});
        // console.log(this.buttonArray);



        this.characters = ["Finn", "BMO", "Princess Bubblegum","Flame Princess", "Jake", "LSP", "Ice King", "Marceline", "Lady Rainicorn", "Tree Trunks"];
        this.character = "Finn";

        this.seasons = [];
        this.season = "all";

        this.words = this.getAllWords();
        this.allWords = this.words;

       // this.color = this.getCharacterColor();
  

        this.innitVis();

    }
    innitVis(){
        let vis = this;

        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        vis.width = 450 - this.margin.left - vis.margin.right;
        vis.height = 450 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select('#wordCloud').append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.left + vis.margin.right)
        .append("g").attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        //console.log(vis.words)
        // vis.fontScale = d3.scaleLinear()
        // .domain([d3.max(vis.words, d=> d.size), d3.min(vis.words, d => d.size)])
        // .range([ 70, 10]);

        vis.colorScale = d3.scaleOrdinal()
        .domain(["Finn", "Jake", "Princess Bubblegum", "Ice King", "BMO", "Lady Rainicorn", "Tree Trunks", "LSP", "Marceline", "Flame Princess"])
        .range([vis.finnColor, vis.jakeColor, vis.bubblegumColor, vis.iceColor, vis.BMOColor, vis.rainacornColor, vis.treeTrunkColor, vis.lumpyColor, vis.vampireColor, vis.flameColor]);

        vis.buttonArray.forEach(b =>{
            b.button.addEventListener('click', function() {
                if(b.status){
                    vis.removeCharacters(b.character);
                    // vis.pictureArray.forEach(p =>{
                    //     if(b.character == p.character){
                    //         p.style.opacity = .5;
                    //     }
                    // })
                    
                    b.status = false;

                }
                else{
                    vis.addCharacters(b.character);
                    // vis.pictureArray.forEach(p =>{
                    //     if(b.character == p.character){
                    //         p.style.opacity = 1;
                    //     }
                    // })
                    b.status = true;
                }

        //         vis.cloud = vis.svg
        // .append("g")
        // .attr("transform", "translate(" + vis.layout.size()[0] / 2 + "," + vis.layout.size()[1] / 2 + ")")
        // .selectAll("text");
                
                vis.updateVis();
            });
                
        })
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
            // console.log(words);
            vis.svg.join("g")
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
                  .text(function(d) { return d.text; });
          }

          //this.characterCount();
    }
    addCharacters(character){
        this.characters.push(character);
        // console.log("added", this.characters)
    }
    removeCharacters(character){
        this.characters = this.characters.filter(function(d) {return !(character == d) });
        // console.log("removed", this.characters)
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
        // console.log(wordArr);
        return wordArr;
        
        //vis.words = wordArr;
    }
    getSeasonData(s){
        let vis = this;

        let temp = new Array;

        if(s == "all"){
            vis.data =vis.allData;
        }
        else {
            s.forEach(p =>{
                temp = vis.allData.filter(function(d) {return d.season == p }) + temp;

            })
        }

        vis.data = temp;

        vis.updateVis();

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

    characterCount(){
        let vis = this;
        let characterCount = d3.rollup(vis.data, v => v.length, d => d.character);
        let characterArray = Array.from(characterCount, function(d){return {key: d[0], value: d[1]};});
        let characterSorted = characterArray.slice().sort((a,b) => d3.descending(a.value, b.value));

        //console.log(characterSorted);

    }
}