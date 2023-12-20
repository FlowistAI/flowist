import { FC, forwardRef, useImperativeHandle, useState } from 'react'
import './SystemSettings.css'
import { useAtom } from 'jotai'
import {
    SupportedLang,
    systemAutoSaveAtom,
    systemLanguageAtom,
} from '../../hooks/Settings'
import { SettingRefAttrs } from './SettingRefAttrs'

const SystemSettings: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const [language, setLanguage] = useAtom(systemLanguageAtom)
        const [languageLocal, setLanguageLocal] =
            useState<SupportedLang>(language)
        const [autoSave, setAutoSave] = useAtom(systemAutoSaveAtom)
        const [autoSaveLocal, setAutoSaveLocal] = useState(autoSave)

        useImperativeHandle(ref, () => ({
            save() {
                setLanguage(languageLocal)
                setAutoSave(autoSaveLocal)
                console.log('system, save')
            },
        }))

        const handleLangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setLanguageLocal(e.target.value as SupportedLang)
        }

        return (
            <div className="system-settings">
                <div className="setting-item">
                    <label htmlFor="language-select">Language</label>
                    <select
                        id="language-select"
                        value={languageLocal}
                        onChange={handleLangSelect}
                    >
                        <option value="zh-CN">简体中文</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <div className="setting-item">
                    <label htmlFor="auto-save-checkbox">Auto Save</label>
                    <input
                        id="auto-save-checkbox"
                        type="checkbox"
                        checked={autoSaveLocal}
                        onChange={(e) => setAutoSaveLocal(e.target.checked)}
                    />
                </div>
            </div>
        )
    },
)

export default SystemSettings
