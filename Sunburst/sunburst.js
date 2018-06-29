/*Mit Bundesligadaten: FTR = Full time result (H für Homewin, D für Draw, A für Awayteam)
                       HTR = Half time result (same)*/

var Sunburst = Sunburst || {},
  d3 = d3 || {};

Sunburst = (function(){

  var that = {},
    helper,
    width = 500,
    height = 500,
    radius = Math.min(width, height)/2,
    color = d3.scaleOrdinal(d3.schemeCategory20b),
    data,
    teams;

  function init(){
    helper = new Sunburst.Helper();

    //select svg and set width + height to node
    var g = d3.select("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate("+width/2+","+height/2+")");

      var partition = d3.partition()
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
    console.log(this.getAttribute("value"))
  }

  that.init = init;
  return that;
})();

// var width = 500,
//   height = 500,
//   radius = Math.min(width, height)/2,
//   color = d3.scaleOrdinal(d3.schemeCategory20b);

// var g = d3.select("svg")
//         .attr("width", width)
//         .attr("height", height)
//         .append("g")
//         .attr("transform", "translate("+width/2+","+height/2+")");

// var partition = d3.partition()
//                   .size([2* Math.PI, radius]); //it's a full circle, the distance from middle to outline is radius



// var root = d3.hierarchy(nodeData)
//              .sum(function(d){return d.size})
//
// partition(root);
// var arc = d3.arc()
//             .startAngle(function(d){ return d.x0 })
//             .endAngle(function(d){ return d.x1 })
//             .innerRadius(function(d){ return d.y0 })
//             .outerRadius(function(d){ return d.y1 });
//
// g.selectAll("path")
//  .data(root.descendants())
//  .enter()
//  .append("path")
//  .attr("display", function(d){ return d.depth ? null : "none" })
//  .attr("d", arc)
//  .style("stroke", "white")
//  .style("fill", function(d){ return color((d.children ? d : d.parent).data.name); });
