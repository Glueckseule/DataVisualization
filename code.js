var d3 = d3 || {}
var data
var teams = new Array()

//HS und AS Torversuche nicht aufs Tor, also Pfosten oder ähnliches
//HST und AST haben getroffen oder hätten ohne Torwart getroffen

function initialize(){
  "use strict"

  var margin = {top: 20, right: 20, bottom: 70, left: 40},
      width = 600-margin.left-margin.right, height = 300-margin.top-margin.bottom

  var x = d3.scaleBand().rangeRound([0, width]).padding([.05])
  var y = d3.scaleLinear().range([height, 0])

  var xAxis = d3.axisBottom()
                .scale(x)

  var yAxis = d3.axisLeft()
                .scale(y)
                .ticks(3)

  //select svg and set width
  var svg = d3.select(".chart")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.bottom + margin.top)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top+")")

  //add axis
  svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0,"+height+")")
     .call(xAxis)
     .selectAll("text")
     .style("text-anchor", "end")
     .attr("dx", "-.8em")
     .attr("dy", "-.55em")
     .attr("transform", "rotate(-90)")

  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis)
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 5)
     .attr("dy", ".71em")
     .style("text-anchor", "end")

  //load the data and call all functions only working with data
  d3.json("json_files/saison_16_17.json", function(error, json){
    if(error) return console.warn(error)

    data = json
    console.log(data["saison_16_17"][0])

    extractTeams()
    makeDropdown()

  })
}

function extractTeams(){
  data["saison_16_17"].forEach((e, i) => {
    if(!teams.includes(e["AwayTeam"])){
      teams.push(data["saison_16_17"][i]["AwayTeam"])
    }
  })
}

function makeDropdown(){
  var select = d3.select('.select')
                 .on('change', onChangeTeam)

  var options = select.selectAll('option')
                      .data(teams)
                      .enter()
                      .append('option')
                      .text(function(d){
                        return d
                      })
                      .attr('value', function(d){
                        return d
                      })

  function onChangeTeam(){
    makeChartForCurrent(this.value)
  }
}

function makeChartForCurrent(teamName){
  console.log(teamName)
  // data["saison_16_17"].forEach((e, i) => {
  //   if(e["AwayTeam"] == teamName){
  //     var height = d3.nest()
  //                    .key(e["AwayTeam"]);
  //                    .rollup(function(d) {
  //                      return d3.sum(g, function(g){
  //                        return e["AS"]
  //                      })
  //                    })
  //                    .entries(json)
  //   }
  // })
}

initialize()
