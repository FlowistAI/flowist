import { Dropdown, MenuButton, ListItemDecorator, Modal, ModalDialog, ModalClose, Typography } from "@mui/joy"
import { IconButton, Menu, MenuItem } from "@mui/joy"
import { KebabHorizontalIcon } from "@primer/octicons-react"
import { FC, useState } from "react"
import SettingsIcon from '@mui/icons-material/Settings';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { produce } from "immer";
import { chatSessionsState } from "../states/chat-states";
import ChatBoxSettingsForm from "./ChatBoxSettings";
import { ChatNodePreset } from "../types/chat-types";
import { useToast } from "../hooks/Toast/useToast";

export type ChatBoxDropDownMenuProps = {
    sessionId: string
}
export const ChatBoxDropDownMenu: FC<ChatBoxDropDownMenuProps> = ({ sessionId }) => {
    const [open, setOpen] = useState<boolean>(false);
    const session = useRecoilValue(chatSessionsState).find(session => session.id === sessionId);
    const setSessions = useSetRecoilState(chatSessionsState);
    const toast = useToast()
    if (!session) {
        return null
    }
    const saveBotSettings = (values: ChatNodePreset) => {
        setSessions((prev) => produce(prev, (draft) => {
            const session = draft.find(s => s.id === sessionId);
            if (session) {
                session.bot = values.bot;
            }
        }));
        toast({ type: 'success', content: 'Bot settings saved' })
        setOpen(false);
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
                <ChatBoxSettingsForm initialValues={session} onSubmit={saveBotSettings} />
            </ModalDialog>
        </Modal>
    </>
}

