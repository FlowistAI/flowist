import { FC } from 'react'
import './TabList.css'
import { SettingsSection } from '../../states/settings/settings.type'

export type TabListProps = {
    activeTab: SettingsSection
    setActiveTab: (tab: SettingsSection) => void
}

export const TabList: FC<TabListProps> = ({ activeTab, setActiveTab }) => {
    const activeClass = (tab: SettingsSection) => {
        return activeTab === tab ? 'active' : ''
    }

    return (
        <div className="tab-list">
            <div
                className={`tab ${activeClass('system')}`}
                onClick={() => setActiveTab('system')}
            >
                System
            </div>
            <div
                className={`tab ${activeClass('llm')}`}
                onClick={() => setActiveTab('llm')}
            >
                LLM
            </div>
            <div
                className={`tab ${activeClass('about')}`}
                onClick={() => setActiveTab('about')}
            >
                About
            </div>
        </div>
    )
}

export default TabList
