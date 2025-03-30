import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    code: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, 'Mã giáo viên phải có đúng 10 chữ số'],
      trim: true,
    },
    startDate: { type: Date, required: true },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.startDate
        },
        message: 'endDate phải lớn hơn hoặc bằng startDate',
      },
    },
    teacherPositions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherPosition' },
    ],
    degrees: [
      {
        degreeType: { type: String, required: true, trim: true },
        school: { type: String, required: true, trim: true },
        major: { type: String, required: true, trim: true },
        year: { type: Number, required: true, min: 1900 },
        isGraduated: { type: Boolean, required: true },
      },
    ],
  },
  { timestamps: true }
)

const Teacher = mongoose.model('Teacher', teacherSchema)
export default Teacher
