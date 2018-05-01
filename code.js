var d3 = d3 || {};
var data;

function doChart(){
  "use strict";

  var width = 1000, height = 1000;

  var svg = d3.select(".chart")
              .attr("width", width)
              .attr("height", height);

  d3.json("json_files/saison_16_17.json", function(error, json){

    if(error) return console.warn(error);

    data = json;

    console.log(data);


  });

}

doChart();
