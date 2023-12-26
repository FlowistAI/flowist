import {
    FastForward,
    FastRewind,
    Pause,
    PlayArrow,
    VolumeDown,
} from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useAudioPlayer } from 'react-use-audio-player'
import BoxProgressBar from './BoxProgressBar'
import { IconOnlyButton } from './IconOnlyButton'

type AudioPlayerOptions = {
    src: string
}

const AudioPlayer = ({ src }: AudioPlayerOptions) => {
    const {
        load,
        togglePlayPause,
        seek,
        playing,
        getPosition,
        duration,
        setVolume,
    } = useAudioPlayer()

    useEffect(() => {
        if (!src) {
            return
        }

        load(src)
    }, [src, load])

    const percentProgress = (getPosition() / duration) * 100

    const [localVolume, setLocalVolume] = useState(50)

    useEffect(() => {
        setVolume(localVolume / 100)
    }, [localVolume, setVolume])

    const handlePlayPause = () => {
        togglePlayPause()
    }

    const handleVolumeChange = (newValue: number) => {
        console.log(newValue)

        setLocalVolume(newValue)
    }

    const seekForward = () => {
        const newPosition = getPosition() + 15
        seek(newPosition)
    }

    const seekBackward = () => {
        const newPosition = getPosition() - 15
        seek(newPosition)
    }

    const handleProgressChange = (newValue: number) => {
        seek(newValue)
    }

    return (
        <div className="flex items-center space-x-2 p-2 ">
            <IconOnlyButton onClick={seekBackward}>
                <FastRewind />
            </IconOnlyButton>
            <IconOnlyButton onClick={handlePlayPause}>
                {playing ? <Pause /> : <PlayArrow />}
            </IconOnlyButton>
            <IconOnlyButton onClick={seekForward}>
                <FastForward />
            </IconOnlyButton>

            <BoxProgressBar
                className="w-full"
                min={0}
                max={100}
                value={percentProgress}
                onChange={handleProgressChange}
            />
            <IconOnlyButton onClick={() => setLocalVolume((prev) => prev - 10)}>
                <VolumeDown />
            </IconOnlyButton>
            <BoxProgressBar
                className="w-24"
                min={0}
                max={100}
                value={localVolume}
                onChange={handleVolumeChange}
            />
        </div>
    )
}

export default AudioPlayer
