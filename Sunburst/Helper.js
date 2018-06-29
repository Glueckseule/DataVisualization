var Sunburst = Sunburst || {};

Sunburst.Helper = function(){

  var that = {};

  function extractTeams(json){
    var teams = new Array;
    for (var i = 0; i < json.saison_16_17.length; i++) {
      let current = json.saison_16_17[i];
      if(!teams.includes(current["AwayTeam"])){
        teams.push(current["AwayTeam"])
      }
    }
    console.log(teams)
  }

  that.extractTeams = extractTeams;
  return that;
}
