// var nodeData = {
//   "name": "TOPICS", "children": [{
//     "name": "Topic A",
//     "children": [{"name": "Sub A1", "size": 4}, {"name": "Sub A2", "size": 4}]
//   }, {
//     "name": "Topic B",
//     "children": [{"name": "Sub B1", "size": 3}, {"name": "Sub B2", "size": 3}, {"name": "Sub B3", "size": 3}]
//   }, {
//     "name": "Topic C",
//     "children": [{"name": "Sub C1", "size": 4}, {"name": "Sub C2", "size": 4}]
//   }]
// };



var Sunburst = Sunburst || {};

Sunburst.Helper = function(){

  var that = {},
    data;

  function extractTeams(json){
    data = json;
    var teams = new Array;
    for (var i = 0; i < json.saison_16_17.length; i++) {
      let current = json.saison_16_17[i];
      if(!teams.includes(current["AwayTeam"])){
        teams.push(current["AwayTeam"])
      }
    }
    return teams;
  }

  function organizeData(teams){
    var nodeData = {};
    nodeData.name = "TEAMS";
    nodeData.children = new Array;

    //make object for every team and push this then to nodeData.children
    for (let i = 0; i < teams.length; i++) {
      let oneTeam = {};
      oneTeam.name = teams[i];
      oneTeam.children = new Array;

      oneTeam.children.push(calcEndWin(teams[i]))
      oneTeam.children.push(calcEndLoss(teams[i]))
      oneTeam.children.push(calcEndDraw(teams[i]))

      nodeData.children.push(oneTeam);
    }

    console.log(nodeData.children[1]);

    return nodeData;
  }

  //make new Object for ever fulltime result, then push to oneTeam.children
  function calcEndWin(team){
    var winObj = {};
    winObj.name = "Win";
    winObj.size = calcSize("win", team);
    winObj.children = new Array;

    return winObj;
  }

  function calcEndLoss(team){
    var lossObj = {};
    lossObj.name = "Loss";
    lossObj.size = calcSize("loss", team);
    lossObj.children = new Array;

    return lossObj;
  }

  function calcEndDraw(team){
    var drawObj = {};
    drawObj.name = "Draw";
    drawObj.size = calcSize("draw", team);
    drawObj.children = new Array;

    return drawObj;
  }

  //calculate the size for each piece of the inner pie
  function calcSize(type, team){
    let fullTimeResult = 0;
    if (type == "win") {
      for (let i = 0; i < data.saison_16_17.length; i++) {
        if(data.saison_16_17[i]["HomeTeam"] == team && data.saison_16_17[i]["FTR"] == "H"){
          fullTimeResult++;
        }
        if(data.saison_16_17[i]["AwayTeam"] == team && data.saison_16_17[i]["FTR"] == "A"){
          fullTimeResult++;
        }
      }
    } else if (type == "loss") {
      for (let i = 0; i < data.saison_16_17.length; i++) {
        if(data.saison_16_17[i]["HomeTeam"] == team && data.saison_16_17[i]["FTR"] == "A"){
          fullTimeResult++;
        }
        if(data.saison_16_17[i]["AwayTeam"] == team && data.saison_16_17[i]["FTR"] == "H"){
          fullTimeResult++;
        }
      }
    } else if (type == "draw") {
      for (let i = 0; i < data.saison_16_17.length; i++) {
        if(data.saison_16_17[i]["HomeTeam"] == team && data.saison_16_17[i]["FTR"] == "D"){
          fullTimeResult++;
        }
        if(data.saison_16_17[i]["AwayTeam"] == team && data.saison_16_17[i]["FTR"] == "D"){
          fullTimeResult++;
        }
      }
    }
    return fullTimeResult;
  }


  that.extractTeams = extractTeams;
  that.organizeData = organizeData;
  return that;
}
