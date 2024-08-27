import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import { connectDb } from './db/connection.db.js'
import { app } from './app.js'

const port = process.env.PORT || 3000

connectDb().then(() => {
  app.listen(port, () =>
    console.log(`\nServer started: http://localhost:${port}`)
  )
})
