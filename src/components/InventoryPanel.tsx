import React from 'react'

interface InventoryPanelProps {
  inventory: string[]
}

const InventoryPanel: React.FC<InventoryPanelProps> = ({ inventory }) => {
  if (inventory.length === 0) {
    return null
  }

  return (
    <div>
      <h3>🎒 Inventory</h3>
      
      <div style={{display: 'flex', flexDirection: 'row', gap: '8px'}}>
        {inventory.map((item, index) => (
          <span key={index} style={{display: 'inline-block', border: '1px solid #ccc', backgroundColor: '#FFFFFF71', padding: '0.5rem', borderRadius: '0.5rem'}}>
            <div>
              <div>{item}</div>
            </div>
          </span>
        ))}
      </div>
      
      <div>
        <small>Your item may have special properties that could help you along the way...</small>
      </div>
    </div>
  )
}

export default InventoryPanel
