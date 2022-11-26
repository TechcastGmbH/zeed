import { isArray, isBoolean, isRecord, jsonStringifySafe } from './data'

const defaultSeparator = ','

export function csvStringify(data: any[], opt: {
  // header?: string[]
  separator?: string
} = {}): string {
  const { separator = defaultSeparator } = opt
  let body = ''

  // Append the header row to the response if requested
  // if (header)
  //   body = `${header.join(separator)}\n`

  // Convert the data to a CSV-like structure
  for (let i = 0; i < data.length; i++) {
    body += `${data[i].map((field: string) => {
      if (field == null || field === '')
        return ''
      if (isBoolean(field))
        return field ? 1 : 0
      let s = String(field)
      if (isRecord(field) || isArray(field))
        s = jsonStringifySafe(field)
      if (s.includes('"') || s.includes('\n') || s.includes(separator))
        return `"${s.replace(/"/g, '""')}"`
      return s
    }).join(separator)}\n`
  }

  return body
}

export function csvParse(raw: string, opt: {
  separator?: string
} = {}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { separator = defaultSeparator } = opt

  // https://regex101.com/r/BCpKyV/1
  const rxOneValueWithSeparator = /("((?:(?:[^"]*?)(?:"")?)*)"|([^,;\t\n]*))([,;\t]|\n|\r\n)/g

  const lines: any[][] = []
  let row: any[] = []
  let m: any

  const text = `${raw.replaceAll('\r\n', '\n').trim()}\n`

  // eslint-disable-next-line no-cond-assign
  while (m = rxOneValueWithSeparator.exec(text)) {
    let value = m[2] ?? m[3] ?? ''
    value = value.replaceAll('""', '"')
    row.push(value)
    if (m[4] === '\n') {
      lines.push(row)
      row = []
    }
  }
  return lines
}
