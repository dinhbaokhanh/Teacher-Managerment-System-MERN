import express from 'express'
import TeacherPosition from '../models/TeacherPosition.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const positions = await TeacherPosition.find()
    res.json(positions)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
})

router.post('/', async (req, res) => {
  try {
    const { name, code, des } = req.body

    if (await TeacherPosition.findOne({ code })) {
      return res.status(400).json({ message: 'Code vị trí đã tồn tại' })
    }

    const newPosition = new TeacherPosition({ name, code, des })
    await newPosition.save()
    res.status(201).json(newPosition)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error })
  }
})

export default router
