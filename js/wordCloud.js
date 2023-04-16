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
        vis.data.forEach(d => {
           // console.log(d.character, vis.character);

            if(d.character == vis.character){
                let quote = d.quote.split(" ");
                quote.forEach(d =>{
                    characterWords.push(d);
                })
                //characterWords.push(d.quote.split(" "));
               // console.log(d.quote.split(" "))
            }  
        });

        characterWords = d3.rollup(characterWords, v => v.length, d => d);
        characterWords = Array.from(characterWords, function(d){return {word: d[0], size: d[1]};});

        console.log(characterWords);
        return characterWords;

    }
}