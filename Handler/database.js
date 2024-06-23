const Database = require('better-sqlite3');
const db = new Database('./Utils/DataBase/database.db');

module.exports = () => {
    db.exec(`CREATE TABLE IF NOT EXISTS user (
        id TEXT DEFAULT NULL,
        coins TEXT DEFAULT '{ "coins": 0, "bank": 0, "rep": 0 }',
        minerais TEXT DEFAULT '{ "wagon": 0, "charbon": 0, "fer": 0, "or": 0, "diamant": 0 }',
        entrepot TEXT DEFAULT NULL,
        batiment TEXT DEFAULT '{ "count": 0, "batiments": [] }',
        antirob TEXT DEFAULT NULL,
        color TEXT DEFAULT NULL,
        metier TEXT DEFAULT NULL,
        capacite TEXT DEFAULT NULL,
        drugs TEXT DEFAULT '0',
        team TEXT DEFAULT NULL,
        mails TEXT DEFAULT '[]',
        palier TEXT DEFAULT '{ "xp": 0, "level": 1 }',
        enableVocal TEXT DEFAULT 'off',
        quete TEXT DEFAULT NULL,
        ThreeMinutes TEXT DEFAULT '0'
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS guild (
        id TEXT DEFAULT NULL,
        color TEXT DEFAULT '#F4D80B',
        gain TEXT DEFAULT '{ "dailyMin": "100", "dailyMax": "600", "cardsMin": "-400", "cardsMax": "400", "slutMin": "100", "slutMax": "600", "workMin": "10", "workMax": "250", "entrepriseMax": "16000", "entrepotMax": "7000", "bar": { "price": "2000", "gain": "100" }, "garage": { "price": "3000", "gain": "200" }, "magasin": { "price": "4000", "gain": "300" }, "cinema": { "price": "5000", "gain": "400" }, "gare": { "price": "6500", "gain": "500" }, "mairie": { "price": "8000", "gain": "600" }, "wagon": "1500", "antirob": { "time": "7200000", "price": "1000" }, "braqueur": "16", "tueur": "14", "juge": "15", "cambrioleur": "12", "hacker": "13", "policier": "12", "charbon": "100", "fer": "150", "or": "250", "diamant": "400", "team": "1000", "logo": "10", "banner": "20", "impots": "10", "cadenas": "2", "drug": "1000", "blanchisseur": "15", "cultivateur": "8", "drugsMin": "1", "drugsMax": "2", "voicegain": "0", "streamgain": "0", "camgain": "0" }',
        logs TEXT DEFAULT '{ "xp": null, "vocal": null, "impots": null, "cards": null, "war": null, "transaction": null }',
        cshop TEXT DEFAULT '[]',
        prefix TEXT DEFAULT '&',
        EnchereConfig TEXT DEFAULT '{ "channel": null, "time": null, "gain": null, "price": null }',
        blockedCommandAdmin TEXT DEFAULT '{ "add": "off", "remove": "off", "reset": "off" }',
        blacklist TEXT DEFAULT '[]',
        blockedCommand TEXT DEFAULT '[]',
        farmChannel TEXT DEFAULT '[]',
        owners TEXT DEFAULT '["820361590826205215"]',
        wl TEXT DEFAULT '[]',
        leaderboard TEXT DEFAULT '{ "channel": null, "msgId": null }', 
        time TEXT DEFAULT '{ "work": 3600, "daily": 43200, "recolt": 10800, "rob": 1620, "mine": 43200, "gift": 43200, "slut": 10800, "rep": 10800, "war": "", "braquage": 14400, "hack": 7200, "cambriolage": 36000, "juge": 28800, "kill": 18000, "arrest": 25200, "blanchisseur": 18000, "game": "", "tattack": 3600, "quete": 3600 }',
        xp TEXT DEFAULT '{ "xp": true, "vocxp": "10", "msgxp": "10" }'
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS team (
        id TEXT DEFAULT NULL,
        name TEXT DEFAULT NULL,
        cadenas TEXT DEFAULT '5', 
        coins TEXT DEFAULT '{ "coins": "0", "rep": "0" }',
        members TEXT DEFAULT '[]',
        description TEXT DEFAULT NULL,
        logo TEXT DEFAULT NULL,
        banner TEXT DEFAULT NULL,
        upgrade TEXT DEFAULT NULL,
        army TEXT DEFAULT '10',
        trainlevel TEXT DEFAULT '1',
        blesses TEXT DEFAULT '0'
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS entreprise (
        id TEXT DEFAULT NULL,
        author TEXT DEFAULT NULL,
        user TEXT DEFAULT '[]',
        salaire TEXT DEFAULT '20',
        argent TEXT DEFAULT '0',
        work TEXT DEFAULT '10',
        batiments TEXT DEFAULT '1'
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS Encheres (
        num TEXT DEFAULT NULL,
        guildId TEXT DEFAULT NULL,
        MessageId TEXT DEFAULT NULL,
        ChannelId TEXT DEFAULT NULL,
        prize TEXT DEFAULT NULL,
        author TEXT DEFAULT NULL,
        click TEXT DEFAULT NULL,
        lastenchere TEXT DEFAULT NULL,
        datestart TEXT DEFAULT NULL,
        duration TEXT DEFAULT NULL,
        encherisseur TEXT DEFAULT NULL
    )`);

    db.exec(`CREATE TABLE IF NOT EXISTS bot (
        id TEXT DEFAULT NULL,
        activity TEXT DEFAULT '{ "name": "by ruwinou CoinsBot PERSO", "type": "1" }',
        apikey TEXT DEFAULT NULL
    )`);
    return db;
}