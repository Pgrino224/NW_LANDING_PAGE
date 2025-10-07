import { useState } from 'react'
import MessagesPanel from './MessagesPanel'
import MinervaPanel from './MinervaPanel'

type ActivePanel = 'messages' | 'minerva' | null

const MESSAGES_COLLAPSED_HEIGHT = 48
const MESSAGES_EXPANDED_HEIGHT = 500

export default function FloatingPanels() {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)

  const handleMessagesToggle = () => {
    setActivePanel(prev => prev === 'messages' ? null : 'messages')
  }

  const handleMinervaToggle = () => {
    setActivePanel(prev => prev === 'minerva' ? null : 'minerva')
  }

  const messagesHeight = activePanel === 'messages' ? MESSAGES_EXPANDED_HEIGHT : MESSAGES_COLLAPSED_HEIGHT

  return (
    <>
      <MessagesPanel
        isOpen={activePanel === 'messages'}
        onToggle={handleMessagesToggle}
      />
      <MinervaPanel
        isOpen={activePanel === 'minerva'}
        onToggle={handleMinervaToggle}
        messagesHeight={messagesHeight}
      />
    </>
  )
}
