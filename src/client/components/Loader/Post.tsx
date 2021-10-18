/* */
import React from 'react'
import ContentLoader from 'react-content-loader'

const WIDTH = 375
const HEIGHT = 55
const MARGIN = 0

interface RowProps {
  index: number
}

interface Props {
  rows?: number
}

const Row = (props: RowProps) => {
  const { index } = props

  return (
    <>
      <rect
        x='0'
        y={(HEIGHT + MARGIN) * index}
        rx='3'
        ry='3'
        width='40'
        height='40'
      />
      <rect
        x='50'
        y={(HEIGHT + MARGIN) * index}
        rx='3'
        ry='3'
        width='100%'
        height='12'
      />
      <rect
        x='50'
        y={(HEIGHT + MARGIN) * index + 10}
        rx='8'
        ry='8'
        width='100%'
        height='40'
      />
    </>
  )
}

const PostLoader = (props: Props) => {
  const { rows = 1 } = props

  return (
    <ContentLoader
      viewBox={`0 0 ${WIDTH} ${HEIGHT * rows}`}
      speed={4}
      title=''
      backgroundColor='#fff'
      foregroundColor='rgb(240, 242, 245)'
    >
      {new Array(rows)
        .fill(Row)
        .map((item, index) => React.createElement(item, { key: index, index }))}
    </ContentLoader>
  )
}

export default PostLoader
