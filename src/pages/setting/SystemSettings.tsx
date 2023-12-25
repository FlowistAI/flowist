import { FC, forwardRef } from 'react'
import './SystemSettings.css'
import { useAtom } from 'jotai'
import {
    systemAutoSaveAtom,
    systemLanguageAtom,
    systemNameAtom,
    systemThemeAtom,
} from '../../states/settings/settings.atom'
import {
    SystemSection,
    systemSectionSchema,
} from '../../states/settings/settings.type'
import { SettingRefAttrs } from './SettingRefAttrs'
import { SystemSettingsForm } from './SystemSettings.form'
import { useTranslation } from 'react-i18next'

const SystemSettings: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const [systemName, setSystemName] = useAtom(systemNameAtom)
        const [systemLanguage, setSystemLanguage] = useAtom(systemLanguageAtom)
        const [systemTheme, setSystemTheme] = useAtom(systemThemeAtom)
        const [systemAutoSave, setSystemAutoSave] = useAtom(systemAutoSaveAtom)

        const { i18n } = useTranslation()
        const handleSave = (values: SystemSection) => {
            console.log('system, save')
            setSystemName(values.name)
            setSystemLanguage(values.language)
            i18n.changeLanguage(values.language)
            setSystemTheme(values.theme)
            setSystemAutoSave(values.autoSave)
        }

        return (
            <div className="system-settings">
                <SystemSettingsForm
                    ref={ref}
                    initialValues={{
                        name: systemName,
                        language: systemLanguage,
                        theme: systemTheme,
                        autoSave: systemAutoSave,
                    }}
                    validationSchema={systemSectionSchema}
                    onSubmit={handleSave}
                />
            </div>
        )
    },
)

export default SystemSettings
