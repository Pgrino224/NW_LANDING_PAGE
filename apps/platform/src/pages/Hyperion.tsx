import SectionNavigation from '../components/shared/SectionNavigation'
import Chrysoplos from '../components/hyperion/Chrysoplos'
import Archetypes from '../components/hyperion/Archetypes'
import TraitUpgrade from '../components/hyperion/TraitUpgrade'

export default function Hyperion() {
  const sections = [
    // Section 1: Chrysoplos
    <Chrysoplos key="chrysoplos" />,

    // Section 2: Archetypes
    <Archetypes key="archetypes" />,

    // Section 3: Trait Upgrade
    <TraitUpgrade key="trait-upgrade" />
  ]

  return <SectionNavigation sections={sections} />
}
