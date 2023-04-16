class WordCloud{
    constructor(_data){
        this.allData = _data;
        this.data = _data;
        this.character = "Finn";

        this.words = this.getAllChartacterWords();
        this.allWords = this.words;

        this.color = "#89CFF0";
  

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

        vis.updateVis();
    }
    updateVis(){
        let vis = this;

        vis.layout = d3.layout.cloud().size([vis.width, vis.height])
        .words(vis.words.map(function(d) {return {text: d.word, size:d.size};}))
        .padding(5).rotate(function() {return ~~(Math.random() * 2) * 90;})
        .fontSize(function(d) { return d.size;})
        .on("end", vis.draw());

        vis.layout.start();


    }

    draw(){
        let vis = this;

        vis.svg.append("g")
        .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")")
        .selectAll("text")
        .data(vis.words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size;})
        .style("fill", vis.color)
        .attr("text-anchor", "middle")
        .style("font-family", "Imapct")
        .text(function(d) { return d.text; });
    }

    getAllChartacterWords(){
        let vis = this;
        let characterWords = [];

        //removes anything within () 
        let regEx = / *\([^)]*\) */g;
        
        //list of stop words
        let stopwords = ["", "a","about", "it", "after", "again", "against", "all", "am", "an", "and", "any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up", "us", "get", "got", "very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves"];


        vis.data.forEach(d => {

            if(d.character == vis.character){
                //get rid of punctuation and transform [] into () bc regExs have weird rules with []
                let quote = d.quote.replaceAll("!", "").replaceAll("[", "(").replaceAll("]", ")").replace("?", "").replace(".", "").replaceAll(",", "");
                
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
        let characterWordArray = Array.from(characterWords, function(d){return {word: d[0], size: d[1]};});

        //remove stop words
        stopwords.forEach(s =>{
            characterWordArray = characterWordArray.filter(function(w) {return w.word.toLowerCase() !== s});
        });

        //sort by frequency
        let characterWordsSorted = characterWordArray.slice().sort((a,b) => d3.descending(a.size, b.size));

       // console.log(characterWordsSorted);
        return characterWordsSorted;

    }
}