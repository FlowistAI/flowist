import { FC, forwardRef, useImperativeHandle, useState } from 'react'
import './LLMSettings.css'
import { SettingRefAttrs } from './SettingRefAttrs'
import { useAtom } from 'jotai'
import {
    systemNameAtom,
    systemLanguageAtom,
    systemThemeAtom,
    systemAutoSaveAtom,
} from '../../hooks/Settings'

const ModelSettings: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        // const [defaultPrompt, setDefaultPrompt] = useState('')
        // const [apiSource, setApiSource] = useState('official')
        // const [apiKey, setApiKey] = useState('')
        // const [defaultModel, setDefaultModel] = useState('GPT3.5')
        // const [customApiUrl, setCustomApiUrl] = useState('')

        const [systemName, setSystemName] = useAtom(systemNameAtom)
        const [systemLanguage, setSystemLanguage] = useAtom(systemLanguageAtom)
        const [systemTheme, setSystemTheme] = useAtom(systemThemeAtom)
        const [systemAutoSave, setSystemAutoSave] = useAtom(systemAutoSaveAtom)

        const [systemNameLocal, setSystemNameLocal] = useState(systemName)
        const [systemLanguageLocal, setSystemLanguageLocal] =
            useState(systemLanguage)
        const [systemThemeLocal, setSystemThemeLocal] = useState(systemTheme)
        const [systemAutoSaveLocal, setSystemAutoSaveLocal] =
            useState(systemAutoSave)

        useImperativeHandle(ref, () => ({
            save() {
                setSystemName(systemNameLocal)
                setSystemLanguage(systemLanguageLocal)
                setSystemTheme(systemThemeLocal)
                setSystemAutoSave(systemAutoSaveLocal)
                console.log('system, save')
            },
        }))

        return (
            <div className="model-settings">
                <div className="setting-item">
                    <label htmlFor="default-prompt">全局默认提示词：</label>
                    <textarea
                        id="default-prompt"
                        value={defaultPrompt}
                        onChange={(e) => setDefaultPrompt(e.target.value)}
                    />
                </div>
                <div className="setting-item">
                    <label>API 来源：</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="api-source"
                                value="official"
                                checked={apiSource === 'official'}
                                onChange={() => setApiSource('official')}
                            />
                            官方
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="api-source"
                                value="custom"
                                checked={apiSource === 'custom'}
                                onChange={() => setApiSource('custom')}
                            />
                            自定义服务器
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="api-source"
                                value="third-party"
                                checked={apiSource === 'third-party'}
                                onChange={() => setApiSource('third-party')}
                            />
                            第三方接口
                        </label>
                    </div>
                </div>
                {apiSource !== 'third-party' && (
                    <div className="setting-item">
                        <label htmlFor="api-key">API Key：</label>
                        <input
                            id="api-key"
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                )}
                {apiSource === 'custom' && (
                    <div className="setting-item">
                        <label htmlFor="custom-api-url">API 服务地址：</label>
                        <input
                            id="custom-api-url"
                            type="text"
                            value={customApiUrl}
                            onChange={(e) => setCustomApiUrl(e.target.value)}
                        />
                    </div>
                )}
                {apiSource !== 'third-party' && (
                    <div className="setting-item">
                        <label htmlFor="default-model-select">默认模型：</label>
                        <select
                            id="default-model-select"
                            value={defaultModel}
                            onChange={(e) => setDefaultModel(e.target.value)}
                        >
                            <option value="GPT3.5">GPT3.5</option>
                            <option value="GPT4">GPT4</option>
                        </select>
                    </div>
                )}
            </div>
        )
    },
)

export default ModelSettings
