import React, { useState, useRef } from 'react'
import { Pause, FastForward, FastRewind, PlayArrow, VolumeUp } from '@mui/icons-material'
import Slider from '@mui/material/Slider'
import { useAudioPlayer } from 'react-use-audio-player'
import CustomSlider from './CustomSlider'

const AudioPlayer = () => {
    const {
        togglePlayPause,
        seek,
        getPosition,
        setVolume,
    } = useAudioPlayer()

    const isPlaying = getPosition() > 0

    const [volume, setLocalVolume] = useState(100)
    const [progress, setProgress] = useState(0) // 假设初始进度是0

    const [showVolumeSlider, setShowVolumeSlider] = useState(false)
    const volumeSliderRef = useRef(null)

    const handlePlayPause = () => {
        togglePlayPause()
    }

    const handleVolumeChange = (event, newValue) => {
        setLocalVolume(newValue)
        setVolume(newValue / 100)
    }

    const handleVolumeSliderShow = () => {
        setShowVolumeSlider(true)
    }

    const handleVolumeSliderHide = () => {
        setShowVolumeSlider(false)
    }

    const handleSeekChange = (event, newValue) => {
        seek(newValue)
    }

    const seekForward = () => {
        const newPosition = getPosition() + 15
        seek(newPosition)
    }

    const seekBackward = () => {
        const newPosition = getPosition() - 15
        seek(newPosition)
    }

    return (
        <div className="flex items-center space-x-2 p-2 bg-gray-200">
            <FastRewind onClick={seekBackward} />
            {isPlaying ? (
                <Pause onClick={handlePlayPause} />
            ) : (
                <PlayArrow onClick={handlePlayPause} />
            )}
            <FastForward onClick={seekForward} />

            <CustomSlider
        min={0}
        max={100} // 假设最大值是100
        value={progress}
        onChange={(newValue) => {
          setProgress(newValue)
          seek(newValue)
        }}
      />

      {/* 音量控制 */}
      <Slider
        ref={volumeSliderRef}
        className={`w-2 h-10 absolute ${showVolumeSlider ? 'w-24 h-8' : ''}`}
        value={volume} orientation="vertical" 
        onChange={handleVolumeChange}
        onMouseEnter={handleVolumeSliderShow}
        onMouseLeave={handleVolumeSliderHide}
        aria-labelledby="continuous-slider"
        />
    </div>
    )
}

export default AudioPlayer
