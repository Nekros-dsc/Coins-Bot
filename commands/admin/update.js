const { Bots } = require("../../base/Database/Models/Bots");


module.exports = {
  name: 'update',
  description: 'Mets à jour le bot',
  owner: true,
  cooldown: 1,
  run: async (client, message, args) => {

      message.reply(`_Pour mettre votre bot à jour, veuillez vous rendre sur le support du bot et faire \`/update\`_`)

  }
};
