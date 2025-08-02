import type { Application } from '@raycast/api'
import { Action, ActionPanel, Form, getApplications, useNavigation } from '@raycast/api'
import { showFailureToast } from '@raycast/utils'
import { useEffect, useState } from 'react'
import storage from '../utils/storage.ts'

export default function BadgeForm(props: { badge?: Badger }) {
  const { badge } = props
  const { pop } = useNavigation()
  const [apps, setApps] = useState<Application[]>([])

  useEffect(() => {
    (async () => setApps(await getApplications()))()
  }, [])

  const onSubmit = async (values: Badger) => {
    try {
      if (badge)
        values.bundleId = badge.bundleId
      storage.saveBadge(values).then(pop)
    }
    catch (error) {
      await showFailureToast((error as Error).message)
    }
  }

  return (
    <Form
      isLoading={!apps.length}
      navigationTitle={!badge ? 'Add Badge' : 'Edit Badge'}
      actions={(
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={onSubmit} />
        </ActionPanel>
      )}
    >
      {badge && <Form.Description text={badge.app.name} />}

      {!badge && (
        <Form.Dropdown
          id="bundleId"
          info="Choose the application to monitor for badges. Keep in mind that not all applications utilize badges for notifications."
        >
          {apps.map(app => (
            <Form.Dropdown.Item
              key={app.bundleId || app.name}
              value={app.bundleId || app.name}
              title={app.name}
              icon={{ fileIcon: app.path }}
            />
          ))}
        </Form.Dropdown>
      )}

      <Form.Checkbox
        id="showInactive"
        label="Show badges when this application is closed"
        info="When the application is closed and kept in the Dock, the badges will continue to appear in the menu bar."
        defaultValue={(!badge && true) || badge.showInactive}
      />
      <Form.Checkbox
        id="showIndeterminate"
        label="Show indeterminate badges"
        info="An indeterminate badge is displayed in the Dock as a dot without a count. When enabled, the badge count increases by one."
        defaultValue={(!badge && true) || badge.showIndeterminate}
      />

      <Form.Description text="" />
      <Form.Separator />
      <Form.Description text="" />

      <Form.Description text="Applications must be open or kept in the Dock for badge counts to appear in the menu bar. Additionally, Raycast requires the Automation and Accessibility permissions in order to read the Dock badges." />
    </Form>
  )
}
