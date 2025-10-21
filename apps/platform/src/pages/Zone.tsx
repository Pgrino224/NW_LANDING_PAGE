import SectionNavigation from '../components/shared/SectionNavigation'
import Skynet from '../components/zone/Skynet'
import Trinet from '../components/zone/Trinet'
import Valnet from '../components/zone/Valnet'

export default function Zone() {
  const sections = [
    <Skynet key="skynet" />,
    <Trinet key="trinet" />,
    <Valnet key="valnet" />
  ]

  return <SectionNavigation sections={sections} />
}
