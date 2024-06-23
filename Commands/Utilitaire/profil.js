const Discord = require('discord.js');
var items = require("../../Utils/function/shop.json");
const { parseHuman, parseMS } = require("human-ms");

exports.help = {
  name: 'profil',
  aliases: ['profile' , 'inv' , 'inventaire'],
  description: 'Affiche les informations d\'un utilisateur',
  use: 'Pas d\'utilisation conseillée',
  category: 'Utilitaire'
}
exports.run = async (bot, message, args, config, data) => {
    let member = message.mentions.members.first() || message.member;

    let memberDB = bot.functions.checkUser(bot, message, args, member.id)
    if(!memberDB) return
    let bats = JSON.parse(memberDB.batiment).batiments

    let batarray = []
    for (i in items.bat) {
        batarray.push(`**${i}:** ${bats.includes(i) ? "Possédé" : "Non Possédé"}`)
    }
    let timetime = memberDB.antirob > Date.now() ? `dans ${parseMS(Math.floor(memberDB.antirob - Date.now())).replace('and', 'et').replace('hours', 'heures')}}` : 'Inactif'

    let couleur = data.color.replace("#","")
    if (couleur === "0017FC") couleur = "Bleue"
    if (couleur === "FF0000") couleur = "Rouge"
    if (couleur === "1BFF00") couleur = "Vert"
    if (couleur === "36393F") couleur = "Invisible"
    if (couleur === "FDFEFE") couleur = "Blanc"
    if (couleur === "000000") couleur = "Noir"
    if (couleur === "FBFF00") couleur = "Jaune"
    if (couleur === "F4D80B") couleur = "Classique (jaune)"

    let job = memberDB.metier || "Aucun"

    let authorteam = bot.functions.checkUserTeam(bot, message, args, member.id)
    let teaminf = "Aucune"
    if(authorteam){
      teaminf = `**${authorteam.name}** (${authorteam.id}) \`${JSON.parse(authorteam.coins).coins} coins\``
    }

    let maxentrepot = JSON.parse(data.gain).entrepotMax
    let total = JSON.parse(memberDB.batiment).count
    if (!total) total = 0

    const moneyEmbed = new Discord.EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${batarray.map(i => i.replace(i[2], i[2].toUpperCase())).join("\n")}\n**Entrepôt:** \`${total}/${maxentrepot} coins\`\n\n**Anti-rob:** ${timetime || "Inactif"}\n**Métier**: ${job}\n**Couleur des embed:** ${couleur}\n**Team:** ${teaminf}\n**Entreprise:** ${memberDB.entrepot || "Aucun"}`)
      .setColor(data.color)
    message.channel.send({ embeds: [moneyEmbed] })
}