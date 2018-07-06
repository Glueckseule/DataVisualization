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

  //make new JSON for sunburst
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

    return nodeData;
  }

  //make new Object for ever fulltime result, then push to oneTeam.children
  function calcEndWin(team){
    var winObj = {};
    winObj.name = "Win";
    winObj.children = calcSize("win", team, 2);

    return winObj;
  }

  function calcEndLoss(team){
    var lossObj = {};
    lossObj.name = "Loss";
    lossObj.children = calcSize("loss", team, 2);

    return lossObj;
  }

  function calcEndDraw(team){
    var drawObj = {};
    drawObj.name = "Draw";
    drawObj.children = calcSize("draw", team, 2);

    return drawObj;
  }

  function calcSize(type, team, level){
    let fullTimeResult = 0,
      winHalf = 0,
      lossHalf = 0,
      drawHalf = 0,
      winnerFirst,
      winnerSecond;

    if(type == "win"){
      winnerFirst = "H";
      winnerSecond = "A";
    } else if (type == "loss"){
      winnerFirst = "A";
      winnerSecond = "H";
    } else if (type == "draw"){
      winnerFirst = "D";
      winnerSecond = "D";
    }

    for (let i = 0; i < data.saison_16_17.length; i++) {
      if(data.saison_16_17[i]["HomeTeam"] == team && data.saison_16_17[i]["FTR"] == winnerFirst){
        fullTimeResult++;
        if(level == 2){
          if (data.saison_16_17[i]["HTR"] == "H"){
            winHalf++;
          } else if (data.saison_16_17[i]["HTR"] == "A"){
            lossHalf++;
          } else if (data.saison_16_17[i]["HTR"] == "D"){
            drawHalf++;
          }
        }
      } else if (data.saison_16_17[i]["AwayTeam"] == team && data.saison_16_17[i]["FTR"] == winnerSecond){
        fullTimeResult++;
        if(level == 2){
          if (data.saison_16_17[i]["HTR"] == "A"){
            winHalf++;
          } else if (data.saison_16_17[i]["HTR"] == "H"){
            lossHalf++;
          } else if (data.saison_16_17[i]["HTR"] == "D"){
            drawHalf++;
          }
        }
      }
    }

    if(level == 1){
      return fullTimeResult;
    } else {
      let result = new Array,
        firstObj = {
          "name": "S",
          "size": winHalf
        },
        secondObj = {
          "name": "N",
          "size": lossHalf
        },
        thirdObj = {
          "name": "U",
          "size": drawHalf
        };
      result.push(firstObj);
      result.push(secondObj);
      result.push(thirdObj);
      return result;
    }
  }

  function markSelected(object){
    for (var i = 0; i < object.parentElement.childNodes.length; i++) {
      object.parentElement.childNodes[i].classList.remove("selected")
    }
    object.classList.add("selected");
  }

  function getTeamData(team){
    for (var i = 0; i < nodeData.children.length; i++) {
      if(nodeData.children[i].name == team){
        return nodeData.children[i];
      }
    }
  }

  that.extractTeams = extractTeams;
  that.organizeData = organizeData;
  that.markSelected = markSelected;
  that.getTeamData = getTeamData;
  return that;
}
