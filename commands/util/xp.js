const Discord = require('discord.js');
const Canvas = require('canvas');
const getUser = require('../../base/functions/getUser');
module.exports = {
    name: "xp",
    description: "Affiche votre avancée dans les paliers",
    aliases: ['level', 'palier', 'niveau', 'rank'],

    run: async (client, message, args, data) => {
        let member = message.mentions.members.first() || message.member;
        if (!member || member.user.bot) return message.reply(":x: `ERROR:`: Pas de membre trouvé !")
        let userDB = await getUser(member.id, message.guild.id)
        let actualpalier = parseInt(userDB.level)
        let xp = parseInt(userDB.XP)
        let xpneed = actualpalier * 1000 - xp


        const canvas = Canvas.createCanvas(1000, 100);
        const ctx = canvas.getContext('2d');

        let k = xp / actualpalier
        const background = await Canvas.loadImage('https://www.slate.fr/sites/default/files/styles/1200x680/public/bl.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#161b28";
        ctx.fillRect(0, 0, k, 300);
        ctx.bac
        ctx.font = "bold 48px Serif";

        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${actualpalier}`, 70, 70);
        ctx.fillText(`${actualpalier + 1}`, 900, 70);
        ctx.beginPath();
        const attachment = new Discord.MessageAttachment(
            canvas.toBuffer(),
            "xp.png",
        )

        let embed = new Discord.EmbedBuilder()
            .setColor(data.color)
            .setTitle(`Palier de ` + member.user.username + `:`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setDescription(member.user.username + ` est palier **` + actualpalier + `** avec **${xp}xp**. 
Il te manque ${xpneed}xp pour atteindre le palier ${actualpalier + 1} et gagner \`${actualpalier * 1000} coins\` !`)
            .setImage('attachment://xp.png')
        message.reply({ embeds: [embed], files: [attachment] })
    }

}