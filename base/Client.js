const Discord = require('discord.js');
const fs = require('fs');
const { Bots } = require('./Database/Models/Bots');
const { Guilds } = require('./Database/Models/Guilds');
const Queue = require('./structure/Queue');
module.exports = class client extends Discord.Client {
    constructor (config) {
		super({
            intents: 3276799
        })
        this.commands = new Discord.Collection()
        this.aliases = new Discord.Collection()
        this.cooldowns = new Discord.Collection()
        this.config = config
        this.shop = require('../shop.json')
        this.db = {Bots, Guilds}
        this.globalCooldowns = new Map()
        this.initCommands()
        this.initEvents()
        this.initHandler()
        this.queue = new Queue();
    }
    initCommands() {
        const subFolders = fs.readdirSync('./commands')
        for (const category of subFolders) {
            const commandsFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'))
            for (const commandFile of commandsFiles) {
                const command = require(`../commands/${category}/${commandFile}`)
                this.commands.set(command.name, command)
                if (command.aliases && command.aliases.length > 0) {
                    command.aliases.forEach(alias => this.aliases.set(alias, command))
                }
            }
        }
    }
    initEvents(){
        const events = fs.readdirSync(`./events`).filter(file => file.endsWith('.js'))
            for(const ev of events){
                const event = require(`../events/${ev}`)
                if(!event) return
                this.on(event.name, (...args) => event.run(this, ...args))
        }
    }
    initHandler(){
        const handlers = fs.readdirSync(`./base/structure`).filter(file => file.endsWith('.js'))
            for(const ev of handlers){
                const handler = require(`../base/structure/${ev}`)
                if(!handler) return
                this.on(handler.name, (...args) => handler.run(this, ...args))
        }

        
    }
}