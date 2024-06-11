import { AttachmentBuilder } from 'discord.js';
import { registerFont, createCanvas, loadImage } from 'canvas';

registerFont('./fonts/Roboto-Medium.ttf', {family: 'Roboto'});
registerFont('./fonts/Quicksand-Bold.ttf', {family: 'Quicksand'});
registerFont('./fonts/Bungee-Regular.ttf', {family: 'Bungee'});
registerFont('./fonts/Comfortaa-Bold.ttf', {family: 'Comfortaa'});
registerFont('./fonts/Arvo-Regular.ttf', {family: 'Arvo'});

const offsetRound = 4
const offset = 20
const radius = 10

function fontResize(canvas, context, text, fontSize, family, resize) {
	do{
		context.font = `${fontSize -= 10}px ${family}`
	}while(context.measureText(text).width > canvas.width - resize)
	return context.font
}

export const name = "guildMemberAdd";
export async function execute(member) {
	if (member.guild.id != '880856257991409704') return;
	if (member.user.bot) return;

	// Background
	const canvas = createCanvas(700, 300);
	const context = canvas.getContext('2d');
	const background = await loadImage('./images/mount_wallpaper.jpg');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Small Rounded corners
	context.save();
	context.beginPath();

	context.moveTo(offsetRound, 0);
	context.arcTo(0, 0, 0, offsetRound, radius);
	context.lineTo(0, 0);
	context.lineTo(offsetRound, 0);

	context.moveTo(0, canvas.height - offsetRound);
	context.arcTo(0, canvas.height, offsetRound, canvas.height, radius);
	context.lineTo(0, canvas.height);
	context.lineTo(0, canvas.height - offsetRound);

	context.moveTo(canvas.width - offsetRound, canvas.height);
	context.arcTo(canvas.width, canvas.height, canvas.width, canvas.height - offsetRound, radius);
	context.lineTo(canvas.width, canvas.height);
	context.lineTo(canvas.width - offsetRound, canvas.height);

	context.moveTo(canvas.width - offsetRound, 0);
	context.arcTo(canvas.width, 0, canvas.width, offsetRound, radius);
	context.lineTo(canvas.width, 0);
	context.lineTo(canvas.width - offsetRound, 0);

	context.closePath();
	context.clip();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.restore();

	// Clip a rounded rectangle area
	context.save();
	context.beginPath();

	context.moveTo(offset + offsetRound, offset);
	context.arcTo(offset, offset, offset, offset + offsetRound, radius);
	context.lineTo(offset, canvas.height - offset - offsetRound);
	context.arcTo(offset, canvas.height - offset, offset + offsetRound, canvas.height - offset, radius);
	context.lineTo(canvas.width - offset - offsetRound, canvas.height - offset);
	context.arcTo(canvas.width - offset, canvas.height - offset, canvas.width - offset, canvas.height - offset - offsetRound, radius);
	context.lineTo(canvas.width - offset, offset + offsetRound);
	context.arcTo(canvas.width - offset, offset, canvas.width - offset - offsetRound, offset, radius);
	context.closePath();
	context.clip();

	// Add rectangle here
	context.fillStyle = 'rgba(0,0,0,0.7)';
	context.fill();
	context.restore();

	// Add user profile
	context.save();
	context.beginPath();
	context.arc(canvas.width / 2, canvas.height / 2 - 30, 80, 0, Math.PI * 2);
	context.closePath();
	context.clip();
	const avatar = await loadImage(member.user.displayAvatarURL({ size: 600, format: 'jpg' }));
	context.drawImage(avatar, 270, 40, 160, 160);
	context.restore();

	// Add welcome message
	context.fillStyle = "#ffffff";
	const textContent = `Welcome to the server ${member.user.tag}!`;
	context.font = fontResize(canvas, context, textContent, 80, 'Arvo', 60);
	const text = context.measureText(textContent).width;
	context.fillText(textContent, (canvas.width - text) / 2, canvas.height / 2 + 80);

	// Add member number
	let count = member.guild.members.cache.filter(member => !member.user.bot).size;
	switch (count) {
		case 1:
			count += 'st';
			break;
		case 2:
			count += 'nd';
			break;
		case 3:
			count += 'rd';
			break;
		default:
			count += 'th';
	}
	const countMessage = `You are the ${count} member!`;
	context.font = fontResize(canvas, context, countMessage, 80, 'Arvo', 350);
	context.fillStyle = '#aaaaaa';
	const countLength = context.measureText(countMessage).width;
	context.fillText(countMessage, (canvas.width - countLength) / 2, canvas.height / 2 + 110);

	const attachment = new AttachmentBuilder(canvas.toBuffer(), "new-member.png");
	member.client.channels.cache.get('880856257991409707').send({ content: `Welcome <@${member.id}>!`, files: [attachment] });
}