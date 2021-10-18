/* */
import React from 'react'
import cx from 'classnames'

interface Props {
  height?: number | string
  width?: number | string
  color?: string
  radius?: number
}

const Loading = (props: Props) => {
  const { width = 80, height = 80, color = 'black', radius = 1 } = props

  return (
    <svg
      width={width}
      height={height}
      viewBox='0 0 38 38'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <linearGradient x1='8.042%' y1='0%' x2='65.682%' y2='23.865%' id='a'>
          <stop stopColor={color} stopOpacity='0' offset='0%' />
          <stop stopColor={color} stopOpacity='.631' offset='63.146%' />
          <stop stopColor={color} offset='100%' />
        </linearGradient>
      </defs>
      <g fill='none' fillRule='evenodd'>
        <g transform='translate(1 1)'>
          <path
            d='M36 18c0-9.94-8.06-18-18-18'
            id='Oval-2'
            stroke={color}
            strokeWidth='2'
          >
            <animateTransform
              attributeName='transform'
              type='rotate'
              from='0 18 18'
              to='360 18 18'
              dur='0.9s'
              repeatCount='indefinite'
            />
          </path>
          <circle fill='#fff' cx='36' cy='18' r={radius}>
            <animateTransform
              attributeName='transform'
              type='rotate'
              from='0 18 18'
              to='360 18 18'
              dur='0.9s'
              repeatCount='indefinite'
            />
          </circle>
        </g>
      </g>
    </svg>
  )
}

export default Loading
