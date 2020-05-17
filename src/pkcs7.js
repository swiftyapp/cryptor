
export const pad = (data, size = 16) => {
  let out = data
  const padLen = size - data.length % size
  const padChar = String.fromCharCode(padLen)
  for (let i = 0; i < padLen; i++) {
    out += padChar
  }
  return out
}

export const unpad = (data) => {
  let out = data
  const padLen = data.charCodeAt(data.length - 1)
  let i, end
  for (i = data.length - 2, end = data.length - padLen; i >= end; i--) {
    if (data.charCodeAt(i) !== padLen) {
      end = data.length
      throw new Error('unpad(): found a padding byte of ' + data.charCodeAt(i) +
        ' instead of ' + padLen + ' at position ' + i)
    }
  }
  out = data.substring(0, end)
  return out
}
