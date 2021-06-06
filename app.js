const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000
const webhookRouter = require("./routes/webhook.route")
app.use(bodyParser.json())
app.use("/webhook", webhookRouter)
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port port!`))