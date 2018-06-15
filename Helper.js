var Barchart = Barchart || {};

Barchart.Helper = function(){

  var that = {};

  function makeMap(teams, data){
    var map = new Array;

    //für jedes Team
    for (let i = 0; i < teams.length; i++) {
      let teamName = teams[i],
      oneTeam,
      allSeasons = new Array;

      //für alle Saisons
      for (let k = 0; k < data.bundesliga.length; k++) {
        let allShotValues = [],
          allShotTargetValues = [],
          sumShot,
          sumShotTarget;

        for (var season in data.bundesliga[k]) {
          var oneSeason;
          if(data.bundesliga[k].hasOwnProperty(season)) {
            let current = data.bundesliga[k];
            current[season].forEach((e) => {
              if(e["AwayTeam"] == teams[i]){
                allShotValues.push(e["AS"]);
                allShotTargetValues.push(e["AST"]);
              } else if (e["HomeTeam"] == teams[i]){
                allShotValues.push(e["HS"]);
                allShotTargetValues.push(e["HST"]);
              }
            });
            sumShot = d3.sum(allShotValues);
            sumShotTarget = d3.sum(allShotTargetValues);
            oneSeason = {
              "saison": season,
              "shot": sumShot,
              "target": sumShotTarget
            }
            allSeasons.push(oneSeason);
          }
        }

      }
      oneTeam = {
        "team": teamName,
        "seasons": allSeasons
      }
      map.push(oneTeam);
    }
    return map;
  }

  function makeTeams(data){
    var teams = new Array;
    for (var j = 0; j < data.bundesliga.length; j++) {
      for (var name in data.bundesliga[j]) {
        if (data.bundesliga[j].hasOwnProperty(name)) {
          let current = data.bundesliga[j];
          current[name].forEach((e, i) => {
            if(!teams.includes(e["AwayTeam"])){
              teams.push(current[name][i]["AwayTeam"])
            }
          });
        }
      }
    }
    return teams.sort();
  }

  function getMaximum(map){
    var max = 0;
    for (let i = 0; i < map.length; i++) {
      for (let a = 0; a < map[i].seasons.length; a++){
        if(map[i].seasons[a].shot > max) {
          max = map[i].seasons[a].shot;
        }
      }
    }
    return max;
  }

  that.extractTeams = makeTeams;
  that.makeMap = makeMap;
  that.getMaximum = getMaximum;
  return that;
}
