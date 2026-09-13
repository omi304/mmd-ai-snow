import { useState } from 'react'
import { Canvas } from './components/Canvas'
import { Outliner } from './components/panels/Outliner'
import { Properties } from './components/panels/Properties'
import { Timeline } from './components/Timeline'
import { TopMenu } from './components/TopMenu'
import './App.css'

export default function App() {
  const [selectedObject, setSelectedObject] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  return (
    <div className="app-container">
      {/* Top Menu Bar */}
      <TopMenu />

      {/* Main Layout */}
      <div className="main-layout">
        {/* Left Panel - Outliner */}
        <div className="panel left-panel">
          <Outliner onSelectObject={setSelectedObject} />
        </div>

        {/* Center - 3D Viewport */}
        <div className="viewport-container">
          <Canvas />
        </div>

        {/* Right Panel - Properties */}
        <div className="panel right-panel">
          <Properties selectedObject={selectedObject} />
        </div>
      </div>

      {/* Bottom Panel - Timeline */}
      <div className="timeline-container">
        <Timeline 
          isPlaying={isPlaying}
          currentTime={currentTime}
          onPlayPause={setIsPlaying}
          onTimeChange={setCurrentTime}
        />
      </div>
    </div>
  )
}
