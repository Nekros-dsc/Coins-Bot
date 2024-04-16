const { owner, wl, webhook } = require("../../base/functions");
module.exports = {
    name: "leave",
    description: "Quitte un serveur",
    aliases: ['left'],
    cooldown: 2,

    run: async (client, message, args) => {
        try {

            const founder = client.config.owner

            if (founder.includes(message.author.id)) {
                const guildID = args[0] || message.guild.id
                if (isNaN(guildID) || !guildID || guildID.length < 18 || guildID.length > 20) {
                    return message.channel.send(`:x: Merci de préciser l'id du serveur à quitter .`);
                } else {
                    const guild = client.guilds.cache.get(guildID);
                    if (guild === undefined) return message.channel.send(':x: Ce serveur n\'existe pas.');
                    if (!guild.available) return message.channel.send(':x: Guild not available, try again later.');
                    if (guildID === "857186261483257856") return message.channel.send("Ce serveur vous permet d'avoir des emojis !")
                    client.guilds.cache.get(guildID).leave()
                        .then(x => {
                            message.channel.send(`:white_check_mark: J'ai quitté ${x.name}`).catch(() => { });
                        })
                        .catch(err => {
                            console.log(`:x: [ERREUR] Voici l'erreur qui s'est produite: \n${err}`);
                            console.log(err);
                        })

                }
            } else return message.channel.send('Vous devez être propriétaire pour utiliser cette commande !')
        } catch (error) {
            webhook(error, message)
        }
    }
}