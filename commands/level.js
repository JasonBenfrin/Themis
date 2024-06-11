import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js'
import { registerFont, createCanvas, loadImage } from 'canvas'
import { readFileSync } from 'fs'
import { join } from 'path'
import { sort } from '../utils/level/leaderboard.js'
import { shorten } from '../utils/numberShort.js'

registerFont('./fonts/Roboto-Medium.ttf', {family: 'Roboto'});
registerFont('./fonts/Quicksand-Bold.ttf', {family: 'Quicksand'});
registerFont('./fonts/Bungee-Regular.ttf', {family: 'Bungee'});
registerFont('./fonts/Comfortaa-Bold.ttf', {family: 'Comfortaa'});
registerFont('./fonts/Arvo-Regular.ttf', {family: 'Arvo'});

const levels = JSON.parse(readFileSync(join('utils','level','levelTotal.json')))
const nextlevel = JSON.parse(readFileSync(join('utils','level','level.json')))

function fontResize(canvas, context, text, fontSize, family, resize) {
	do{
		context.font = `${fontSize -= 10}px ${family}`
	}while(context.measureText(text).width > canvas.width - resize)
	return context.font
}

const offsetRound = 4
const offset = 40
const radius = 10

export const data = new SlashCommandBuilder()
	.setName('level')
	.setDescription('Show the current level of the user')
	.addUserOption(option => {
		return option
			.setName('user')
			.setDescription('User to check level')
			.setRequired(false)
	})
export async function execute(interaction) {
	await interaction.deferReply()
	const user = interaction.options.getUser('user') || interaction.user
	if (interaction.options.getUser('user') && interaction.options.getUser('user').bot) return interaction.followUp('There is no Level for a bot.')
	if (!(await interaction.client.redis.json.type("lvl", user.id))) return interaction.followUp('Wow! This user hasn\'t sent a single message!')

	// Background
	const canvas = createCanvas(1000, 300)
	const context = canvas.getContext('2d')
	const background = await loadImage('./images/layer.jpg')
	context.drawImage(background, 0, 0, canvas.width, canvas.height)

	// Small Rounded corners
	context.save()
	context.beginPath()

	context.moveTo(offsetRound, 0)
	context.arcTo(0, 0, 0, offsetRound, radius)
	context.lineTo(0, 0)
	context.lineTo(offsetRound, 0)

	context.moveTo(0, canvas.height - offsetRound)
	context.arcTo(0, canvas.height, offsetRound, canvas.height, radius)
	context.lineTo(0, canvas.height)
	context.lineTo(0, canvas.height - offsetRound)

	context.moveTo(canvas.width - offsetRound, canvas.height)
	context.arcTo(canvas.width, canvas.height, canvas.width, canvas.height - offsetRound, radius)
	context.lineTo(canvas.width, canvas.height)
	context.lineTo(canvas.width - offsetRound, canvas.height)

	context.moveTo(canvas.width - offsetRound, 0)
	context.arcTo(canvas.width, 0, canvas.width, offsetRound, radius)
	context.lineTo(canvas.width, 0)
	context.lineTo(canvas.width - offsetRound, 0)

	context.closePath()
	context.clip()
	context.clearRect(0, 0, canvas.width, canvas.height)
	context.restore()

	// Clip a rounded rectangle area
	context.save()
	context.beginPath()

	context.moveTo(offset + offsetRound, offset)
	context.arcTo(offset, offset, offset, offset + offsetRound, radius)
	context.arcTo(offset, canvas.height - offset, offset + offsetRound, canvas.height - offset, radius)
	context.arcTo(canvas.width - offset, canvas.height - offset, canvas.width - offset, canvas.height - offset - offsetRound, radius)
	context.arcTo(canvas.width - offset, offset, canvas.width - offset - offsetRound, offset, radius)
	context.closePath()
	context.clip()

	// Add rectangle here
	context.fillStyle = 'rgba(0,0,0,0.7)'
	context.fill()
	context.restore()

	// Add username
	const username = user.username

	context.font = fontResize(canvas, context, username, 80, 'Comfortaa', 700)
	context.fillStyle = "#ffffff"
	context.fillText(username, canvas.width / 4, canvas.height / 1.8)

	// Add user image
	context.save()
	context.beginPath()
	context.arc(150, 150, 80, 0, 2 * Math.PI)
	context.closePath()
	context.clip()
	const avatar = await loadImage(user.displayAvatarURL({ size: 512, extension: 'jpg' }))
	context.drawImage(avatar, 65, 65, 170, 170)
	context.restore()

	// Add Rank and Level
	const leaderboard = await sort(interaction.client.redis)
	for (let i = 0; i < leaderboard.length; i++) {
		if (leaderboard[i][user.id]) {
			const member = leaderboard[i][user.id]

			// Rank
			context.font = '50px Comfortaa'
			context.fillStyle = '#FACB56'
			const rank = context.measureText('#' + (i + 1)).width
			context.fillText('#' + (i + 1), canvas.width - offset - rank - 10, offset + 60)
			context.font = '30px Comfortaa'
			const rankText = context.measureText('Rank').width
			context.fillText('Rank', canvas.width - offset - rank - 15 - rankText, offset + 60)

			// Level
			context.font = '50px Comfortaa'
			context.fillStyle = '#ffffff'
			const level = context.measureText(member.level).width
			context.fillText(member.level, canvas.width - offset - rank - rankText - level - 40, offset + 60)

			context.font = '30px Comfortaa'
			const levelText = context.measureText('Level').width
			context.fillText('Level', canvas.width - offset - rank - rankText - level - levelText - 45, offset + 60)

			// Level ratio
			context.font = '30px Arvo'
			context.fillStyle = '#aaaaaa'
			const levelExp = member.exp - levels[member.level]
			const nextLevelExp = nextlevel[member.level + 1]
			const ratioText = `${shorten(levelExp)} / ${shorten(nextLevelExp)} XP`
			const lvlRatio = context.measureText(ratioText).width
			context.fillText(ratioText, canvas.width - offset - lvlRatio - 10, canvas.height / 1.8)

			// Empty Bar
			context.beginPath()
			context.arc(canvas.width / 4 + 20, canvas.height / 1.8 + 50, 20, Math.PI / 2, 3 * Math.PI / 2)
			context.lineTo(canvas.width - offset - 50, canvas.height / 1.8 + 30)
			context.arc(canvas.width - offset - 50, canvas.height / 1.8 + 50, 20, 3 * Math.PI / 2, Math.PI / 2)
			context.closePath()
			context.strokeStyle = "#000000"
			context.lineWidth = 5
			context.stroke()
			context.fillStyle = "#888888"
			context.fill()

			// Level Bar
			context.beginPath()
			context.arc(canvas.width / 4 + 20, canvas.height / 1.8 + 50, 20, Math.PI / 2, 3 * Math.PI / 2)
			let levelLength = (canvas.width - offset - 50 - (canvas.width / 4 + 20)) * levelExp / nextLevelExp
			levelLength += canvas.width / 4 + 20
			if (levelLength < canvas.width / 4 + 20) levelLength = canvas.width / 4 + 20
			context.arc(levelLength, canvas.height / 1.8 + 50, 20, 3 * Math.PI / 2, Math.PI / 2)
			context.closePath()
			context.fillStyle = "#82b2d6"
			context.fill()

			// Level Percentage
			let textLength = (canvas.width - offset - 50 - (canvas.width / 4 + 20))
			context.font = '30px Arvo'
			context.fillStyle = '#ffffff'
			context.lineWidth = 1
			const percentage = Math.round(100 * levelExp / nextLevelExp)
			textLength -= context.measureText(`${percentage}%`).width + 10
			context.fillText(`${percentage}%`, textLength, canvas.height / 1.8 + 60)

			break
		}
	}

	const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: "level.png" })
	return interaction.followUp({ files: [attachment] })
}