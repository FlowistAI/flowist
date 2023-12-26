import { useAtomValue } from 'jotai'
import {
    systemNameAtom,
    versionAtom,
} from '../../states/settings/settings.atom'
import { FC, forwardRef, useImperativeHandle } from 'react'
import { SettingRefAttrs } from './SettingRefAttrs'
import { Typography } from '@mui/joy'
import { t } from 'i18next'

const AboutTab: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        const version = useAtomValue(versionAtom)
        const name = useAtomValue(systemNameAtom)

        useImperativeHandle(ref, () => ({
            save() {
                console.log('about, nothing to save')
            },
        }))

        return (
            <div className="about-tab">
                <Typography level="h1">{name}</Typography>
                <p>
                    {t('Version')}: {version}
                </p>
                <p>
                    {t('Author')}:
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
