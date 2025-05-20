const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000

// middleware
app.use(cors());
app.use(express.json())



// curd operation start from here

app.get('/', (req, res) => {
  res.send('Hello World! this is from green hub')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
