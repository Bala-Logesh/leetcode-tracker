import mongoose from 'mongoose'
import logger from '../logger/logger'

const connectToDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }

    const uri = process.env.MONGODB_URI || ''

    const conn = await mongoose.connect(uri, options)
    logger.info(`MongoDB connected: ${conn.connection.host}`)

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected. Attempting reconnect...')
    })
  } catch (error: any) {
    logger.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectToDB
