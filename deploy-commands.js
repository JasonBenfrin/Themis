const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const token = process.env['token']
const clientId = process.env['clientId']

const updateCommands = function (){
  const commands = [];
	const privateCommands = [];
	let guildId;
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if(!command.guild) {
			commands.push(command.data.toJSON())
		}else{
			privateCommands.push(command.data.toJSON())
			guildId = command.guild
		}
  }

  const rest = new REST({ version: '9' }).setToken(token);

  rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: privateCommands })
    .then(() => console.log('Successfully registered private application commands.'))
    .catch(console.error);
}

module.exports = updateCommands;