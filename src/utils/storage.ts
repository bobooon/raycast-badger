import type { Application } from '@raycast/api'
import { getApplications, LocalStorage } from '@raycast/api'

export interface BadgeApplication extends Application {
  bundleId: string
}

export interface Badge {
  app: BadgeApplication
}

const locale = Intl.DateTimeFormat().resolvedOptions().locale

export async function getApps() {
  return (await getApplications())
    .filter((app): app is BadgeApplication => typeof app.bundleId === 'string')
    .sort((a, b) => a.name.localeCompare(b.name, locale, { sensitivity: 'base' }))
}

export async function getStorage() {
  const apps = await getApps()
  const bundleIds = new Set(apps.map(app => app.bundleId))

  try {
    return (JSON.parse((await LocalStorage.getItem('badges')) || '[]') as Badge[])
      .filter(badge => bundleIds.has(badge.app.bundleId))
  }
  catch {
    return []
  }
}

async function setStorage(badges: Badge[]) {
  await LocalStorage.setItem('badges', JSON.stringify(
    badges.sort((a, b) => a.app.name.localeCompare(b.app.name, locale, { sensitivity: 'base' })),
  ))
}

export async function addBadge(bundleId: string) {
  const app = (await getApps()).find(app => app.bundleId === bundleId)
  const badges = await getStorage()

  if (!app || badges.some(badge => badge.app.bundleId === bundleId))
    return

  badges.push({ app })
  await setStorage(badges)
}

export async function deleteBadge(bundleId: string) {
  await setStorage((await getStorage()).filter(badge => badge.app.bundleId !== bundleId))
}
