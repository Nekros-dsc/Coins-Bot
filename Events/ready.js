const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.js')

    module.exports = {
      name: 'ready',
      async execute(bot) {
        let botDB = bot.db.prepare('SELECT * FROM bot WHERE id = ?').get(bot.user.id)
        if(!botDB) {
          bot.db.exec(`INSERT INTO bot (id) VALUES ('${bot.user.id}')`);
          botDB = bot.db.prepare('SELECT * FROM bot WHERE id = ?').get(bot.user.id)
        }
        try {
        let index = 0;
        const statuses = [
            { name: JSON.parse(botDB.activity).name, type: JSON.parse(botDB.activity).type, presence: 'online' },
        ];
        setInterval(async () => {
            await bot.user.setPresence({ activities: [{ name: statuses[index].name, type: statuses[index].type, url: "https://twitch.tv/ruwin2007yt" }], status: statuses[index].presence });
            index = (index + 1) % statuses.length;
        }, 10000);
      } catch (e) { 
        console.log(e)
      }

      //Initialisation de l'API pour le bot e-tirage voir github --> Ruwin-dsc
      const app = express();
      app.use(bodyParser.json());
      
      const checkApiKey = (req, res, next) => {
        const apiKey = req.query.apiKey;
        if (apiKey === botDB.apikey) {
          next();
        } else {
          res.status(403).json({ message: 'L\'apiKey que vous avez renseigné est invalide !' });
        }
      };
      
      app.post('/addcoins', checkApiKey, (req, res) => {
        const { userId, amount } = req.query;
        const user = bot.users.cache.get(userId)
        if (user) {
          if(user) bot.functions.addCoins(bot, null, null, user.id, amount, 'coins')
          res.json({ message: 'Réussi !'});
        } else {
          res.status(404).json({ message: 'Je n\'ai pas trouvé l\'utilisateur !' });
        }
      });
      
      app.post('/addrep', checkApiKey, (req, res) => {
        const { userId, amount } = req.query;
        const user = bot.users.cache.get(userId)
        if (user) {
          if(user) bot.functions.addCoins(bot, null, null, user.id, amount, 'rep')
          res.json({ message: 'Réussi !'});
        } else {
          res.status(404).json({ message: 'Je n\'ai pas trouvé l\'utilisateur !' });
        }
      });
      
      const PORT = config.port;
      app.listen(PORT, () => {
        console.log(`[!] API lancé sur le port: ${PORT}`);
      });
      },
    };