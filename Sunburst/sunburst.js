var nodeData = {
  "name": "TOPICS", "children": [{
    "name": "Topic A",
    "children": [{"name": "Sub A1", "size": 4}, {"name": "Sub A2", "size": 4}]
  }, {
    "name": "Topic B",
    "children": [{"name": "Sub B1", "size": 3}, {"name": "Sub B2", "size": 3}, {"name": "Sub B3", "size": 3}]
  }, {
    "name": "Topic C",
    "children": [{"name": "Sub C1", "size": 4}, {"name": "Sub C2", "size": 4}]
  }]
};

/*Mit Bundesligadaten: FTR = Full time result (H für Homewin, D für Draw, A für Awayteam)
                       HTR = Half time result (same)*/

var Sunburst = Sunburst || {},
  d3 = d3 || {};

Sunburst = (function(){

  var that = {};

  function init(){
    console.log("Initialisiere")
  }

  that.init = init;
  return that;
})();

var width = 500,
  height = 500,
  radius = Math.min(width, height)/2,
  color = d3.scaleOrdinal(d3.schemeCategory20b);

var g = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate("+width/2+","+height/2+")");

var partition = d3.partition()
                  .size([2* Math.PI, radius]); //it's a full circle, the distance from middle to outline is radius

var root = d3.hierarchy(nodeData)
             .sum(function(d){return d.size})

partition(root);
var arc = d3.arc()
            .startAngle(function(d){ return d.x0 })
            .endAngle(function(d){ return d.x1 })
            .innerRadius(function(d){ return d.y0 })
            .outerRadius(function(d){ return d.y1 });

g.selectAll("path")
 .data(root.descendants())
 .enter()
 .append("path")
 .attr("display", function(d){ return d.depth ? null : "none" })
 .attr("d", arc)
 .style("stroke", "white")
 .style("fill", function(d){ return color((d.children ? d : d.parent).data.name); });
