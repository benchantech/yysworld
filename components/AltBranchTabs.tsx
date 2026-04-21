'use client'

import { useState } from 'react'
import { MonoLabel } from '@/components/canon/Primitives'

interface AltTab {
  branchId: string
  label: string
  sub?: string
  children: React.ReactNode
}

export function AltBranchTabs({ tabs }: { tabs: AltTab[] }) {
  const [active, setActive] = useState(tabs[0]?.branchId ?? '')

  if (tabs.length <= 1) {
    return <>{tabs[0]?.children ?? null}</>
  }

  return (
    <div>
      <div className="yy-branchNav" style={{ margin: '0 0 16px' }}>
        <MonoLabel>alt path</MonoLabel>
        <div className="yy-branchNav__options">
          {tabs.map((tab) => (
            <button
              key={tab.branchId}
              onClick={() => setActive(tab.branchId)}
              className={`yy-branchNav__item${active === tab.branchId ? ' is-current' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <span className="yy-branchNav__label">{tab.label}</span>
              {tab.sub && <span className="yy-branchNav__sub">{tab.sub}</span>}
            </button>
          ))}
        </div>
      </div>
      {tabs.map((tab) => (
        <div key={tab.branchId} style={{ display: active === tab.branchId ? '' : 'none' }}>
          {tab.children}
        </div>
      ))}
    </div>
  )
}
