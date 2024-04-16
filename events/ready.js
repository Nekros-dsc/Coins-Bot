const { between } = require("../base/functions");
const colors = require('colors');
const { Bots } = require("../base/Database/Models/Bots");
const checkGuild = require("../base/functions/checkGuild");
module.exports = {
  name: 'ready',

  run: async (client) => {
    const { default_prefix, owner, id } = client.config
    const botDB = await Bots.findOne({
      where: { id: id }
    });
    if (!botDB) return console.error("-- LE BOT N'EST PAS DANS LA DB --")
    botDB.update({ botid: client.user.id }, { where: { id: botDB.id }});


    console.log(
      `Connected has ${client.user.tag} \n`.bgBlue.black
      //+ `Client Id: ${client.user.id} \n `.bgBlack.black
      + `Invite: https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0 \n`.bgGreen.black
      // + `Discord Version: ${Discord.version}`.bgGreen.black
    )

    let type = botDB.activitytype
    if (!botDB.activitytype) type = "WATCHING"
    let activity = botDB.activity
    if (!activity) activity = "CoinsBot PERSO"
    client.user.setActivity({ name: activity, type: type, url: "https://www.twitch.tv/coins" })
    setInterval(async function () {
      const botDB = await Bots.findOne({
        where: { id: id }
      });
      let type = botDB.activitytype
      if (!botDB.activitytype) type = "WATCHING"
      let activity = botDB.activity
      if (!activity) activity = "CoinsBot PERSO"
      client.user.setActivity(activity, { type: type, url: "https://www.twitch.tv/coins" })
    }, 1 * 2000000);//2000000

    let access = JSON.parse(botDB.Owners) || {}
    if (!access[owner]) {
      access[owner] = true
      botDB.update({ Owners: access }, { where: { id: botDB.id }});
    }

    let whitelist = JSON.parse(botDB.Whitelist) || {}
    if (!whitelist[owner]) {
      whitelist[owner] = true
      botDB.update({ Whitelist: whitelist }, { where: { id: botDB.id }});
    }



    await client.guilds.cache.forEach(async g => {

      let guildDB = await checkGuild(client.user.id, g.id)

      let gains = guildDB.Gains || {}
      let minimum = gains.dmin || 1000
      let maximum = gains.dmax || 3000
      let newprice = between(minimum, maximum)
      guildDB.update({ DrugPrice: newprice }, { where: { id: botDB.id }});
    });

  }
}
