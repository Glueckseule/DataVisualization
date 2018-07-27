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
    winObj.name = "S";
    winObj.children = calcSize("win", team);

    return winObj;
  }

  function calcEndLoss(team){
    var lossObj = {};
    lossObj.name = "N";
    lossObj.children = calcSize("loss", team);

    return lossObj;
  }

  function calcEndDraw(team){
    var drawObj = {};
    drawObj.name = "U";
    drawObj.children = calcSize("draw", team);

    return drawObj;
  }

  function calcSize(type, team){
    let winHalf = 0,
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
        if (data.saison_16_17[i]["HTR"] == "H"){
          winHalf++;
        } else if (data.saison_16_17[i]["HTR"] == "A"){
          lossHalf++;
        } else if (data.saison_16_17[i]["HTR"] == "D"){
          drawHalf++;
        }
      } else if (data.saison_16_17[i]["AwayTeam"] == team && data.saison_16_17[i]["FTR"] == winnerSecond){
        if (data.saison_16_17[i]["HTR"] == "A"){
          winHalf++;
        } else if (data.saison_16_17[i]["HTR"] == "H"){
          lossHalf++;
        } else if (data.saison_16_17[i]["HTR"] == "D"){
          drawHalf++;
        }
      }
    }

    let result = new Array;
    if(winHalf != 0){
      let firstObj = {
        "name": "S",
        "size": winHalf
      };
      result.push(firstObj);
    }
    if(lossHalf != 0){
      let secondObj = {
        "name": "N",
        "size": lossHalf
      };
      result.push(secondObj);
    }
    if(drawHalf != 0){
      let thirdObj = {
        "name": "U",
        "size": drawHalf
      };
      result.push(thirdObj);
    }

    return result;
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

  function fillSpaceholders(teamData){
    let nodes = document.querySelectorAll(".node"),
      win = nodes[1].childNodes[1].getAttribute("value"),
      loss = nodes[2].childNodes[1].getAttribute("value"),
      draw = nodes[3].childNodes[1].getAttribute("value"),
      gamesPlayed = parseInt(win)+parseInt(loss)+parseInt(draw),
      winValue = document.querySelector(".description-win"),
      lossValue = document.querySelector(".description-loss"),
      drawValue = document.querySelector(".description-draw"),
      divDescription = document.getElementById("info");

    winValue.innerHTML = "<span class='key-dot win'></span><span>Endstand Sieg <br> Gesamt "+win+"</span>";
    lossValue.innerHTML = "<span class='key-dot loss'></span><span>Endstand Niederlage <br> Gesamt "+loss+"</span>";
    drawValue.innerHTML = "<span class='key-dot draw'></span><span>Endstand Unentschieden <br> Gesamt "+draw+"</span>";

    winPerc = Math.round((win/gamesPlayed)*100);
    lossPerc = Math.round((loss/gamesPlayed)*100);
    drawPerc = Math.round((draw/gamesPlayed)*100);

    //Der Verein x hat von seinen 34 Spielen in der Saison y/z a% der Spiele gewonnen, b% verloren, [...]
    divDescription.classList.remove("hide");
    divDescription.innerHTML = 'Der Verein '+teamData.name+' hat von seinen 34 Spielen in der Saison 2016/17 '+winPerc+'% der Spiele gewonnen, '+lossPerc+'% verloren und '+drawPerc+'% unentschieden gespielt (gerundet). <br>Die Grafik zeigt, wie die jeweiligen Endstände noch zur Halbzeit ausgesehen haben (<strong>S</strong>&nbsp;=&nbsp;zur&nbsp;Halbzeit&nbsp;vorne, <strong>U</strong>&nbsp;=&nbsp;Gleichstand, <strong>N</strong>&nbsp;=&nbsp;zur&nbsp;Halbzeit&nbsp;hinten)';
  }

  that.extractTeams = extractTeams;
  that.organizeData = organizeData;
  that.markSelected = markSelected;
  that.getTeamData = getTeamData;
  that.fillSpaceholders = fillSpaceholders;
  return that;
}
