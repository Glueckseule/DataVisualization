//HS und AS Torversuche nicht aufs Tor, also Pfosten oder ähnliches
//HST und AST haben getroffen oder hätten ohne Torwart getroffen

var Barchart = Barchart || {},
  d3 = d3 || {};

Barchart = (function(){

  var that = {},
    helper,
    data,
    teams,
    yearValueMap = [],
    svg,
    g,
    xScale,
    yScale,
    margin = {top: 20, right:20, bottom: 70, left: 40},
    width = 1000-margin.left-margin.right,
    height = 500-margin.top-margin.bottom;

  function initialize(){
    helper = new Barchart.Helper();

    //select svg and set width with margin
    svg = d3.select(".chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.bottom + margin.top)
    g = svg.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top+")")

    //load the data and call all functions only working with data
    d3.json("json_files/bundesliga.json", function(error, json){
      if(error){
         return console.warn(error);
      }
      data = json;
      teams = helper.extractTeams(data);
      makeDropdown();
      yearValueMap = helper.makeMap(teams, data);
      makeAxis();
    })
  }

  //make a drop down menu containing all teamnames for all seasons (later)
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
  }

  function onChangeTeam(){
    makeChartForCurrent(this.value);
  }

  //on click on dropdown team, get the values for this team name and make the bars
  function makeChartForCurrent(teamName){
    var currentDataForThisTeam;

    for (var i = 0; i < yearValueMap.length; i++) {
      if(yearValueMap[i].team == teamName){
        currentDataForThisTeam = yearValueMap[i].seasons;
      }
    }

    svg.selectAll(".bar").remove();

    //for shotbars
    svg.selectAll(".bar")
       .data(currentDataForThisTeam)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d){ return margin.left+xScale(d.saison);})
       .attr("y", function(d){ return margin.top+yScale(d.shot)})
       .attr("width", xScale.bandwidth())
       .attr("height", function(d){ return height-yScale(d.shot)+"px"})
       .text(function(d){return d})
       .attr("fill", "white")
  }

  function makeAxis(){
    var max = helper.getMaximum(yearValueMap),
      mapSeasons = yearValueMap[0];

    xScale = d3.scaleBand()
              .domain(mapSeasons.seasons.map(function(d){
                 //  let season = d.saison,
                 //    newName = season.replace("saison_","");
                 //  newName = newName.replace("_","/");
                 // return "Saison "+newName;
                 return d.saison
               }))
               .rangeRound([0, width])
               .padding([.05]),
    yScale = d3.scaleLinear()
               .domain([0, max])
               .range([height, 0]);
    g.append("g")
     .attr("transform", "translate(0,"+height+")")
     .call(d3.axisBottom(xScale));

    g.append("g")
     .call(d3.axisLeft(yScale))
  }

  that.init = initialize;
  return that

})();
