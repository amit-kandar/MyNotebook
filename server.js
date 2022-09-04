const connectToMongo = require('./db');
const express = require('express')
let cors = require('cors') 
const app = express()
const port = 5000

connectToMongo()

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routers/auth'))
app.use('/api/notes', require('./routers/notes'))


app.listen(port, () => {
  console.log(`app listing at http://localhost:${port}`)
})