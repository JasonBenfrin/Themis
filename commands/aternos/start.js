import { ActionRowBuilder, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"

export default async function start(interaction) {
  await interaction.deferReply()
  const browser = await interaction.client.getBrowser()
  const page = await browser.newPage()
  await page.goto("https://aternos.org/servers")
  await page.waitForSelector(".servercard")
  const servers = await page.$$('.servercard')
  const options = []
  const serverStatus = {}
  for (let server of servers) {
    const classes = Object.values(await server.evaluate(e => e.classList))
    const name = (await server.evaluate(e => e.querySelector(".server-name").textContent)).trim()
    const id = (await server.evaluate(e => e.querySelector(".server-id").textContent)).trim().replace("#", '')
    const software = (await server.evaluate(e => e.querySelector(".server-software-name").textContent)).trim()
    let emoji
    if (classes.includes("offline")) {
      emoji = "<:offline:1249907219890176080>"
      serverStatus[id] = "offline"
    } else if (classes.includes("online")) {
      emoji = "<:online:1249907221287141466>"
      serverStatus[id] = "online"
    } else {
      emoji = "<:loading:1249908380781252769>"
      serverStatus[id] = "loading"
    }
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
  const message = await interaction.followUp({content: "Select a server to start", components: [row]})

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
    if (serverStatus[id] == "loading") {
      return message.edit({content: "Server is loading, please wait"})
    } else if (serverStatus[id] == "online") {
      return message.edit({content: "Server is already online"})
    }
    await page.click(`.servercard[data-id="${id}"]`)
    await page.waitForSelector("#start")
    const ip = await page.evaluate('Object.values(document.querySelector(".server-ip").childNodes).filter(e => e.nodeType === 3).reduce((prev, curr) => prev + curr.textContent, "").trim()')
    await page.click("#start")
    await page.waitForTimeout(1000)
    setTimeout(() => {
      message.edit({content: `Started ${ip}`, components:[]})
      collector.stop("end")
    }, 3000);
  })

  collector.on('end', async (c, reason) => {
    if (reason == 'time') {
      message.edit({content: "Interaction expired", components:[]})
    }
    await page.close()
    browser.close()
  })
}