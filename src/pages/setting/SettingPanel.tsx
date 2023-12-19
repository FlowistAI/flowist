import React, { FC } from 'react'
import SystemSettings from './SystemSettings'
import ModelSettings from './ModelSettings'
import AboutTab from './AboutTab'
import './SettingPanel.css'

export type SettingPanelProps = {
    activeTab: string
};

const SettingPanel: FC<SettingPanelProps> = ({ activeTab }) => {
    let content

    switch (activeTab) {
        case 'system':
            content = <SystemSettings />
            break
        case 'model':
            content = <ModelSettings />
            break
        case 'about':
            content = <AboutTab />
            break
        default:
            content = <div>请选择一个标签。</div>
    }

    return (
        <div className="setting-panel">
            {content}
        </div>
    )
}

export default SettingPanel
