import { FC } from 'react'
import './TabList.css'
import { SettingsSection } from '../../states/settings/settings.type'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

type TabConfig = {
    tabKey: SettingsSection
    tabLabel: string
}

const tabConfigs: (t: TFunction<'translation', undefined>) => TabConfig[] = (
    t,
) => [
    { tabKey: 'system', tabLabel: t('System') },
    { tabKey: 'llm', tabLabel: t('LLM') },
    { tabKey: 'plugin', tabLabel: t('plugin') },
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

    const { t } = useTranslation()

    const renderTabs = (t: TFunction<'translation', undefined>) => {
        return tabConfigs(t).map((config) => (
            <div
                key={config.tabKey}
                className={`tab ${activeClass(config.tabKey)}`}
                onClick={() => setActiveTab(config.tabKey)}
            >
                {config.tabLabel}
            </div>
        ))
    }

    return <div className="tab-list">{renderTabs(t)}</div>
}

export default TabList
