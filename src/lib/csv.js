import CSV from 'csvtojson'

export const csvToJson = (str, isHeader = true) => {
	return new Promise((resolve, reject) => {
		const rows = []
		CSV({noheader: !isHeader})
			.fromString(str)
			.on('csv',(csvRow)=>{
				rows.push(csvRow)
			})
			.on('done',()=>{
				resolve(rows)
			})
	})
}
