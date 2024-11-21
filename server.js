const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")
const express = require("express")
const app = express()
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URI).catch((error) => {
  console.error("MongoDB connection error:", error)
})

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
app.use(cors())
app.use(express.json())

const testJWTRouter = require("./controllers/test-jwt")
const usersRouter = require("./controllers/usersController")
const profilesRouter = require("./controllers/profiles")
const capsulesRouter = require("./controllers/capsulesController")
const itemsRouter = require("./controllers/itemsController")

app.use("/test-jwt", testJWTRouter)
app.use("/users", usersRouter)
app.use("/profiles", profilesRouter)
app.use("/capsules", capsulesRouter)
app.use("/items", itemsRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`The express app is running on port ${PORT}!`)
})
