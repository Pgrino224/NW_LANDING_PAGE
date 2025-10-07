import SectionNavigation from '../components/shared/SectionNavigation'
import ThemisHome from '../components/themis/ThemisHome'

export default function Themis() {
  const sections = [
    <ThemisHome key="home" />,

    <div key="section2" style={{
      minHeight: '100vh',
      background: '#2a2a2a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }}>
      <h1 className="font-geist">Themis - Section 2</h1>
    </div>,

    <div key="section3" style={{
      minHeight: '100vh',
      background: '#3a3a3a',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white'
    }}>
      <h1 className="font-geist">Themis - Section 3</h1>
    </div>
  ]

  return <SectionNavigation sections={sections} />
}
