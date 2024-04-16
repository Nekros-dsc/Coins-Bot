const { Teams } = require("../../Database/Models/Teams");

module.exports = async (memberId, team, rank) => {
  if (team) {
    const members = team.members ? JSON.parse(team.members) : {}; // Conversion de la chaîne en objet JSON

    members[memberId] = { rank }; // Ajout du membre avec son rang dans le dictionnaire

    await Teams.update({ members: JSON.stringify(members) }, { where: { primary: team.primary }}); 

    return true;
  } else {
    return false;
  }
};
