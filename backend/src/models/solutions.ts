import mongoose, { Schema } from 'mongoose'

const solutionSchema = new mongoose.Schema({
  problemId: {
    type: Schema.Types.ObjectId,
    ref: 'Problem',
    required: [true, 'Problem Name is required'],
  },
  solutions: {
    type: [String],
    required: [true, 'Solutions are required'],
  },
})

const Solution = mongoose.model('Solution', solutionSchema)
export default Solution
