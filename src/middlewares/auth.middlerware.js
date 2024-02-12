import { ApiError } from '../utils/ApiError.util.js'
import { asyncHandler } from '../utils/AsyncHandler.util.js'
import { User } from '../models/user.model.js'
import JWT from 'jsonwebtoken'

const JwtVerify = asyncHandler(async (req, _, next) => {
  try {
    const accessToken = req.cookies.access_token

    if (!accessToken) {
      throw new ApiError(400, 'Unauthorised access: Login first')
    }

    const decodedData = JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedData?.id).select(
      '-password -salt -refreshToken'
    )

    if (!user) {
      throw new ApiError(400, 'Invalid access token')
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
})

export { JwtVerify }
