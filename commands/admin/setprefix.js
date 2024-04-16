
module.exports = {
    name: "prefix",
    description: "Modifie le prefix du bot",
    aliases: ['set-prefix', 'setprefix'],
    owner: true,

    run: async (client, message, args, data) => {
            if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(`:x: Vous devez être administrateur pour utiliser cette commande !`)


            if (args.length) {
                let str_content = args.join(" ")
                if(str_content.length > 4) return message.reply(":x: Le prefix ne peut pas être aussi long !")
                data.guilds.update(
                    { Prefix: str_content }, 
                    { where: { guildId: message.guild.id } }
                  );
                message.reply({ content: `:white_check_mark: Vous avez défini le préfix de ce serveur en \`${str_content}\` ` });
            } else {
                message.channel.send(`:x: Vous n'avez fournie aucune valeur, veuillez refaire la commande en incluant un prefix.`);
            }


    }
}