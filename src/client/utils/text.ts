export const copyTextToClipboard = (value: string): Promise<void> => {
  return navigator.clipboard.writeText(value)
}
