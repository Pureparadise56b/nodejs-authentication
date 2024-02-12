import express from 'express'
import {
  handleUserSignUp,
  handleUserLogin,
} from '../controllers/user.controller.js'

const router = express.Router()

router.route('/signup').post(handleUserSignUp)
router.route('/login').post(handleUserLogin)

export default router
