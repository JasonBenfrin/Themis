export default async function add(interaction) {
  const msg = interaction.options.getString('message')
  const redis = interaction.client.redis
  const exists = await redis.lPos("encourage", msg)
  if (exists !== null) return interaction.reply('Message already exists!')
  await redis.rPush("encourage", msg)
  const length = await redis.lLen("encourage")
  return interaction.reply(`Message added! Message added at index: ${length-1}`)
}