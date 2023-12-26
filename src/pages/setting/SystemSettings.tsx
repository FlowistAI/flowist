import { FC, forwardRef } from 'react'
import './SystemSettings.css'
import { useAtom } from 'jotai'
import {
    systemAutoSaveAtom,
    systemCorsProxyAtom,
    systemCorsProxyEnabledAtom,
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

const SystemSettings: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const [systemName, setSystemName] = useAtom(systemNameAtom)
        const [systemLanguage, setSystemLanguage] = useAtom(systemLanguageAtom)
        const [systemTheme, setSystemTheme] = useAtom(systemThemeAtom)
        const [systemAutoSave, setSystemAutoSave] = useAtom(systemAutoSaveAtom)
        const [systemCorsProxy, setSystemCorsProxy] =
            useAtom(systemCorsProxyAtom)
        const [systemCorsProxyEnabled, setSystemCorsProxyEnabled] = useAtom(
            systemCorsProxyEnabledAtom,
        )

        const handleSave = (values: SystemSection) => {
            console.log('system, save')
            setSystemName(values.name)
            setSystemLanguage(values.language)
            setSystemTheme(values.theme)
            setSystemAutoSave(values.autoSave)
            setSystemCorsProxy(values.corsProxy)
            setSystemCorsProxyEnabled(values.corsProxyEnabled)
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
                        corsProxy: systemCorsProxy,
                        corsProxyEnabled: systemCorsProxyEnabled,
                    }}
                    validationSchema={systemSectionSchema}
                    onSubmit={handleSave}
                />
            </div>
        )
    },
)

export default SystemSettings
