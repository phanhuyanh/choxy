const express = require('express')
const app = express()
const PORT = process.env.PORT || 7777
const path = require('path')

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => console.log(`Server is running at http:localhost:${PORT}`))