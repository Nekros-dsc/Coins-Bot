const { Teams } = require("../../Database/Models/Teams");

module.exports = async (memberId, team) => {
    if (team) {
        const members = team.members ? JSON.parse(team.members) : {};

        if (members[memberId]) {
            delete members[memberId];
            await Teams.update({ members: JSON.stringify(members) }, { where: { primary: team.primary }});
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
