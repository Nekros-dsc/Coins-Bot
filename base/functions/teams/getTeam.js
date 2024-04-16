const { Teams } = require("../../Database/Models/Teams");
const { removeNonLetters } = require("../../functions");

module.exports = async (name, desc = "Aucune description", guildId, create = true) => {
    let teamid = removeNonLetters(name)
    let user = await Teams.findOne({ where: { teamid: teamid, guildId: guildId } });
    if (!user) {
        if (create == false) return false
        return await Teams.create({
            guildId: guildId,
            teamid: teamid,
            name: name,
            desc: desc
        });
    } else {
        return user
    }
}