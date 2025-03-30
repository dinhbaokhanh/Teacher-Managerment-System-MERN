import mongoose from 'mongoose'

const teacherPositionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    code: { type: String, required: true, unique: true, trim: true },
    des: { type: String, trim: true, maxlength: 500 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const TeacherPosition = mongoose.model('TeacherPosition', teacherPositionSchema)
export default TeacherPosition
