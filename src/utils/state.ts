import type { Badge } from './storage.ts'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { environment } from '@raycast/api'
import { runAppleScript } from '@raycast/utils'
import { getStorage } from './storage.ts'

export interface BadgeState extends Badge {
  count: number
}

let script: string | undefined

async function getCount(appName: string) {
  if (script === undefined)
    script = (await fs.readFile(path.join(environment.assetsPath, 'count.applescript'))).toString()

  const result = await runAppleScript(script, [appName])
  if (result === '•')
    return 1

  const count = Number.parseInt(result, 10)
  return Number.isNaN(count) ? 0 : count
}

export async function getState() {
  const badges = await Promise.all(
    (await getStorage()).map(async (badge) => {
      try {
        return { ...badge, count: await getCount(badge.app.name) } as BadgeState
      }
      catch (error) {
        if (error instanceof Error && /-(?:1743|1719)/.test(error.message)) {
          throw Object.assign(
            new Error('Raycast must have Accessibility and Automation permissions enabled.'),
            { stack: undefined },
          )
        }
      }
    }),
  )

  return badges.filter(badge => typeof badge !== 'undefined')
}
