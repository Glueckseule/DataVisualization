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
    width = 1200-margin.left-margin.right,
    height = 800-margin.top-margin.bottom;

  function initialize(){
    helper = new Barchart.Helper();

    //select svg and set width with margin
    svg = d3.select(".chart")
            .attr("width", "100%")
            .attr("height", height + margin.bottom + margin.top);
    g = svg.append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top+")");

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

    //remove all bars when new team selection
    svg.selectAll(".shot").remove();
    svg.selectAll(".target").remove();

    //for shotbars
    svg.selectAll(".shot")
       .data(currentDataForThisTeam)
       .enter().append("rect")
       .attr("class", "shot")
       .on("mouseover", onMouseOverShot)
       .on("mouseout", onMouseOutShot)
       .attr("x", function(d){ return margin.left+xScale(d.saison);})
       .attr("y", function(d){ return margin.top+yScale(d.shot)})
       .attr("width", xScale.bandwidth())
       .transition()
       .ease(d3.easeLinear)
       .duration(400)
       .delay(function(d,i){
         return i*50
       })
       .attr("height", function(d){ return height-yScale(d.shot)+"px"})

    svg.selectAll(".target")
       .data(currentDataForThisTeam)
       .enter().append("rect")
       .attr("class", "target")
       .on("mouseover", onMouseOverTarget)
       .on("mouseout", onMouseOutTarget)
       .attr("x", function(d){ return margin.left+xScale(d.saison);})
       .attr("y", function(d){ return margin.top+yScale(d.target)})
       .attr("width", xScale.bandwidth())
       .transition()
       .ease(d3.easeLinear)
       .duration(400)
       .delay(function(d,i){
         return i*50
       })
       .attr("height", function(d){ return height-yScale(d.target)+"px"})
  }

  //when hovering, make bar orange and show text (for both bars)
  function onMouseOverShot(d,i){
    d3.select(this).attr("class", "highlight");
    d3.select(this)
      .transition()
      .duration(400)

    svg.append("text")
     .attr("class", "value")
     .attr("x", function(){ return xScale(d.saison);})
     .attr("y", function(){ return yScale(d.shot);})
     .attr("dx", 70)
     .attr("dy", 50)
     .text(function(){ return d.shot})
     .attr("fill", "black")
  }

  function onMouseOverTarget(d,i){
    d3.select(this).attr("class", "highlight");
    d3.select(this)
      .transition()
      .duration(400)

    svg.append("text")
     .attr("class", "value")
     .attr("x", function(){ return xScale(d.saison);})
     .attr("y", function(){ return yScale(d.target);})
     .attr("dx", 70)
     .attr("dy", 50)
     .text(function(){ return d.target})
     .attr("fill", "black")
  }

  function onMouseOutShot(d,i){
    d3.select(this)
      .attr("class", "shot");

    d3.selectAll(".value")
      .remove()
  }

  function onMouseOutTarget(d,i){
    d3.select(this)
      .attr("class", "target");

    d3.selectAll(".value")
      .remove()
  }

  //make the axis for the svg
  function makeAxis(){
    var max = helper.getMaximum(yearValueMap),
      mapSeasons = yearValueMap[0];

    xScale = d3.scaleBand()
              .domain(mapSeasons.seasons.map(function(d){
                return d.saison;
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
