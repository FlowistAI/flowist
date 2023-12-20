import { useAtomValue } from 'jotai'
import { versionAtom } from '../../hooks/Settings'
import { FC, forwardRef, useImperativeHandle } from 'react'
import { SettingRefAttrs } from './SettingRefAttrs'

const AboutTab: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const version = useAtomValue(versionAtom)

        useImperativeHandle(ref, () => ({
            save() {
                console.log('about, save')
            },
        }))

        return (
            <div className="about-tab">
                <h1>GIDE</h1>
                <p>版本：{version}</p>
                <p>
                    作者：
                    <a
                        href="https://github.com/pluveto"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Zijing Zhang
                    </a>
                    from Incolore Team
                </p>
            </div>
        )
    },
)

export default AboutTab
