const { Users } = require("../../Database/Models/Users");
const getUser = require("../getUser");

module.exports = async (GuildId, guild) => {
    const topUsers = await Users.findAll({
        where: { GuildId },
        order: [['Victoires', 'DESC']], 
        limit: 10 
      });
      
      const medals = ['🥇', '🥈', '🥉', '4', '5', '6', '7', '8', '9', '10'];
      let desc = ""
      topUsers.forEach((user, index) => {
        const user2 = guild.members.cache.get(user.UserId)
        if(user2) desc += `${medals[index]}) ${user2.user.username}\n\`${user.Victoires} victoires\`\n`
      });

      return desc
}