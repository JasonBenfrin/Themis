import { detector as sadword } from '../sadword.js'
import { detect as level } from '../utils/level/detect.js'
import { execute as ping } from '../commands/help.js'

export const name = 'messageCreate'
export function execute(message) {
  if (message.mentions.has(message.client.user, { ignoreRoles: true, ignoreEveryone: true })) ping(message)
  sadword(message)
  level(message)
}