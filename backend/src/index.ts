import express from 'express'
import cors from 'cors'

import tagsRouter from './router/tags'
import { notFound } from './middlewares/notFound'
import { errorHandler } from './middlewares/errorHandler'

require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/tags', tagsRouter)

// Route not found middleware
app.use(notFound)

// Error handler middleware
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started at http://127.0.0.1:${PORT}`)
})
