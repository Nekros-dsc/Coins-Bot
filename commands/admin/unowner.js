const { Bots } = require("../../base/Database/Models/Bots");

module.exports = {
    name: "unowner",
    description: "Retire un owner",
    usage: "unowner <@user/id>",

    run: async (client, message, args) => {
        const botDB = await Bots.findOne({
            where: {
                botid: client.user.id
            }
        });
        if (!botDB) return message.reply(":warning: Votre bot n'est pas inscrit dans la base de donnée d'EpicBots, veuillez contacter le support ! ")
        let actualowners = JSON.parse(botDB.Owners) || {}
        var founder = client.config.owner
        if (founder.includes(message.author.id)) {
            let id
            if (message.mentions.users.first()) {
                let m = message.mentions.users.first()
                if (!m || m.bot) return message.reply({ content: ":x: `ERROR:` Pas de membre trouvé !", allowedMentions: { repliedUser: false } })
                id = m.id
            } else {
                if (isNaN(args[0])) return message.channel.send(`:x: Aucun membre trouvé !`)
                id = args[0]
            }
            let mm = client.users.cache.get(id)
            if (!mm) mm = `<@${id}>`
            if (!actualowners[id]) return message.channel.send(`\`❌\` \`${`${mm}`.replaceAll("`", "")}\` n'est pas dans la liste des owners !`)
            delete actualowners[id]
            botDB.update({ Owners: actualowners }, { where: { id: botDB.id }});
            return message.channel.send(`\`✅\` ${mm} n'est plus owner du bot !`)

        }

    }
}