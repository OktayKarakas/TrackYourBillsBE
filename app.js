require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const billsRouter = require('./routes/bills')
const connectDB = require('./db/connect')
const auth = require('./middleware/authentication')

//extra security packages
app.set('trust proxy', 1)
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
// extra packages

// routes

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/bills', auth, billsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    )
  } catch (error) {
    console.log(error)
  }
}

start()
