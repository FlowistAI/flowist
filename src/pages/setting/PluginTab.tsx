/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, forwardRef, useImperativeHandle } from 'react'
import { SettingRefAttrs } from './SettingRefAttrs'
import { Button, Typography } from '@mui/joy'
import { atom, useAtom } from 'jotai'

const pluginsAtom = atom<any[]>([])

const PluginTab: FC<React.RefAttributes<SettingRefAttrs>> = forwardRef(
    (_, ref) => {
        useImperativeHandle(ref, () => ({
            save() {
                console.log('about, nothing to save')
            },
        }))

        const isDebug = process.env.NODE_ENV === 'development'
        const [plugins, setPlugins] = useAtom(pluginsAtom)

        console.log('plugins', plugins)

        const loadPluginTest = () => {
            const url = '/plugins/my-plugin/my-plugin.umd.cjs'
            const win = window as any
            win.pluginBridge = {
                register: (plugin: any) => {
                    setPlugins((plugins) => [...plugins, plugin])

                    return React
                },
            }
            const script = document.createElement('script')
            // script.type = 'module'
            script.src = url
            script.onload = () => {
                console.log('script loaded')
            }

            script.onerror = () => {
                console.log('script load error')
            }

            document.body.appendChild(script)
        }

        return (
            <div className="about-tab">
                <Typography level="h2">Plugin</Typography>
                <p>
                    This is a testing feature for plugin. It is not ready for
                    use yet.
                </p>
                {isDebug && (
                    <div>
                        <p>Debug</p>
                        <Button onClick={() => loadPluginTest()}>
                            Load Plugin Test
                        </Button>

                        <div>
                            {plugins.map((plugin) => (
                                <div key={plugin.name}>
                                    <p>{plugin.name}</p>
                                    <p>{plugin.description}</p>
                                    <plugin.component></plugin.component>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    },
)

export default PluginTab
