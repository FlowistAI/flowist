import React from 'react'
import RcMenu, { Item as MenuItem } from 'rc-menu'
import RcDropdown from 'rc-dropdown'
import 'rc-dropdown/assets/index.css'
import 'rc-menu/assets/index.css'
import './ContextMenu.rc.css'
const menuWidth = 200

// import './ContextMenu.css';
export interface MenuItem {
    key: string
    text: string
    icon?: React.ReactNode
    callback?: () => void
    children?: MenuItem[]
}

export type SubMenuProps = {
    items: MenuItem
    parentPos?: { x: number; y: number }
    parentSize?: { width: number; height: number }
};

type ContextMenuProps = {
    position?: { x: number; y: number }
    isOpen?: boolean
    items: MenuItem[]
    onClose?: () => void
};

const IconText = ({ icon, text }: { icon?: React.ReactNode; text: string }) => (
    <>
        {icon && <span className='context-menu__icon'>
            {icon}
        </span>}
        {text}
    </>
)

export const ContextMenu = ({ position, items, isOpen, onClose }: ContextMenuProps) => {
    if (!isOpen || !position) {
        return null
    }

    type OverlayProvider = (onClose?: () => void) => React.ReactElement;

    const overlayProvider: OverlayProvider = (onClose) => {
        const handleMenuItemClick = (item: MenuItem) => {
            if (item) {
                item.callback?.()
                onClose?.()
            }
        }
        return (
            <RcMenu style={{ width: menuWidth }}>
                {items.map((item) => {
                    if (item.children && item.children.length > 0) {
                        return (
                            <RcMenu.SubMenu
                                title={<IconText icon={item.icon} text={item.text} />} key={item.key}>
                                {item.children.map((subItem) => (
                                    <MenuItem key={subItem.key} onClick={() => handleMenuItemClick(subItem)}>
                                        <IconText icon={subItem.icon} text={subItem.text} />
                                    </MenuItem>
                                ))}
                            </RcMenu.SubMenu>
                        )
                    }
                    return (
                        <MenuItem key={item.key} onClick={() => handleMenuItemClick(item)}>
                            <IconText icon={item.icon} text={item.text} />
                        </MenuItem>
                    )
                })}
            </RcMenu>
        )
    }

    // fix screen bottom overflow
    if (position.y + 80 > window.innerHeight) {
        position.y = window.innerHeight - 80
    }


    return (
        <RcDropdown
            overlay={overlayProvider(onClose)}
            trigger={['contextMenu']}
            onVisibleChange={visible => !visible && onClose && onClose()}
            visible={isOpen}
            overlayClassName='context-menu'
            align={{
                offset: [position.x, position.y],
            }}
            alignPoint
        >
            <div />
        </RcDropdown>
    )
}
