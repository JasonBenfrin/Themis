import { ActionRowBuilder, AttachmentBuilder, ComponentType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export default async function detail(interaction) {
  await interaction.deferReply()
  const browser = await interaction.client.getBrowser()
  const page = await browser.newPage()
  await page.goto("https://aternos.org/servers")
  await page.waitForSelector(".servercard")
  const servers = await page.$$('.servercard')
  const serverDetails = {}
  const options = []
  for (let server of servers) {
    const classes = Object.values(await server.evaluate(e => e.classList))
    const name = (await server.evaluate(e => e.querySelector(".server-name").textContent)).trim()
    const id = (await server.evaluate(e => e.querySelector(".server-id").textContent)).trim().replace("#", '')
    const software = (await server.evaluate(e => e.querySelector(".server-software-name").textContent)).trim()
    let emoji
    serverDetails[id] = {}
    const serverDetail = serverDetails[id]
    serverDetail.name = name
    serverDetail.software = software
    if (classes.includes("offline")) {
      emoji = "<:offline:1249907219890176080>"
      serverDetail.status = "offline"
    } else if (classes.includes("online")) {
      emoji = "<:online:1249907221287141466>"
      serverDetail.status = "online"
    } else {
      emoji = "<:loading:1249908380781252769>"
      serverDetail.status = "loading"
    }
    serverDetail.statusEmoji = emoji
    options.push(
      new StringSelectMenuOptionBuilder()
        .setLabel(name)
        .setDescription(software)
        .setValue(id)
        .setEmoji(emoji)
    )
  }
  const row = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('server')
        .setPlaceholder('Choose a server')
        .addOptions(...options)
        .setMinValues(1)
        .setMaxValues(1)
    )
  const message = await interaction.followUp({content: "Select a server for details", components: [row]})

  const filter = i => {
		i.deferUpdate()
		if (i.user.id != interaction.user.id) {
			i.followUp({ content: 'This button is not for you!', ephemeral: true })
			return false
		}
		return true
	}

  const collector = message.createMessageComponentCollector({
    filter,
    componentType: ComponentType.StringSelect,
    time: 600_000
  })

  collector.on("collect", async i => {
    const id = i.values[0]
    await page.click(`.servercard[data-id="${id}"]`)
    await page.waitForSelector("#start")
    const ip = await page.evaluate('document.querySelector("#ip").textContent')
    const status = await page.evaluate('document.querySelector(".statuslabel-label").textContent.trim()')
    const players = await page.evaluate('document.querySelector(".statusplayerbadge").textContent')
    await page.goto("https://aternos.org/options/")
    await page.waitForSelector(".motd")
    const motd = await page.evaluate('document.querySelector(".motd").textContent.trim().replace(/§./g, "")')
    
    const serverDetail = serverDetails[id]
    
    let description = `🌐 ${ip}\n\n<:setting:1250080436479201380> ${serverDetail.software}\n\n${serverDetail.statusEmoji} ${status}\n\n📝 ${motd}`
    if (players) description += `\n\n👥 ${players}`
              
    const embed = new EmbedBuilder()
      .setTitle(serverDetail.name)
      .setDescription(description)

    if (serverDetail.status == "offline") {
      embed.setColor("#F62451")
    } else if (serverDetail.status == "online") {
      embed.setColor("#1fd78d")
    } else {
      embed.setColor("#A4A4A4")
    }

    message.edit({embeds: [embed], components:[]})
    collector.stop("end")
  })

  collector.on('end', async (c, reason) => {
    if (reason == 'time') {
      message.edit({content: "Interaction expired", components:[]})
    }
    await page.close()
    browser.close()
  })
}