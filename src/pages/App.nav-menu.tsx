import * as React from 'react'
import Menu, { menuClasses } from '@mui/joy/Menu'
import MenuItem from '@mui/joy/MenuItem'
import IconButton from '@mui/joy/IconButton'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import Sheet from '@mui/joy/Sheet'
import Settings from '@mui/icons-material/Settings'
import Dropdown from '@mui/joy/Dropdown'
import MenuButton from '@mui/joy/MenuButton'
import { Article, Inbox } from '@mui/icons-material'
import { useDocument } from '../states/document.atom'
import { useAtomValue, useSetAtom } from 'jotai'
import { showPresetsSidebarAtom } from '../states/preset.atom'
import { GearIcon } from '@primer/octicons-react'
import { useSettingsModal } from '../states/settings/settings.atom'
import { t } from 'i18next'
// The Menu is built on top of Popper v2, so it accepts `modifiers` prop that will be passed to the Popper.
// https://popper.js.org/docs/v2/modifiers/offset/
interface MenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    menu: React.ReactElement
    open: boolean
    active?: boolean
    onOpen: (
        event?:
            | React.MouseEvent<HTMLButtonElement>
            | React.KeyboardEvent<HTMLButtonElement>,
    ) => void
    onLeaveMenu: (callback: () => boolean) => void
    label: string
}

const modifiers = [
    {
        name: 'offset',
        options: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            offset: [0, 0],
        },
    },
]

function NavMenuButton({
    children,
    menu,
    open,
    onOpen,
    active,
    onLeaveMenu,
    label,
    ...props
}: Omit<MenuButtonProps, 'color'>) {
    const isOnButton = React.useRef(false)
    const internalOpen = React.useRef(open)

    const handleButtonKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
    ) => {
        internalOpen.current = open

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            onOpen(event)
        }
    }

    return (
        <Dropdown
            open={open}
            onOpenChange={(_, isOpen) => {
                if (isOpen) {
                    onOpen?.()
                }
            }}
        >
            <MenuButton
                {...props}
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral' } }}
                onMouseDown={() => {
                    internalOpen.current = open
                }}
                onClick={(e) => {
                    if (!internalOpen.current) {
                        onOpen()
                    }

                    if (props.onClick) {
                        props.onClick(e)
                    }
                }}
                onMouseEnter={() => {
                    onOpen()
                    isOnButton.current = true
                }}
                onMouseLeave={() => {
                    isOnButton.current = false
                }}
                onKeyDown={handleButtonKeyDown}
                sx={{
                    bgcolor:
                        open || active ? 'neutral.plainHoverBg' : undefined,
                    '&:focus-visible': {
                        bgcolor: 'neutral.plainHoverBg',
                    },
                }}
            >
                {children}
            </MenuButton>
            {React.cloneElement(menu, {
                onMouseLeave: () => {
                    onLeaveMenu(() => isOnButton.current)
                },
                modifiers,
                slotProps: {
                    listbox: {
                        id: `nav-example-menu-${label}`,
                        'aria-label': label,
                    },
                },
                placement: 'right',
                sx: {
                    width: 288,
                    [`& .${menuClasses.listbox}`]: {
                        '--List-padding': 'var(--ListDivider-gap)',
                    },
                },
            })}
        </Dropdown>
    )
}

const IconText = ({ icon, text }: { icon?: React.ReactNode; text: string }) => (
    <>
        {icon && <span>{icon}</span>}
        {text}
    </>
)

export default function MenuIconSideNavExample() {
    const [menuIndex, setMenuIndex] = React.useState<null | string>(null)
    const itemProps = {
        sx: { userSelect: 'none' },
    }
    const { dispatch } = useDocument()
    const { open: openAppSettings } = useSettingsModal()
    const isPresetsOpen = useAtomValue(showPresetsSidebarAtom)
    const createHandleLeaveMenu =
        (index: string) => (getIsOnButton: () => boolean) => {
            setTimeout(() => {
                const isOnButton = getIsOnButton()

                if (!isOnButton) {
                    setMenuIndex((latestIndex: null | string) => {
                        if (index === latestIndex) {
                            return null
                        }

                        return latestIndex
                    })
                }
            }, 0)
        }

    const setShowPresetsSidebar = useSetAtom(showPresetsSidebarAtom)
    const togglePresetsSidebar = () => {
        console.log('toggle sidebar presets')

        setShowPresetsSidebar((prev) => !prev)
    }

    return (
        <Sheet
            onMouseLeave={() => setMenuIndex(null)}
            sx={{ borderRadius: 'sm', py: 1, mr: 0, userSelect: 'none' }}
        >
            <List>
                <ListItem>
                    <NavMenuButton
                        label="Document"
                        open={menuIndex === 'Document'}
                        onOpen={() => setMenuIndex('Document')}
                        onLeaveMenu={createHandleLeaveMenu('Document')}
                        menu={
                            <Menu onClose={() => setMenuIndex(null)}>
                                <MenuItem
                                    {...itemProps}
                                    onClick={() => dispatch({ type: 'load' })}
                                >
                                    {t('Open Document')}
                                </MenuItem>
                                <MenuItem
                                    {...itemProps}
                                    onClick={() => dispatch({ type: 'save' })}
                                >
                                    {t('Save Document')}
                                </MenuItem>
                            </Menu>
                        }
                    >
                        <Article />
                    </NavMenuButton>
                </ListItem>

                <ListItem>
                    <NavMenuButton
                        label={t('Presets')}
                        open={menuIndex === 'Presets'}
                        onOpen={() => setMenuIndex('Presets')}
                        onClick={togglePresetsSidebar}
                        onLeaveMenu={createHandleLeaveMenu('Presets')}
                        active={isPresetsOpen}
                        menu={<></>}
                    >
                        <Inbox />
                    </NavMenuButton>
                </ListItem>
                <ListItem>
                    <NavMenuButton
                        label={t('Settings')}
                        open={menuIndex === 'Settings'}
                        onOpen={() => setMenuIndex('Settings')}
                        onLeaveMenu={createHandleLeaveMenu('Settings')}
                        menu={
                            <Menu onClose={() => setMenuIndex(null)}>
                                {/* <MenuItem {...itemProps}>
                                    <IconText
                                        icon={
                                            <Output
                                                sx={{
                                                    transform: 'rotate(180deg)',
                                                }}
                                            />
                                        }
                                        text={t('Import')}
                                    />
                                </MenuItem>
                                <MenuItem {...itemProps}>
                                    <IconText
                                        icon={<Output />}
                                        text={t('Export')}
                                    />
                                </MenuItem> */}
                                <MenuItem
                                    {...itemProps}
                                    onClick={() => openAppSettings()}
                                >
                                    <IconText
                                        icon={<GearIcon />}
                                        text={t('App Settings')}
                                    />
                                </MenuItem>
                            </Menu>
                        }
                    >
                        <Settings />
                    </NavMenuButton>
                </ListItem>
                {/* <ListItem>
                    <NavMenuButton
                        label={t('Personal')}
                        open={menuIndex === 'Personal'}
                        onOpen={() => setMenuIndex('Personal')}
                        onLeaveMenu={createHandleLeaveMenu('Personal')}
                        menu={
                            <Menu onClose={() => setMenuIndex(null)}>
                                <MenuItem {...itemProps}>Personal 1</MenuItem>
                                <MenuItem {...itemProps}>Personal 2</MenuItem>
                                <MenuItem {...itemProps}>Personal 3</MenuItem>
                            </Menu>
                        }
                    >
                        <Person />
                    </NavMenuButton>
                </ListItem>
                <ListItem>
                    <NavMenuButton
                        label={t('Debug')}
                        open={menuIndex === 'Debug'}
                        onOpen={() => setMenuIndex('Debug')}
                        onLeaveMenu={createHandleLeaveMenu('Debug')}
                        menu={
                            <Menu onClose={() => setMenuIndex(null)}>
                                <MenuItem onClick={handleIsDesktop}>
                                    Is Desktop
                                </MenuItem>
                                <MenuItem {...itemProps}>Personal 2</MenuItem>
                                <MenuItem {...itemProps}>Personal 3</MenuItem>
                            </Menu>
                        }
                    >
                        <PestControl />
                    </NavMenuButton>
                </ListItem> */}
            </List>
        </Sheet>
    )
}

export const AsideMenu = React.memo(() => {
    return (
        <div className="flex h-full">
            <aside
                className="aside-menu flex flex-col items-center gap-4 z-10"
                style={{ backgroundColor: '#fbfcfe' }}
            >
                <div className="select-none pointer-events-none border-r">
                    <img src="logo.png" alt="Logo" width={40} />
                </div>
                <div className="aside-menu__content">
                    <div className="aside-menu__content__item">
                        <MenuIconSideNavExample />
                    </div>
                </div>
            </aside>
        </div>
    )
})
