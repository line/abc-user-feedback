import * as fs from 'fs'

export const checkFileExists = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.constants.F_OK, (error) => {
      resolve(!error)
    })
  })
}
