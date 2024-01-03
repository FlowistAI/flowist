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
import { useToast } from '../../../hooks/Toast/useToast'
import { useAtom } from 'jotai'
import { SaveAs } from '@mui/icons-material'
import { usePresets } from '../../../states/preset.atom'
import { generateUUID } from '../../../util/id-generator'
import { PresetData } from '../../../states/widgets/widget.atom'
import { PresetSaveForm, PresetSaveFormData } from '../_common/PresetSaveForm'
import { t } from 'i18next'
import { ttsSessionsAtom } from '../../../states/widgets/tts/tts'

export type TTSDropDownMenuProps = {
    sessionId: string
}

export const TTSDropDownMenu: FC<TTSDropDownMenuProps> = ({ sessionId }) => {
    const [savePresetOpen, setSavePresetOpen] = useState<boolean>(false)
    const [sessions] = useAtom(ttsSessionsAtom)
    const session = sessions.find((session) => session.id === sessionId)
    const toast = useToast()
    const { dispatch: dispatchPresets } = usePresets()

    if (!session) {
        return null
    }

    const savePreset = (form: PresetSaveFormData) => {
        const presetData: PresetData = {
            id: generateUUID(),
            type: 'text-to-speech',
            ...form,
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
                    <div className="tts__menu nodrag">
                        <KebabHorizontalIcon size={16} />
                    </div>
                </MenuButton>
                <Menu>
                    <MenuItem onClick={() => setSavePresetOpen(true)}>
                        <ListItemDecorator>
                            <SaveAs />
                        </ListItemDecorator>
                        Save as a Preset
                    </MenuItem>
                </Menu>
            </Dropdown>
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
                            name: 'Text to Speech',
                            icon: 'sound.png',
                            description: '',
                        }}
                        onSubmit={savePreset}
                    />
                </ModalDialog>
            </Modal>
        </>
    )
}
