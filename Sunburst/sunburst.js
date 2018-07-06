/*Mit Bundesligadaten: FTR = Full time result (H für Homewin, D für Draw, A für Awayteam)
                       HTR = Half time result (same)*/

var Sunburst = Sunburst || {},
  d3 = d3 || {};

Sunburst = (function(){

  var that = {},
    helper,
    width = 500,
    height = 500,
    g,
    partition,
    radius = Math.min(width, height)/2,
    colorArray = ["#FFF","#00A0BF","#BF0A61","#FF8C00","#006A7F","#7F0640","#7F4600"],
    color = d3.scaleOrdinal().range(colorArray),
    // color = d3.scaleOrdinal(d3.schemeCategory20b),
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

  function makeChartForTeam(team){
    var container = document.querySelector("svg g");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    var teamData = helper.getTeamData(team);
    console.log(teamData)

    var root = d3.hierarchy(teamData)
      .sum(function(d){ return d.size });

    var arc = d3.arc()
      .startAngle(function(d){ return d.x0 })
      .endAngle(function(d){ return d.x1 })
      .innerRadius(function(d){ return d.y0 })
      .outerRadius(function(d){ return d.y1 });

    g.selectAll("path")
     .data(partition(root).descendants())
     .enter()
     .append("g").attr("class", "node").append("path")
     .attr("display", function(d){ return d.depth ? null : "none" })
     .attr("d", arc)
     .style("stroke", "white")
     .style("fill", function(d){ return color((d.children ? d : d.parent).data.name); })
     // .style("fill", function(d){ return color(d.data.name); })
     .on("click", click);

    g.selectAll(".node")
      .append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
       .attr("dx", "-20") // radius margin
       .attr("dy", ".5em") // rotation align
       .attr("value", function(d){ return d.value})
       .text(function(d) { return d.parent ? d.data.name : "" });
  }

  function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;
    return (angle < 120 || angle > 270) ? angle : angle + 180;
  }

  function click(){
    console.log(this.nextSibling.getAttribute("value"))
  }

  that.init = init;
  return that;
})();
