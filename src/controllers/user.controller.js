import { asyncHandler } from '../utils/AsyncHandler.util.js'
import { ApiError } from '../utils/ApiError.util.js'
import { ApiResponse } from '../utils/ApiResponse.util.js'
import { User } from '../models/user.model.js'
import { options } from '../constants.js'

const generateTokens = async (id) => {
  try {
    const user = await User.findById(id)

    if (!user) {
      throw new ApiError(500, 'Invalid User Id while generating tokens')
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken

    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, 'Error while generating tokens')
  }
}

const handleUserSignUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    throw new ApiError(400, 'All fields are required')
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] })

  if (existingUser) {
    throw new ApiError(400, 'User already exist')
  }

  const user = await User.create({
    username,
    email,
    password,
  })

  if (!user) {
    throw new ApiError(500, 'Error while registering User')
  }

  res.status(200).json(new ApiResponse(200, user, 'User created successfully'))
})

const handleUserLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'All fields are required')
  }

  const existingUser = await User.findOne({ email })

  if (!existingUser) {
    throw new ApiError(400, 'User does not exist')
  }

  const isPasswordCorrect = await existingUser.matchPassword(password)

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Incorrect Password')
  }

  const { accessToken, refreshToken } = await generateTokens(existingUser?._id)

  res
    .status(200)
    .cookie('access_token', accessToken, options)
    .cookie('refresh_token', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        'User login successfully'
      )
    )
})

const handleUserLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?.id, {
    $set: {
      refreshToken: '',
    },
  })

  res
    .status(200)
    .clearCookie('access_token')
    .clearCookie('refresh_token')
    .json(new ApiResponse(200, {}, 'Logout successfully'))
})

export { handleUserSignUp, handleUserLogin, handleUserLogout }
