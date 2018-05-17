export const readFile = (file) => {
	new Promise((resolve, reject) => {
		if(!window.FileReader) {
			reject('The browser is not supporting files!')
			return
		}

    const reader = new FileReader()

    reader.onload = function(evt) {
      if(evt.target.error || evt.target.readyState !== 2) {
      	console.error(evt.target.error)
				reject('Failed to read the file!')
      }
      resolve(evt.target.result)
    }

    reader.readAsText(file)
	})
}