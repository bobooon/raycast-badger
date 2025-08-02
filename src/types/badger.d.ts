import type { Application } from '@raycast/api'

declare global {
  interface BadgerStatus {
    count: number
    indeterminate: boolean
  }

  interface Badger {
    bundleId: string
    app: Application
    showInactive: boolean
    showIndeterminate: boolean
    status: BadgeStatus
  }

  interface BadgerList { [id: string]: Badge }

  interface BadgerCache {
    badges: BadgerList
    preferences: Preferences
  }
}

export {}
