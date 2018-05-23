import CSV from 'csvtojson'

export const csvToJson = (str, isHeader = true) => {
  return new Promise((resolve, reject) => {
    const rows = []
    CSV({noheader: !isHeader})
      .fromString(str)
      .on('csv', (csvRow) => {
        rows.push(csvRow)
      })
      .on('done', () => {
        resolve(rows)
      })
  })
}

export const arrayToBuyer = (arr) => {
  const fields = ['firstName', 'lastName', 'email', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'country', 'zip', 'qualifications']
  const buyer = {}

  fields.forEach((field, index) => {
    if (arr[index] !== undefined) {
      buyer[field] = arr[index]
    }
  })

  // Extract eth address from arr: after `fields` there are eth 0, eth 1, ...
  // arr 'firstName', 'lastName', ..., 'qualifications', 'eth0', 'eth1' ...
  buyer['ethAddresses'] = arr.slice(fields.length).map(eth => ({ address: eth }))

  return buyer
}
