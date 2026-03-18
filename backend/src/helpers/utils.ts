export const checkDate = (datesAttempted: string): boolean => {
  const dateRegex =
    /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4} ([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/

  return dateRegex.test(datesAttempted)
}
