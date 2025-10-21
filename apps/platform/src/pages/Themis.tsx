import SectionNavigation from '../components/shared/SectionNavigation'
import ThemisHome from '../components/themis/ThemisHome'
import ThemisProfileSection from '../components/themis/ThemisProfileSection'

export default function Themis() {
  const sections = [
    <ThemisHome key="home" />,
    <ThemisProfileSection key="profile" />
  ]

  return <SectionNavigation sections={sections} />
}
