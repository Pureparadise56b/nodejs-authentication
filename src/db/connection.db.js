import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDb = async () => {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    )
    console.log('\nMongo Database Connected...')
    console.log('Connected Host: ', response.connection.host)
  } catch (error) {
    console.error('Mongo Connection Error: ', error.message)
    process.exit(1)
  }
}

export { connectDb }
