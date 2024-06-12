import puppeteer from 'puppeteer-extra'
import stealth from 'puppeteer-extra-plugin-stealth'
import adblocker from 'puppeteer-extra-plugin-adblocker'
import { updateCommands } from '../deploy-commands.js'
import { createClient } from "redis"

export const name = 'ready'
export const once = true
export async function execute(client) {
	updateCommands(client)

	const redis = await createClient({
		password: process.env.REDIS_TOKEN,
		socket: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT
		}
	}).connect()
	client.redis = redis

	const defaultMsgs = ['Everything will be fine.', 'Don\'t be sad, everything will be fine.', 'You are a great person so don\'t feel like that.', 'Cheer up mate!', 'It can be tough sometimes but you have to endure.', 'Come talk to me. You\'ll be happy again!']

	const encourageList = await redis.lRange("encourage", 0, -1)
	if (encourageList.length < 1) await redis.lPush("encourage", defaultMsgs)

	client.spamDetect = new Map()
	client.wordle = new Map()

	puppeteer.use(stealth())
	puppeteer.use(adblocker({
		blockTrackers: true
	}))

	client.getBrowser = async function () {
		if (this.browser !== undefined && (await this.browser.pages()).length > 0) return this.browser
		this.browser = await puppeteer.launch({
			headless: false
		})
		const page = await this.browser.newPage()
		await page.goto("https://aternos.org/go")
		await page.type('input.username', process.env.ATERNOS_USERNAME)
		await page.type('input.password', process.env.ATERNOS_PASSWORD)
		await page.click('button.login-button')
		await page.waitForSelector(".servercard")
		await page.close()
		return this.browser
	}

	client.user.setActivity('/help', { type: 'PLAYING' })
	console.log(`Logged in with ${client.user.tag} on ${client.guilds.cache.size} servers`)
} 