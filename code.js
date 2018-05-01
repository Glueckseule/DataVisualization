var d3 = d3 || {};
var data;
var teams = new Array();

//HS und AS Torversuche nicht aufs Tor
//HST und AST haben getroffen oder hätten ohne Torwart getroffen
//HHW und AHW sind Latten und Pfosten

function doChart(){
  "use strict";

  var margin = {top: 20, right: 20, bottom: 70, left: 40},
      width = 600-margin.left-margin.right, height = 300-margin.top-margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding([.05]);
  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom()
                .scale(x);

  var yAxis = d3.axisLeft()
                .scale(y)
                .ticks(5);

  var svg = d3.select(".chart")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.bottom + margin.top)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top+")");

  d3.json("json_files/saison_16_17.json", function(error, json){
    if(error) return console.warn(error);

    data = json;
    console.log(data["saison_16_17"][0]);

    extractTeams();
    makeDropdown();

    console.log(teams);


  });
}

function extractTeams(){
  for(let i = 0; i < data["saison_16_17"].length; i++){
    if(!teams.includes(data["saison_16_17"][i]["AwayTeam"])){
      teams.push(data["saison_16_17"][i]["AwayTeam"]);
    }
  }
}

function makeDropdown(){
  var select = d3.select('.menuDropdown')
                 .append('select')
                 .attr('class', 'select')
                 .on('change', onChangeTeam);

  var options = select.selectAll('option')
                      .data(teams).enter()
                      .append('option')
                      .text(function(d){
                        return d;
                      });

  function onChangeTeam(){
    
  }
}

doChart();
