import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { DATA_LIMIT } from './constants.js'

const app = express()

app.use(express.json({ limit: DATA_LIMIT }))
app.use(express.urlencoded({ extended: true, limit: DATA_LIMIT }))
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
)

// ROUTES

export { app }
