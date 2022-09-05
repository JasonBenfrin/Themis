const fs = require('fs');
const { Client, Collection, IntentsBitField } = require('discord.js');
const token = process.env.token
const updateCommands = require('./deploy-commands')
const Database = require("@replit/database")
const db = new Database()
const keepAlive = require('./server')

const client = new Client({ intents: new IntentsBitField(37635) });

//Commands Handler

client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

//Events Handler

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// client.on('debug',(debug) => console.log(debug))

process.on('uncaughtException', (err) => {
	console.error(err)
})

keepAlive()
module.exports = {client,updateCommands,db}
client.login(token);