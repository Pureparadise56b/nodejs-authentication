import express from 'express'
import {
  handleUserSignUp,
  handleUserLogin,
  handleUserLogout,
  getCurrentUser,
} from '../controllers/user.controller.js'
import { JwtVerify } from '../middlewares/auth.middlerware.js'

const router = express.Router()

router.route('/signup').post(handleUserSignUp)
router.route('/login').post(handleUserLogin)
router.route('/logout').post(JwtVerify, handleUserLogout)
router.route('/fetch').get(JwtVerify, getCurrentUser)

export default router
