const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const packageJson = require('./package.json')

const app = express()

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
    let result = data.replace(/window\.REACT_APP_APP_TYPE=""/, `window.REACT_APP_APP_TYPE="${process.env.REACT_APP_APP_TYPE}"`)
                     .replace(/window\.REACT_APP_VERSION=""/, `window.REACT_APP_VERSION="${packageJson.version}"`)
                     .replace(/window\.REACT_APP_APP_TITLE=""/, `window.REACT_APP_VERSION="${process.env.REACT_APP_TITLE}"`)
                     .replace(/Aboveboard Development/, process.env.REACT_APP_TITLE.replace(/"/g, '') || 'Aboveboard')

    if (process.env.REACT_APP_BRANDING) {
      result = result.replace(/\/favicon.png/, `/favicon-${process.env.REACT_APP_BRANDING}.png`)
                     .replace(/window\.REACT_APP_BRANDING=""/, `window.REACT_APP_BRANDING="${process.env.REACT_APP_BRANDING || ''}"`)
    }

    fs.writeFileSync('./build/index.html', result, 'utf8')
  } catch (err) {
    console.log(`Error setting REACT_APP_APP_TYPE, ${err}`)
  }
}

app.listen(process.env.PORT || 3000)
console.log(`${process.env.REACT_APP_APP_TYPE} app listening on port ${process.env.PORT || 3000}`)
