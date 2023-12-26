import { FC } from 'react'
import './TabList.css'
import { SettingsSection } from '../../states/settings/settings.type'
import { t } from 'i18next'

type TabConfig = {
    tabKey: SettingsSection
    tabLabel: string
}

const tabConfigs: () => TabConfig[] = () => [
    { tabKey: 'system', tabLabel: t('System') },
    { tabKey: 'llm', tabLabel: t('LLM') },
    { tabKey: 'about', tabLabel: t('About') },
]

export type TabListProps = {
    activeTab: SettingsSection
    setActiveTab: (tab: SettingsSection) => void
}

export const TabList: FC<TabListProps> = ({ activeTab, setActiveTab }) => {
    const activeClass = (tab: SettingsSection) => {
        return activeTab === tab ? 'active' : ''
    }

    const renderTabs = () => {
        return tabConfigs().map((config) => (
            <div
                key={config.tabKey}
                className={`tab ${activeClass(config.tabKey)}`}
                onClick={() => setActiveTab(config.tabKey)}
            >
                {config.tabLabel}
            </div>
        ))
    }

    return <div className="tab-list">{renderTabs()}</div>
}

export default TabList
