const { Teams } = require("../../Database/Models/Teams");

module.exports = async (team, guildId) => {

    if (team) {
        await team.destroy();
        return true;
    } else {
        return false;
    }

}