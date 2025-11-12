import type { Badge } from './utils/storage.ts'
import { Action, ActionPanel, Alert, confirmAlert, Icon, List, useNavigation } from '@raycast/api'
import { useEffect, useState } from 'react'
import { Create } from './utils/create.tsx'
import { deleteBadge, getStorage } from './utils/storage.ts'

export default function Manage() {
  const { push } = useNavigation()
  const [loaded, setLoaded] = useState(false)
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    (async () => {
      setBadges(await getStorage())
      setLoaded(true)
    })()
  }, [])

  const reload = async () => setBadges(await getStorage())

  return (
    <List isLoading={!loaded}>
      {badges.map(badge => (
        <List.Item
          key={badge.app.bundleId}
          title={badge.app.name}
          icon={{ fileIcon: badge.app.path }}
          accessories={[{ text: badge.app.path }]}
          actions={(
            <ActionPanel>
              <Action
                title="Create Badge"
                icon={Icon.Plus}
                onAction={() => push(<Create onSubmit={reload} />)}
              />
              <ActionPanel.Section>
                <Action
                  title="Delete Badge"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  shortcut={{ modifiers: ['ctrl'], key: 'x' }}
                  onAction={() => confirmAlert({
                    title: badge.app.name,
                    message: 'Are you sure you want to delete this badge?',
                    primaryAction: {
                      title: 'Delete',
                      style: Alert.ActionStyle.Destructive,
                      onAction: async () => {
                        await deleteBadge(badge.app.bundleId)
                        await reload()
                      },
                    },
                  })}
                />
              </ActionPanel.Section>
            </ActionPanel>
          )}
        />
      ))}

      <List.EmptyView
        icon={Icon.BellDisabled}
        actions={(
          <ActionPanel>
            <Action
              title="Create Badge"
              icon={Icon.Plus}
              onAction={() => push(<Create onSubmit={reload} />)}
            />
          </ActionPanel>
        )}
      />
    </List>
  )
}
