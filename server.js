const express = require('express')
const router = express.Router()
const path = require('path')

const app = express()

router.use(express.static(path.join(__dirname, 'build')))
router.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.use('/', router)

app.listen(process.env.PORT || 3000)
console.log(`App listening on port ${process.env.PORT || 3000}`)
