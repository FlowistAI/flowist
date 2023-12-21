import React, {  MouseEventHandler } from 'react'

interface CustomSliderProps {
    min: number
    max: number
    value: number
    onChange: (value: number) => void
    orientation?: 'horizontal' | 'vertical'
}

const CustomSlider: React.FC<CustomSliderProps> = ({ min, max, value, onChange, orientation = 'horizontal' }) => {
    const fillPercentage = ((value - min) / (max - min)) * 100
    console.log(fillPercentage)
    

    const handleSliderChange = (e: MouseEventHandler<HTMLDivElement>) => {
        
        const newValue = orientation === 'vertical'
            ? max - (value - e.target.offsetTop) / e.target.offsetHeight * (max - min)
            : (value - e.target.offsetLeft) / e.target.offsetWidth * (max - min)
        onChange(newValue)
    }

  return (
    <div
      className={`relative ${orientation === 'vertical' ? 'h-24' : 'w-full'}`}
      style={
        {
          marginLeft: orientation === 'vertical' ? '8px' : '',

        }
      }
      onClick={handleSliderChange}
    >
      <div
        className={`absolute ${orientation === 'vertical' ? 'h-full left-1/2 ' : 'w-full top-1/2 -translate-y-1/2'}`}
        style={{
          background: 'grey',
          height: orientation === 'vertical' ? '100%' : '2px',
          width: orientation === 'vertical' ? '3px' : '100%',
        }}
      />
      <div
        className={`absolute ${orientation === 'vertical' ? 'bottom-0 mb-1' : 'left-0 ml-1'}`}
        style={{
          background: 'blue',
          height: orientation === 'vertical' ? `${fillPercentage}%` : '2px',
          width: orientation === 'vertical' ? '3px' : `${fillPercentage}%`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: `${fillPercentage}%`,
          transform: 'translateX(-50%)',
          marginTop: orientation === 'vertical' ? '' : '-7px',
          marginBottom: orientation === 'vertical' ? '-7px' : '',
          top: orientation === 'vertical' ? '' : '50%',
          bottom: orientation === 'vertical' ? '0' : '',
        }}
      >
        <div
          className="w-4 h-4 bg-white border border-gray-400 rounded-full cursor-pointer relative"
          style={{
            transform: orientation === 'vertical' ? `translate(0%, ${fillPercentage}%` : 'translateY(0%)',
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}

export default CustomSlider
