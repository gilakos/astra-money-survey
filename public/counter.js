function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 750)
        .attr("height", 500)
        .append("g")
        .attr("transform", "translate(250,250)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
            .data(words, function (d) {
                return d.text;
            });

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function (d, i) {
                return fill(i);
            })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function (d) {
                return d.text;
            });

        //Entering and existing words
        cloud
            .transition()
            .duration(600)
            .style("font-size", function (d) {
                return d.size + "px";
            })
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
            .duration(200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function (words) {
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                .rotate(function () {
                    return ~~(Math.random() * 2) * 90;
                })
                .font("Impact")
                .fontSize(function (d) {
                    return d.size;
                })
                .on("end", draw)
                .start();
        }
    }

}

//http://bl.ocks.org/jwhitfieldseed/9697914
// var words = new Hashtable();
var words1 = [];
var words = [];
var wordFreq = [];
var temp = [];
var socket2 = io();
var word = "";
var badWords = ["NA", "N/A", "no", "nope", "na", "n/a", "and", "or", "app", "apps", "a", "ie", "none", "don't", "so", "america",
    "dont", "&", "my", "for", "each", "my", "I", "of", "to", "well", "like", "do", "now", "com", "", "use", "one", "hood", "just", "that", "bank's",
    "(ie", "ever", "only", "but", "i've", "tried", "you", "but", "of", "have", "'s", "fig", "which", "mostly"];
for (var i = 0; i < badWords.length; i++) {
    badWords[i] = badWords[i].toLowerCase();
}
var exists = false;
socket2.on('graph_data_0', function (data, error) {   //grabs live typeform data
    data.data.forEach(function (d) {  //data.data is used everywhere because 'data' is the object name, with many children nodes,
        if (typeof d.appsUsed != 'undefined' && badWords.indexOf(d.appsUsed.toLowerCase()) < 0) { //dont want words in the badWords array
            temp = d.appsUsed.split(/[ ,.)(]+/);
            for (var i = 0; i < temp.length; i++) {
                if (badWords.indexOf(temp[i].toLowerCase()) < 0) {
                    for (var j = 0; j < words1.length; j++) {
                        if (words1[j].key.toLowerCase() == temp[i].toLowerCase()) {
                            words1[j].value = words1[j].value + 1;
                            exists = true;
                        }
                    }
                    if (!exists) {
                        words1.push({
                            key: temp[i].toLowerCase(),
                            value: 1
                        });
                    }
                    exists = false;
                }
            }
            // .split(/[ ,]+/)
        }

    });
    for (var i = 0; i < words1.length; i++) {
        if (words1[i].value >= 1) {
            if (words1[i].key == "capital") {
                words.push("capital one");
                wordFreq.push(words1[i].value);
            }
            if (words1[i].key == "robin") {
                words.push("robinhood");
                wordFreq.push(words1[i].value);
            }
            if (words1[i].key == "merrill") {
                words.push("merrill lynch");
                wordFreq.push(words1[i].value);
            }
            if (words1[i].key == "sig") {
                words.push("sig fig");
                wordFreq.push(words1[i].value);
            }
            if (words1[i].key == "wells") {
                words.push("wells fargo");
                wordFreq.push(words1[i].value);
            }
            words.push(words1[i].key);
            wordFreq.push(words1[i].value);
        }
    }

    console.log(words);
    console.log(wordFreq);

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
    function getWords(i) {

        var bagowords = [];
        for (var j = 0; j < words.length; j++) {
            bagowords.push({text: words[j], size: wordFreq[j] * 10})
        }
        return bagowords
        // var count = 0;
        // return words
        //     .map(function (d) {
        //         console.log(wordFreq[count++]);
        //         return {text: d, size: wordFreq[count++]*5};
        //     })
    }

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
    function showNewWords(vis, i) {
        i = i || 0;
        vis.update(getWords(i++ % words.length));
        // setTimeout(function () {
        //     showNewWords(vis, i + 1)
        // }, 2000)
    }

//Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('body');

//Start cycling through the demo data
    showNewWords(myWordCloud);

})
;
