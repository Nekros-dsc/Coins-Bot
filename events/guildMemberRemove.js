const { wl } = require("../base/functions");
const userTeam = require('../base/functions/teams/userTeam');
const teamRemove = require('../base/functions/teams/teamRemove');
const { Bots } = require('../base/Database/Models/Bots');
module.exports = {
  name: 'guildMemberRemove',

  run: async (client, member) => {
    try {
      if (await wl(client, member.user.id) !== true) {
        const botDB = await Bots.findOne({
          where: {
            botid: client.user.id
          }
        });
        if (!botDB) return console.error("-- BOT INVALIDE --")
        let actualwhitelist = JSON.parse(botDB.Whitelist) || {}
        delete actualwhitelist[member.id]
        botDB.update({ Whitelist: actualwhitelist }, { where: { id: botDB.id }});
      }
      let team = await userTeam(member.id, member.guild.id)
      if (team) {
        let finallb = Object.entries(JSON.parse(team.members))
        const memberData = finallb.find(([id]) => id === member.id);
        if (memberData[1].rank !== 1) {
          await teamRemove(member.id, team)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

};


