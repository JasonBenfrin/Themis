import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
const token = process.env.DISCORD_TOKEN

export function updateCommands(client) {
  const publicCommands = [];
	const privateCommands = new Map();

	client.commands.forEach(command => {
		if(!command.guild){
			publicCommands.push(command.data.toJSON())
		}else{
			command.guild.forEach(guild => {
				const previous = privateCommands.get(guild) || []
				previous.push(command.data.toJSON())
				privateCommands.set(guild, previous)
			})
		}
	})
  const rest = new REST({ version: '9' }).setToken(token)

  rest.put(Routes.applicationCommands(client.user.id), { body: publicCommands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

	privateCommands.forEach( (commands, guildId) => {
		rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commands })
	    .then(() => console.log(`Successfully registered private application commands on guild ${guildId}.`))
	    .catch(console.error);
	})	
}