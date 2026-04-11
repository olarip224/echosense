import { useState } from 'react'
import { ASL_REFERENCE, TOTAL_SIGNS } from '../data/aslReference'

interface Props {
  onClose: () => void
  currentGesture: string | null
}

export function ReferenceSheet({ onClose, currentGesture }: Props) {
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState(-1)

  const filtered = ASL_REFERENCE
    .map((section, sectionIdx) => ({
      ...section,
      sectionIdx,
      signs: section.signs.filter((sign) =>
        search === '' ||
        sign.label.toLowerCase().includes(search.toLowerCase()) ||
        sign.tip.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(
      (section) =>
        (activeSection === -1 || section.sectionIdx === activeSection) &&
        section.signs.length > 0
    )

  const tabs = ['All', ...ASL_REFERENCE.map((s) => s.title)]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15,23,42,0.97)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ color: '#ffffff', fontSize: '18px', fontWeight: 500 }}>
            ASL Reference Sheet
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
            Hold each sign steady for 2 seconds for EchoSense to recognize it
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="text"
            placeholder="Search signs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#ffffff',
              fontSize: '13px',
              width: '200px',
              outline: 'none',
            }}
          />
          <button
            onClick={onClose}
            style={{
              marginLeft: '4px',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: 1,
              padding: '0 8px',
              opacity: 0.7,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div
        style={{
          flexShrink: 0,
          padding: '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab, tabIdx) => {
          const isActive =
            tabIdx === 0 ? activeSection === -1 : activeSection === tabIdx - 1
          return (
            <button
              key={tab}
              onClick={() => setActiveSection(tabIdx === 0 ? -1 : tabIdx - 1)}
              style={{
                padding: '10px 16px',
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid #1D9E75' : '2px solid transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                background: 'transparent',
                border: 'none',
                borderBottomStyle: 'solid',
                borderBottomWidth: '2px',
                borderBottomColor: isActive ? '#1D9E75' : 'transparent',
                whiteSpace: 'nowrap',
              }}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {filtered.length === 0 && (
          <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>
            No signs found matching "{search}"
          </div>
        )}
        {filtered.map((section) => (
          <div key={section.title}>
            {/* Section header */}
            <div
              style={{
                background: section.color + '22',
                borderLeft: `3px solid ${section.color}`,
                borderRadius: '0 8px 8px 0',
                padding: '10px 16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>
                {section.title}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                {section.description}
              </div>
            </div>

            {/* Signs grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '12px',
                marginBottom: '32px',
              }}
            >
              {section.signs.map((sign) => {
                const isDetected = sign.gestureKey === currentGesture
                return (
                  <div
                    key={sign.gestureKey}
                    style={{
                      background: isDetected
                        ? 'rgba(29,158,117,0.1)'
                        : 'rgba(255,255,255,0.05)',
                      border: isDetected
                        ? '1px solid #1D9E75'
                        : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      transition: 'border-color 0.2s',
                      position: 'relative',
                    }}
                  >
                    {/* Detected pill */}
                    {isDetected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: '#1D9E75',
                          color: '#ffffff',
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          animation: 'fadeUp 0.2s ease-out',
                        }}
                      >
                        Detected!
                      </div>
                    )}

                    {/* Top row */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '10px',
                      }}
                    >
                      <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: 600 }}>
                        {sign.label}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#475569',
                          fontFamily: 'monospace',
                          marginLeft: '8px',
                        }}
                      >
                        {sign.gestureKey}
                      </div>
                    </div>

                    {/* Hand shape visual */}
                    <div
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginBottom: '10px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}>
                        Hand shape:
                      </div>
                      <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                        {sign.fingers}
                      </div>
                    </div>

                    {/* Hand shape text */}
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#cbd5e1',
                        lineHeight: 1.6,
                        marginBottom: '8px',
                      }}
                    >
                      {sign.handShape}
                    </div>

                    {/* Tip */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#facc15',
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          fontStyle: 'italic',
                          lineHeight: 1.5,
                        }}
                      >
                        {sign.tip}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15,23,42,0.8)',
        }}
      >
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          EchoSense supports {TOTAL_SIGNS} signs across {ASL_REFERENCE.length} categories
        </div>
        <div style={{ fontSize: '11px', color: '#475569' }}>
          Switch to Spell mode to type letter by letter →
        </div>
      </div>
    </div>
  )
}
