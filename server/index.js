require('dotenv').config()
const express = require("express")
const authRouter = require("./routes/auth")
const app = express()

app.use(express.json())
app.use("/api/auth", authRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
