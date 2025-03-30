import express from 'express'
import Teacher from '../models/Teacher.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import { body, validationResult } from 'express-validator'

const generateTeacherCode = async () => {
  let code
  do {
    code = Math.floor(1000000000 + Math.random() * 9000000000).toString()
  } while (await Teacher.exists({ code }))
  return code
}

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const [total, teachers] = await Promise.all([
      Teacher.countDocuments({ isDeleted: false }),
      Teacher.find({ isDeleted: false })
        .populate('userId', 'name email phoneNumber address')
        .populate('teacherPositions', 'name code')
        .select('code startDate degrees isActive')
        .skip(skip)
        .limit(Number(limit)),
    ])

    res.json({
      data: teachers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /teachers error:', error)
    res.status(500).json({ message: 'Lỗi server', error: error.message })
  }
})

router.post(
  '/',
  [
    body('userId').notEmpty().withMessage('userId là bắt buộc'),
    body('startDate').isISO8601().withMessage('Ngày không hợp lệ'),
    body('degrees').isArray().withMessage('Trình độ phải là mảng'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { userId, startDate, endDate, teacherPositions, degrees } = req.body

      const user = await User.findOne({ _id: userId, isDeleted: false })
      if (!user) return res.status(404).json({ message: 'User không tồn tại' })
      if (user.role !== 'TEACHER') {
        return res
          .status(400)
          .json({ message: 'User không có vai trò TEACHER' })
      }

      const existingTeacher = await Teacher.findOne({ userId: userId })
      if (existingTeacher) {
        return res
          .status(400)
          .json({ message: 'User đã được đăng ký làm giáo viên' })
      }

      const code = await generateTeacherCode()

      const newTeacher = new Teacher({
        userId,
        code,
        startDate,
        endDate,
        teacherPositions,
        degrees,
        isActive: true,
      })

      await newTeacher.save()
      res.status(201).json(newTeacher)
    } catch (error) {
      console.error('POST /teachers error:', error)
      res.status(500).json({ message: 'Lỗi server', error: error.message })
    }
  }
)

export default router
