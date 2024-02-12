import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI)
    console.log('\nMongo Database Connected...')
    console.log('Connected Host: ', response.connection.host)
  } catch (error) {
    console.error('Mongo Connection Error: ', error.message)
  }
}

export { connectDb }
