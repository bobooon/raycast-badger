import type { BadgeApplication } from './storage.ts'
import { Action, ActionPanel, Form, useNavigation } from '@raycast/api'
import { useEffect, useState } from 'react'
import { addBadge, getApps } from './storage.ts'

export function Create(props: { onSubmit: () => Promise<void> }) {
  const { pop } = useNavigation()
  const [loaded, setLoaded] = useState(false)
  const [apps, setApps] = useState<BadgeApplication[]>([])

  useEffect(() => {
    (async () => {
      setApps(await getApps())
      setLoaded(true)
    })()
  }, [])

  return (
    <Form
      isLoading={!loaded}
      navigationTitle="Create Badge"
      actions={(
        <ActionPanel>
          <Action.SubmitForm
            title="Submit"
            onSubmit={(values: { bundleId: string }) => addBadge(values.bundleId).then(props.onSubmit).then(pop)}
          />
        </ActionPanel>
      )}
    >
      <Form.Dropdown id="bundleId" title="Application">
        {apps.map(app => (
          <Form.Dropdown.Item
            key={app.bundleId}
            value={app.bundleId}
            title={app.name}
            icon={{ fileIcon: app.path }}
          />
        ))}
      </Form.Dropdown>

      <Form.Description text="Applications must be open or kept in the Dock to count badges. Additionally, Raycast must have Automation and Accessibility permissions enabled." />
    </Form>
  )
}
