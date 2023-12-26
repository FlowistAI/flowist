import {
    Dropdown,
    MenuButton,
    ListItemDecorator,
    Modal,
    ModalDialog,
    ModalClose,
    Typography,
} from '@mui/joy'
import { IconButton, Menu, MenuItem } from '@mui/joy'
import { KebabHorizontalIcon } from '@primer/octicons-react'
import { FC, useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import BotSettingsForm from '../_common/BotSettingsForm'
import { useToast } from '../../../hooks/Toast/useToast'
import { useAtom } from 'jotai'
import { chatSessionsAtom } from '../../../states/widgets/chat/chat.atom'
import { BotWrapped } from '../../../states/widgets/chat/chat.type'
import { SaveAs } from '@mui/icons-material'
import { usePresets } from '../../../states/preset.atom'
import { generateUUID } from '../../../util/id-generator'
import { PresetData } from '../../../states/widgets/widget.atom'
import { PresetSaveForm, PresetSaveFormData } from '../_common/PresetSaveForm'
import { t } from 'i18next'

export type ChatBotDropDownMenuProps = {
    sessionId: string
}

export const ChatBotDropDownMenu: FC<ChatBotDropDownMenuProps> = ({
    sessionId,
}) => {
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false)
    const [savePresetOpen, setSavePresetOpen] = useState<boolean>(false)
    const [sessions, setSessions] = useAtom(chatSessionsAtom)
    const session = sessions.find((session) => session.id === sessionId)
    const toast = useToast()
    const { dispatch: dispatchPresets } = usePresets()

    if (!session) {
        return null
    }

    const saveBotSettings = (values: BotWrapped) => {
        setSessions({
            type: 'update',
            session: {
                id: sessionId,
                ...values,
            },
        })
        toast({ type: 'success', content: t('Bot settings saved') })
        setSettingsOpen(false)
    }

    const savePreset = (form: PresetSaveFormData) => {
        const presetData: PresetData = {
            id: generateUUID(),
            type: 'chat-bot',
            ...form,
            settings: session.bot.settings,
        }

        dispatchPresets({
            type: 'add',
            preset: presetData,
        })

        toast({ type: 'success', content: t('Preset saved') })
        setSavePresetOpen(false)
    }

    return (
        <>
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    sx={{ borderRadius: 40 }}
                >
                    <div className="chat-bot__menu nodrag">
                        <KebabHorizontalIcon size={16} />
                    </div>
                </MenuButton>
                <Menu>
                    <MenuItem onClick={() => setSettingsOpen(true)}>
                        <ListItemDecorator>
                            <SettingsIcon />
                        </ListItemDecorator>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={() => setSavePresetOpen(true)}>
                        <ListItemDecorator>
                            <SaveAs />
                        </ListItemDecorator>
                        Save as a Preset
                    </MenuItem>
                </Menu>
            </Dropdown>
            {/* Modal bot settings */}
            <Modal open={settingsOpen} onClose={() => setSettingsOpen(false)}>
                <ModalDialog>
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Bot Settings
                    </Typography>
                    <BotSettingsForm
                        initialValues={session}
                        onSubmit={saveBotSettings}
                    />
                </ModalDialog>
            </Modal>
            {/* Modal save preset */}
            <Modal
                open={savePresetOpen}
                onClose={() => setSavePresetOpen(false)}
            >
                <ModalDialog>
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        Save as a Preset
                    </Typography>
                    <PresetSaveForm
                        initialValues={{
                            name: session.bot.name,
                            icon: session.bot.avatar,
                            description: session.bot.settings.prompt,
                        }}
                        onSubmit={savePreset}
                    />
                </ModalDialog>
            </Modal>
        </>
    )
}
