import { FC, forwardRef, useImperativeHandle, useRef } from 'react'
import SystemSettings from './SystemSettings'
import ModelSettings from './LLMSettings'
import AboutTab from './AboutTab'
import './SettingPanel.css'
import { SettingsSection } from '../../states/settings/settings.type'
import { SettingRefAttrs } from './SettingRefAttrs'
import { useToast } from '../../hooks/Toast/useToast'

export type SettingPanelProps = {
    activeTab: SettingsSection
} & React.RefAttributes<SettingRefAttrs>

export type HideProps = React.PropsWithChildren<{
    cond: boolean
}>

// render the component but hide it with style, which prevents the component from unmounting
export const Hide: FC<HideProps> = ({ cond, children }) => (
    <div style={{ display: cond ? 'block' : 'none' }}>{children}</div>
)

const SettingPanel: FC<SettingPanelProps> = forwardRef(({ activeTab }, ref) => {
    const refSystem = useRef<SettingRefAttrs>(null)
    const refLLM = useRef<SettingRefAttrs>(null)
    const refAbout = useRef<SettingRefAttrs>(null)

    const toast = useToast()

    useImperativeHandle(ref, () => ({
        save() {
            console.log('setting panel, save')
            refSystem.current?.save()
            refLLM.current?.save()
            refAbout.current?.save()
            toast({
                type: 'success',
                content: 'Saved',
            })
        },
    }))

    return (
        <div className="setting-panel overflow-auto">
            <Hide cond={activeTab == 'system'}>
                <SystemSettings ref={refSystem} />
            </Hide>
            <Hide cond={activeTab == 'llm'}>
                <ModelSettings ref={refLLM} />
            </Hide>
            <Hide cond={activeTab == 'about'}>
                <AboutTab ref={refAbout} />
            </Hide>
        </div>
    )
})

export default SettingPanel
