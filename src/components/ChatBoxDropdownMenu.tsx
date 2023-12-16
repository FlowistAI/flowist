import { Dropdown, MenuButton, ListItemDecorator, Modal, ModalDialog, ModalClose, Typography } from "@mui/joy"
import { IconButton, Menu, MenuItem } from "@mui/joy"
import { KebabHorizontalIcon } from "@primer/octicons-react"
import { FC, useState } from "react"
import SettingsIcon from '@mui/icons-material/Settings';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useRecoilValue } from "recoil";
import { chatSessionsState } from "../states/chat-states";
import ChatBoxSettingsForm from "./ChatBoxSettings";

export type ChatBoxDropDownMenuProps = {
    sessionId: string
}
export const ChatBoxDropDownMenu: FC<ChatBoxDropDownMenuProps> = ({ sessionId }) => {
    const [open, setOpen] = useState<boolean>(false);
    const session = useRecoilValue(chatSessionsState).find(session => session.id === sessionId);

    if (!session) {
        console.error('session not found', sessionId)
        return null
    }

    return <>
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                sx={{ borderRadius: 40 }}
            >
                <div className="chat-box__menu nodrag" >
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
                <ChatBoxSettingsForm initialValues={session} />
            </ModalDialog>
        </Modal>
    </>
}

