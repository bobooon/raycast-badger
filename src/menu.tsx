import type { BadgeState } from './utils/state.ts'
import { getPreferenceValues, launchCommand, LaunchType, MenuBarExtra, open, openExtensionPreferences } from '@raycast/api'
import { useCachedState } from '@raycast/utils'
import { useEffect, useState } from 'react'
import { getState } from './utils/state.ts'

export default function Menu() {
  const [loaded, setLoaded] = useState(false)
  const [badges, setBadges] = useCachedState<BadgeState[]>('menu', [])

  useEffect(() => {
    (async () => {
      setBadges(await getState())
      setLoaded(true)
    })()
  }, [setBadges])

  const preferences = getPreferenceValues<ExtensionPreferences>()
  const total = badges.reduce((total, badge) => total + badge.count, 0)

  return (
    <MenuBarExtra
      isLoading={!loaded}
      title={total ? `${total}` : ''}
      icon={{
        source: total ? 'bell-ring.svg' : 'bell.svg',
        tintColor: total ? preferences.activeColor : preferences.color,
      }}
    >
      <MenuBarExtra.Section>
        {badges.map(badge => (
          <MenuBarExtra.Item
            key={badge.app.bundleId}
            title={badge.app.name}
            subtitle={badge.count ? `${badge.count}` : ''}
            icon={{ fileIcon: badge.app.path }}
            onAction={() => open(badge.app.path)}
          />
        ))}
      </MenuBarExtra.Section>

      <MenuBarExtra.Section>
        <MenuBarExtra.Item
          title="Manage Badges"
          onAction={() => launchCommand({ name: 'manage', type: LaunchType.UserInitiated })}
        />
        <MenuBarExtra.Item
          title="Manage Extension"
          onAction={() => openExtensionPreferences()}
        />
      </MenuBarExtra.Section>
    </MenuBarExtra>
  )
}
