import mongoose from 'mongoose'
import config from 'config'
import log from './logger'

const connectDB = async () => {
  const dbUrl = config.get<string>('dbUrl')
  try {
    await mongoose.connect(dbUrl)

    log.info('Connected to the database')
  } catch (error) {
    log.error('Could not connect to the database')
    process.exit(1)
  }
}

export default connectDB
