const checkGuild = require('../functions/checkGuild');
const { Users } = require('../Database/Models/Users');
const items = require("../../shop.json");

module.exports = {
  name: 'ready',

  run: async (client) => {
    setInterval(async function () {
      try {
        client.guilds.cache.forEach(async (guild) => {
          let guildDB = await checkGuild(client.user.id, guild.id);

          const gainTypes = items.bat;

          for (const gainType in gainTypes) {
            const entries = await Users.findAll({
              where: {
                GuildId: guild.id,
                Batiments: { [gainType]: true },
              },
            });

            for (const user of entries) {
              const cashGain = guildDB.Prices[`${gainType}gain`] || gainTypes[gainType].gain;
              await Users.increment('Entrepot', { by: cashGain, where: { primary: user.primary } });
            }
          }
        });
      } catch (error) {
        console.error('Une erreur s\'est produite :', error);
      }
    }, 7200000); // 7200000 correspond à 2 heures (en millisecondes)
  },
};
