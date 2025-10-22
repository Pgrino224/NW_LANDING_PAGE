import { useSearchParams } from 'react-router-dom'
import SectionNavigation from '../components/shared/SectionNavigation'
import Chrysoplos from '../components/hyperion/Chrysoplos'
import Archetypes from '../components/hyperion/Archetypes'
import TraitUpgrade from '../components/hyperion/TraitUpgrade'

export default function Hyperion() {
  const [searchParams] = useSearchParams()
  const sectionParam = searchParams.get('section')
  const initialSection = sectionParam ? parseInt(sectionParam, 10) : 0

  const sections = [
    // Section 0: Chrysoplos
    <Chrysoplos key="chrysoplos" />,

    // Section 1: Archetypes
    <Archetypes key="archetypes" />,

    // Section 2: Trait Upgrade
    <TraitUpgrade key="trait-upgrade" />
  ]

  return <SectionNavigation sections={sections} initialSection={initialSection} />
}
