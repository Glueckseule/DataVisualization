var Sunburst = Sunburst || {},
  d3 = d3 || {};

Sunburst = (function(){

  var that = {},
    helper,
    infoDiv = document.querySelector("#info"),
    legendDiv = document.querySelector(".legend"),
    infoCircle,
    width = 500,
    height = 500,
    g,
    partition,
    radius = Math.min(width, height)/2,
    colorArray = ["#FFF","#00A0BF","#BF0A61","#FF8C00","#006A7F","#7F0640","#7F4600"],
    color = d3.scaleOrdinal().range(colorArray),
    data,
    teams;

  function init(){
    helper = new Sunburst.Helper();

    //select svg and set width + height to node
    g = d3.select("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate("+width/2+","+height/2+")");

    partition = d3.partition()
      .size([2* Math.PI, radius]);

    //load the data
    d3.json("saison_16_17.json", function(error, json){
      if(error){
        return console.warn(error);
      }
      data = json;
      teams = helper.extractTeams(data);
      makeTeamSelection();
      nodeData = helper.organizeData(teams);
    })
  }

  //make the menu on the left side to select team to be displayed and set listener
  function makeTeamSelection(){
    var select = d3.select("#selection")
      .selectAll("div")
      .data(teams).enter()
      .append("div")
      .attr("class", "option")
      .text(function(d){ return d })
      .attr("value", function(d){ return d })
      .on("click", onChangeTeam)
  }

  function onChangeTeam(){
    helper.markSelected(this);
    makeChartForTeam(this.getAttribute("value"));
  }

  //when team is clicked on, draw the data, but first remove all data from container
  function makeChartForTeam(team){
    var container = document.querySelector("svg g");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    infocircle = g.append("circle")
      .attr("r", "95")
      .attr("class", "info-circle");

    var teamData = helper.getTeamData(team);

    var root = d3.hierarchy(teamData)
      .sum(function(d){ return d.size });

    var arc = d3.arc()
      .startAngle(function(d){ return d.x0 })
      .endAngle(function(d){ return d.x1 })

      .innerRadius(radius*0.5)
      .outerRadius(radius*0.9);

    g.selectAll("path")
     .data(partition(root).descendants())
     .enter()
     .append("g")
     .on("mouseover", handleMouseover)
     .attr("class", "node").append("path")
     .attr("display", function(d){ return d.depth ? null : "none" })
     .attr("d", arc)
     .style("stroke", "white")
     .style("fill", function(d){ return color((d.children ? d : d.parent).data.name); });

    g.selectAll(".node")
      .append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
       .attr("dx", "-5") // radius margin
       .attr("dy", ".5em") // rotation align
       .attr("value", function(d){ return d.value})
       .text(function(d) { return d.parent ? d.data.name : "" });

    helper.fillSpaceholders(teamData);
  }

  function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;
    return (angle < 120 || angle > 270) ? angle : angle + 180;
  }

  function handleMouseover(){
    let nodeSelected = document.querySelector(".node-selected"),
      nodeValue = this.children[1].getAttribute("value");

    if (nodeSelected != undefined){
      nodeSelected.classList.remove("node-selected");
    }

    this.classList.add("node-selected");
    g.select(".infotext").remove();

    g.append("text")
      .attr("class", "infotext")
      .text(nodeValue)
      .attr("dx", function(){
        if (nodeValue < 10) { return "-8px" }
        if (nodeValue >= 10) { return "-17px"}
      })
      .attr("dy", "10px");
  }

  that.init = init;
  return that;
})();
