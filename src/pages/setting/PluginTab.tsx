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
            const url = '/demo.js'
            window.pluginBridge = {
                register: (plugin: any) => {
                    setPlugins((plugins) => [...plugins, plugin])

                    return React
                },
            }
            const script = document.createElement('script')
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
                                    <plugin.render></plugin.render>
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
