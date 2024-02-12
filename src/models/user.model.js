import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    accountActivation: {
      type: Boolean,
      required: true,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: 'USER',
    },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', userSchema)

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) next()

    const saltString = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(this.password, saltString)

    this.password = hashedPassword
    this.salt = saltString
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return JWT.sign(
    {
      id: this._id,
      username: this.username,
      email: this.email,
      profile: this.profileImage,
      role: this.role,
      account_activation: this.accountActivation,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return JWT.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
}
