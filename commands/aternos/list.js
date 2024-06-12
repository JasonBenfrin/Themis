import { EmbedBuilder } from "discord.js"

export default async function list(interaction) {
  await interaction.deferReply()

  const embed = new EmbedBuilder()
    .setTitle("Server List")
    .setColor("#2b87d3")
  const browser = await interaction.client.getBrowser()
  const page = await browser.newPage()
  await page.goto("https://aternos.org/servers")
  await page.waitForSelector(".servercard")
  const servers = await page.$$('.servercard')
  let description = ""
  for (let server of servers) {
    const classes = Object.values(await server.evaluate(e => e.classList))
    const name = (await server.evaluate(e => e.querySelector(".server-name").textContent)).trim()
    const software = (await server.evaluate(e => e.querySelector(".server-software-name").textContent)).trim()
    let emoji
    if (classes.includes("offline")) {
      emoji = "<:offline:1249907219890176080>"
    } else if (classes.includes("online")) {
      emoji = "<:online:1249907221287141466>"
    } else {
      emoji = "<:loading:1249908380781252769>"
    }
    description += `${emoji} **${name}**\n<:setting:1250080436479201380> **${software}**\n\n`
  }
  embed.setDescription(description)
  interaction.followUp({embeds: [embed]})
  page.close()
}