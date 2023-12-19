import React, { useState } from 'react'
import './SystemSettings.css'

const SystemSettings = () => {
  const [language, setLanguage] = useState('Chinese')
  const [autoSave, setAutoSave] = useState(false)

  return (
    <div className="system-settings">
      <div className="setting-item">
        <label htmlFor="language-select">语言设置：</label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="Chinese">中文</option>
          <option value="English">英文</option>
        </select>
      </div>
      <div className="setting-item">
        <label htmlFor="auto-save-checkbox">自动保存：</label>
        <input
          id="auto-save-checkbox"
          type="checkbox"
          checked={autoSave}
          onChange={(e) => setAutoSave(e.target.checked)}
        />
      </div>
    </div>
  )
}

export default SystemSettings
