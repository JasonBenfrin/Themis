const Database = require('@replit/database')
const db = new Database()

module.exports = {
	async sort() {
		const users = await db.get('lvl')
		let leaderboard = []
		let largestExp = 0;
		for (const [id, user] of Object.entries(users)) {
			if (user.exp > largestExp) largestExp = user.exp
		}
		for (let i = largestExp; i >= 0; i--) {
			for (const [id, user] of Object.entries(users)) {
				if (i == user.exp) leaderboard.push({[id]: user})
			}
		}
		return leaderboard
	}
}