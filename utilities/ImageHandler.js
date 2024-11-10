export const mimeTypeToExtension = mimeType => {
  const mimeMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
  }

  return mimeMap[mimeType] || 'bin'
}

export const base64ToBlob = (base64Str, type = 'application/octet-stream') => {
  // Decode base64 string.
  const byteCharacters = atob(base64Str)

  // Set byte numbers array.
  const byteNumbers = new Array(byteCharacters.length)

  // Convert characters to byte numbers.
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  // Create a byte array.
  const byteArray = new Uint8Array(byteNumbers)

  // Create a blob from the byte array.
  return new Blob([byteArray], { type })
}

export const base64ToFile = base64Str => {
  // Split metadata from base64.
  const [metadata, base64] = base64Str.split(',')

  // Extract MIME type.
  const mimeType = metadata.match(/:(.*?);/)[1]
  const extension = mimeTypeToExtension(mimeType)

  // Convert base64 to bob.
  const blob = base64ToBlob(base64, mimeType)

  // Create the file name.
  const fileName = `file.${extension}`

  // Create a File object.
  return new File([blob], fileName, { type: mimeType })
}