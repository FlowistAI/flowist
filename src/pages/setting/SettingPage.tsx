import { FC, useRef, useState } from 'react'
import TabList from './TabList'
import SettingPanel from './SettingPanel'
import './SettingPage.css'
import { SettingsSection } from '../../states/settings/settings.type'
import { Button } from '@mui/joy'
import { SettingRefAttrs } from './SettingRefAttrs'

type SettingPageProps = {
    onClose: () => void
}

export const SettingPage: FC<SettingPageProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<SettingsSection>('system')
    const panelRef = useRef<SettingRefAttrs>(null)

    const handleSave = () => {
        console.log('setting page, save')
        panelRef.current?.save()
    }

    return (
        <div className="h-full flex flex-col">
            <div className="setting-page flex-1 overflow-auto">
                <TabList activeTab={activeTab} setActiveTab={setActiveTab} />
                <SettingPanel ref={panelRef} activeTab={activeTab} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
                <Button color="danger" onClick={onClose}>
                    Close
                </Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </div>
    )
}

export default SettingPage
