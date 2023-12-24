import { Dropdown, MenuButton, ListItemDecorator, Modal, ModalDialog, ModalClose, Typography } from '@mui/joy'
import { IconButton, Menu, MenuItem } from '@mui/joy'
import { KebabHorizontalIcon } from '@primer/octicons-react'
import { FC, useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import BotSettingsForm from '../_common/BotSettingsForm'
import { useToast } from '../../../hooks/Toast/useToast'
import { useAtom } from 'jotai'
import { querySessionsAtom } from '../../../states/widgets/query/query.atom'
import { BotNodePreset } from '../../../states/widgets/chat/chat.type'

export type QueryBotDropDownMenuProps = {
    sessionId: string
}

export const QueryBotDropDownMenu: FC<QueryBotDropDownMenuProps> = ({ sessionId }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [sessions, setSessions] = useAtom(querySessionsAtom)
    const toast = useToast()

    const session = sessions.find((session) => session.id === sessionId)
    if (!session) {
        console.log(`QueryBotDropDownMenu: session not found for id ${sessionId}, ignore if just deleted`)

        return null
    }

    const saveBotSettings = (values: BotNodePreset) => {
        setSessions({type: 'update', session: {
            id: sessionId,
            ...values
        }})
        toast({ type: 'success', content: 'Bot settings saved' })
        setOpen(false)
    }

    const { bot } = session

    return <>
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                sx={{ borderRadius: 40 }}
            >
                <div className="query-bot__menu nodrag" >
                    <KebabHorizontalIcon size={16} />
                </div>
            </MenuButton>
            <Menu >
                <MenuItem onClick={() => setOpen(true)}>
                    <ListItemDecorator>
                        <SettingsIcon />
                    </ListItemDecorator>
                    Settings
                </MenuItem>
                <MenuItem>
                    <ListItemDecorator>
                        <SaveAsIcon />
                    </ListItemDecorator>
                    Save as a Preset
                </MenuItem>
            </Menu>
        </Dropdown>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
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
                    Bot Settings
                </Typography>
                <BotSettingsForm initialValues={{ bot }} onSubmit={saveBotSettings} />
            </ModalDialog>
        </Modal>
    </>
}

