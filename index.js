import { readdirSync } from 'fs';
import { Client, Collection, IntentsBitField } from 'discord.js';
import dotenv from 'dotenv'
dotenv.config()
import keepAlive from './server.js';

const token = process.env.TOKEN
const client = new Client({ intents: new IntentsBitField(37635) });

//Commands Handler

client.commands = new Collection()
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

//Events Handler

const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = await import(`./events/${file}`);
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
client.login(token);