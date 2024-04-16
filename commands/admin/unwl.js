const { Bots } = require("../../base/Database/Models/Bots");

module.exports = {
    name: "unwl",
    description: "Retire un membre à la whitelist",
    usage: "unwl <@user/id>",
    aliases: ['unwhitelist'],
    owner: true,


    run: async (client, message, args) => {
        const botDB = await Bots.findOne({
            where: {
                botid: client.user.id
            }
        });
        if (!botDB) return message.reply(":warning: Votre bot n'est pas inscrit dans la base de donnée d'EpicBots, veuillez contacter le support ! ")
        let actualwhitelist = JSON.parse(botDB.Whitelist) || {}
        var founder = client.config.owner
        if (founder.includes(message.author.id)) {
            let id
            if (isNaN(args[0])) {
                let m = message.mentions.users.first()
                if (!m || m.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
                id = m.id
            } else {
                if (args[0].length !== 18 || isNaN(args[0])) return message.channel.send(`Aucun membre trouvé pour: \`${args[0] || "rien"}\``)
                id = args[0]
            }

            if (!actualwhitelist[id]) return message.channel.send(`\`❌\` ${mm.username} n'est pas dans la liste des whitelist !`)
            let mm = client.users.cache.get(id)
            if (!mm) mm = `<@${id}>`

            delete actualwhitelist[id]
            botDB.update({ Whitelist: actualwhitelist }, { where: { id: botDB.id }});
            return message.channel.send(`\`✅\` ${mm} n'est plus dans la whitelist du bot ! `)

        }

    }
}