const { Teams } = require("../../Database/Models/Teams");
const { Op } = require('sequelize');

module.exports = async (memberId, guildId, id = false) => {
    let teams
    if (!memberId) {
        teams = await Teams.findAll({
            where: {
                name: {
                    [Op.like]: `%${id}%`
                },
                guildId: guildId
            }
        });
        
        if(!teams || teams.length < 1){
            teams = await Teams.findAll({
                where: {
                    teamid: {
                        [Op.like]: `%${id}%`
                    },
                    guildId: guildId
                }
            });
        }
    } else {
        teams = await Teams.findAll({
            where: {
                guildId: guildId,
                members: {
                    [Op.like]: `%${memberId}%`
                }
            }
        });
    }
    if (teams.length > 0) {
        return teams[0];
    } else {
        return false;
    }
};
