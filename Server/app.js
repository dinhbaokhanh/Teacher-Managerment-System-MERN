import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import teacherRoutes from './routes/teacherRoutes.js'
import teacherPositionRoutes from './routes/teacherPositionRoutes.js'
import cors from 'cors'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/teachers', teacherRoutes)
app.use('/api/teacher-positions', teacherPositionRoutes)

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((error) => console.error('Database connection failed', error))
