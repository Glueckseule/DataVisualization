//code for visualizing team shot vs. team shot on target
let height = 200, barWidth = 15, padding = 5;

let y = d3.scaleLinear()
          .domain([1, 100])
          .rangeRound([height, 0]);

d3.select('svg')
  .attr('width', 200) //width of svg background
  .attr('height', 200) //height of svg background
  .attr('style', 'background:green;')
  .selectAll('rect')
  .data([12,30,45,25,60,80,99,5])
  .enter()
  .append('rect')
  .attr('y', function(d){
    return y(d);
  })
  .attr('x', function(d,i){
    return i * (barWidth+padding)+padding;
  })
  .attr('height', function(d){
    return height - y(d);
  })
  .attr('width', barWidth);
