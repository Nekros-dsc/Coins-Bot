const BotClient = require('./base/Client.js');
const { Bots } = require('./base/Database/Models/Bots.js');

module.exports = function processData(data) {
  const bot = new BotClient(data);

  bot.login(data.token)
    .then(() => {
      // Le bot s'est connecté avec succès, vous pouvez effectuer des actions ici si nécessaire
      console.log(`Bot connecté avec le jeton ${data.token}`);
    })
    .catch((error) => {
      // Une erreur s'est produite lors de la connexion du bot
      console.error(`Erreur lors de la connexion du bot avec le jeton ${data.token}:`, error.message);

      if (error.message.includes('An invalid token was provided.')) {
        console.error('Le jeton n\'était pas valide. Veuillez vérifier le jeton et réessayer.');
        Bots.update(
          { Status: '1' },
          { where: { token: data.token } }
        );
      }
    });

  return bot;
};
