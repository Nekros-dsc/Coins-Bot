const Discord = require("discord.js");
const getUser = require("../../base/functions/getUser");
const setCooldown = require("../../base/functions/setCooldown");
const userTeam = require("../../base/functions/teams/userTeam");

module.exports = {
  name: "profil",
  description: "Affiche les informations d'un utilisateur",
  aliases: ["profile", "inv", "inventaire"],
  cooldown: 2,

  run: async (client, message, args, data) => {

    let member = message.mentions.members.first() || message.member;

    var items = require("../../shop.json")
    let memberDB = await getUser(member.id, message.guild.id)
    if(!memberDB) return
    let bats = memberDB.Batiments || {}

    if (typeof bats === 'string') {
        bats = JSON.parse(bats);
        await data.users.update({ Batiments: bats }, { where: { primary: memberDB.primary } });
    }
    let batarray = []
    for (i in items.bat) {
      batarray.push(`**${i}:** ${bats[i] ? "Possédé" : "Non Possédé"}`)
    }
    let antirobduration = (data.guild.Cooldowns)["antirob"] || 7200000
    let timetime = await setCooldown(message, data.color, member.id, message.guild.id, "antirob", antirobduration, true, true)
    if (!timetime[0] && timetime !== true && timetime.length) {
      timetime = timetime[1]
    } else { timetime = "Inactif"}
    let couleur = data.color.replace("#","")
    if (couleur === "0017FC") couleur = "Bleue"
    if (couleur === "FF0000") couleur = "Rouge"
    if (couleur === "1BFF00") couleur = "Vert"
    if (couleur === "36393F") couleur = "Invisible"
    if (couleur === "FDFEFE") couleur = "Blanc"
    if (couleur === "000000") couleur = "Noir"
    if (couleur === "FBFF00") couleur = "Jaune"
    if (couleur === "F4D80B") couleur = "Classique (jaune)"

    let job = memberDB.Metier || "Aucun"

    let authorteam = await userTeam(member.id, message.guild.id)
    let teaminf = "Aucune"
    if(authorteam){
      teaminf = `**${authorteam.name}** (${authorteam.teamid}) \`${authorteam.coins} coins\``
    }

    let maxentrepot = (data.guild.Max)["entrepot"] || 5000
    let total = memberDB.Entrepot
    if (!total) total = 0
    if (parseInt(total) > parseInt(maxentrepot)) {
      memberDB.update({ Entrepot: maxentrepot }, { where: { primary: memberDB.primary }});
      total = maxentrepot
    }

    const moneyEmbed = new Discord.EmbedBuilder()
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`${batarray.map(i => i.replace(i[2], i[2].toUpperCase())).join("\n")}\n**Entrepôt:** \`${total}/${maxentrepot} coins\`\n\n**Anti-rob:** ${timetime || "Inactif"}\n**Métier**: ${job}\n**Couleur des embed:** ${couleur}\n**Team:** ${teaminf}`)
      .setColor(data.color)
    message.channel.send({ embeds: [moneyEmbed] })


  }
}