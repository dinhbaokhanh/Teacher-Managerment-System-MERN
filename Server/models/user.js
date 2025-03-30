import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10,11}$/, 'Số điện thoại không hợp lệ'],
    },
    address: { type: String, required: true, trim: true },
    identity: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{9,12}$/, 'Số CMND/CCCD không hợp lệ'],
    },
    dob: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['STUDENT', 'TEACHER', 'ADMIN'],
      required: true,
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User
