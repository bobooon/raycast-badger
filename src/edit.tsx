import BadgeForm from './components/form.tsx'

export default function Edit(props: { badge: Badger }) {
  return <BadgeForm badge={props.badge} />
}
