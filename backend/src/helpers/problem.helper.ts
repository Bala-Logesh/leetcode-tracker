export const checkDuplicateError = (err: any): string => {
  let errMsg = ''

  if (err.name === 'MongoServerError' && err.code === 11000) {
    errMsg = (err.errmsg as string) || ''

    if (err.codeName === 'DuplicateKey') {
      const duplicateFields = Object.keys(err.keyValue)
      const fieldName = duplicateFields[0]
      const value = err.keyValue[fieldName]
      errMsg = `Problem with ${fieldName} = '${value}' already exists`
    }
  }

  return errMsg
}
