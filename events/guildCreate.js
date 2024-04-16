const { ownersend } = require("../base/functions");
const { Bots } = require('../base/Database/Models/Bots');
module.exports = {
    name: 'guildCreate',

    run: async (client, guild) => {
        const { default_prefix, owner, id, max_guild } = client.config

        if (client.guilds.cache.size > max_guild) {
            if (!owner) return;
            ownersend(client, `Vous ne pouvez plus ajouter votre bot dans des serveurs il a atteint le quota maximum de ${max_guild}`)
            return guild.leave()
        }
        const guildMember = await guild.members.fetch();
        const botDB = await Bots.findOne({
            where: {
                botid: client.user.id
            }
        });
        if (!botDB) { guild.leave(); return console.error(":warning: Votre bot n'est pas inscrit dans la base de donnée d'EpicBots, veuillez contacter le support ! ") }
        let owners = JSON.parse(botDB.Owners) || {}
        owners = Object.keys(owners);
        let check = false
        if (!owners) { check = false } else {
            for (let i = 0; i < owners.length; i++) {
                if (owners === null) continue;
                if (guildMember.has(owners[i])) check = true
            }
        }
        let guildOwnerTag = await guild.fetchOwner().then((member) => member.user.tag);
        if (check !== true) {
            ownersend(client, `J'ai leave ${guild.name} (${guild.memberCount} membres, propriétaire : ${guildOwnerTag}) , car aucun owner n'est présent sur le serveur`);
            return guild.leave();
        }

        guildOwnerTag = await guild.fetchOwner().then((member) => member.user.tag);
        ownersend(client, `Je viens de rejoindre ${guild.name} (${guild.memberCount} membres, propriétaire : ${guildOwnerTag})`)

    }
}