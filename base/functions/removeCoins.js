const { Users } = require("../Database/Models/Users");
const getUser = require("./getUser");

module.exports = async (UserId, GuildId, value, type) => {
    try {
        if(isNaN(value)) return false
        let user = await Users.findOne({ where: { UserId, GuildId } });
        if (!user) {
            user = await getUser(UserId, GuildId)
        }
        value = parseInt(value)
        if (type == "bank") {
            const updatedCoins = parseInt(user.Bank) - value;
            user.Bank = updatedCoins;
        } else if (type == "rep") {
            const updatedCoins = parseInt(user.Rep) - value;
            user.Rep = updatedCoins;
        } else {
            const updatedCoins = parseInt(user.Coins) - value;
            user.Coins = updatedCoins;
        }

       return await user.save();
    } catch (error) {
        console.error('Erreur lors du retrait de la valeur aux Coins de l\'utilisateur:', error);
        throw error;
    }
};

