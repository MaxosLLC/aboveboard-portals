const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const app = express()

app.use((req, res, next) => {
	const { ALLOWED_IPS } = process.env

	if (ALLOWED_IPS) {
		const ipCandidates = (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress)
				.split(',')[0]
				.split(':')
		const ip = ipCandidates[ipCandidates.length - 1]
		req.ip = ip

		const ips = ALLOWED_IPS ? ALLOWED_IPS.split(' ').filter( i => !!i ) : []

		if (ips.length > 0 && ips.indexOf(ip) < 0) {
			res.status(403).send(`Your IP is not allowed!
				IP: ${ip}
				Please use AboveBoard VPN provided.`)
			return
		}
	}
	next()
})

router.use(express.static(path.join(__dirname, 'build')))
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.use('/', router)

// Fix REACT_APP_APP_TYPE
if (process.env.REACT_APP_APP_TYPE) {
  try {
    const data = fs.readFileSync('./build/index.html', 'utf8')

    // Inject REACT_APP_APP_TYPE
    const result = data.replace(/window\.REACT_APP_APP_TYPE=\"\"/, `window.REACT_APP_APP_TYPE="${process.env.REACT_APP_APP_TYPE}"`)

    fs.writeFileSync('./build/index.html', result, 'utf8')
  }
  catch (err) {
    console.log(`Error setting REACT_APP_APP_TYPE, ${err}`)
  }
}

app.listen(process.env.PORT || 3000)
console.log(`${process.env.REACT_APP_APP_TYPE} app listening on port ${process.env.PORT || 3000}`)