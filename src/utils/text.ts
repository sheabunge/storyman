export const printTable = (data: string[][], printRow?: (row: string) => void): void => {
  const columnSizes = data.reduce(
    (sizes, row) => row.map((cell, index) => Math.max(sizes[index] || 0, cell.length)),
    [] as number[]
  )

  for (const row of data) {
    const output = row
      .map((col, index) => col + ' '.repeat(columnSizes[index] - col.length))
      .join(' ')

    printRow(output)
  }
}
