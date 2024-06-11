const sad_words = ['sad','depress','bad','down','angry','unhappy','miserable','hate','disappoint','lonely','alone']

export async function detector(message) {
	if (message.author.bot) return
	/**
	 * @type {import("@redis/client").RedisClientType}
	 */
	const redis = message.client.redis
	if (await redis.sIsMember("noDisturb_on", message.author.id)) return

	for (let i = 0; i < sad_words.length; i++) {
		if (message.content.toLowerCase().includes(sad_words[i])) {
			const messages = await redis.lRange("encourage", 0, -1)
			message.reply(messages[Math.floor(Math.random() * messages.length)])
		}
	}
}