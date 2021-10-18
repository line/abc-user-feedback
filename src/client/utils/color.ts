export const generateHexColorFromText = (str: string = ''): string => {
  if (!str) {
    return '#FFF'
  }

  let hash = 0
  const length = str.length

  if (!length) {
    return '#FFF'
  }

  for (let i = 0; i < length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
    hash = hash & hash
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255
    color += ('00' + value.toString(16)).substr(-2)
  }

  return color
}
