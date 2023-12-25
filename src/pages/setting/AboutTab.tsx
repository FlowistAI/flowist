import { useAtomValue } from 'jotai'
import { versionAtom } from '../../states/settings/settings.atom'
import { FC, forwardRef, useImperativeHandle } from 'react'
import { SettingRefAttrs } from './SettingRefAttrs'
import { Typography } from '@mui/joy'

const AboutTab: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const version = useAtomValue(versionAtom)

        useImperativeHandle(ref, () => ({
            save() {
                console.log('about, nothing to save')
            },
        }))

        return (
            <div className="about-tab">
                <Typography level="h1">GIDE</Typography>
                <p>Version: {version}</p>
                <p>
                    Author:
                    <a
                        className="text-blue-500 hover:underline ml-2"
                        href="https://github.com/pluveto"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Zijing Zhang
                    </a>
                    <span className="ml-2">from Incolore Team</span>
                </p>
            </div>
        )
    },
)

export default AboutTab
