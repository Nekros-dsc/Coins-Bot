const { ownersend } = require("../base/functions");
var rate = require('../roulette.js');
let r = 0
module.exports = {
    name: 'rateLimit',

    run: async (client, rateLimitData) => {
        r++
        if (rate.rate !== true) {
            if (r >= 15) {
                rate.rate = true;
                setTimeout(() => {
                    client.destroy();
                    client.login(client.config.token)
                    rate.rate = false;
                    ownersend(client, "[ANTI RATE-LIMIT] Le bot est de nouveau fonctionnel !")
                }, 120000);
                ownersend(client, "[ANTI RATE-LIMIT] Bot en pause pour 2 minutes ! Il va redémarrer automatiquement !")
                r = 0
            }
        }
        setTimeout(() => {
            r = r - 1
        }, 60000);
        console.log('RATELIMIT ERR : ', rateLimitData)
    }
}