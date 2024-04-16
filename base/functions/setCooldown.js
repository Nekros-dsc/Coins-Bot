const { EmbedBuilder } = require("discord.js");
const { msToTime } = require("../functions");
const getUser = require("./getUser");
const { Guilds } = require("../Database/Models/Guilds");
const { Users } = require("../Database/Models/Users");

module.exports = async (message, color, UserId, GuildId, commandName, cooldownTime = 0, EditValue = false, ResponseOrNot = false, forceUpdate = false) => {
    let user = await getUser(UserId, GuildId);
    let guild = await Guilds.findOne({ where: { guildId: GuildId } });
    if (!guild) return false
    let cooldowns = guild.Cooldowns || {}
    let userCooldown = user.Cooldown || {};
    if (typeof userCooldown === 'string') {
        userCooldown = JSON.parse(userCooldown);
      }
      if (typeof cooldowns === 'string') {
        cooldowns = JSON.parse(cooldowns);
      }
    if (userCooldown[commandName]) {
        if (cooldowns[commandName]) cooldownTime = cooldowns[commandName]
        const lastUsage = new Date(userCooldown[commandName]);
        const now = new Date();
        const elapsedTime = Math.floor(now - lastUsage);
        if (elapsedTime < cooldownTime) {
            if (forceUpdate) {
                userCooldown[commandName] = Date.now();
                await Users.update({ Cooldown: userCooldown }, { where: { primary: user.primary } });
            }
            const remainingTime = cooldownTime - elapsedTime;
            let timeEmbed = new EmbedBuilder()
                .setColor(color)
                .setDescription(`:x: Vous avez déjà \`${commandName}\` récemment\n\nRéessayez dans ${msToTime(remainingTime)} `)
                .setFooter({ text: `${message.member.user.username}`, iconURL: message.member.user.displayAvatarURL({ dynamic: true }) })
            if (!ResponseOrNot) {
                message.reply({ embeds: [timeEmbed], allowedMentions: { repliedUser: false } })
                return false
            } else return [false, msToTime(remainingTime)]
        }

    }

    if (!EditValue) userCooldown[commandName] = Date.now();
    return await Users.update({ Cooldown: userCooldown }, { where: { primary: user.primary } });
     
};
