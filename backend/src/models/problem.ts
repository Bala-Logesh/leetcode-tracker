import mongoose, { InferSchemaType, Schema } from 'mongoose'

const problemSchema = new mongoose.Schema({
  problemNo: {
    type: Number,
    required: [true, 'Problem Number is required'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Problem name is required'],
    unique: true,
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: [true, 'Tags are required'],
    },
  ],
  solutions: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Solution',
        required: [true, 'Solution is required'],
      },
    ],
  },
  pointsToRemember: {
    type: Schema.Types.ObjectId,
    ref: 'Solution',
  },
  dpPoints: {
    type: Schema.Types.ObjectId,
    ref: 'Solution',
  },
  datesAttempted: {
    type: [String],
  },
})

export type IProblem = InferSchemaType<typeof problemSchema>

const Problem = mongoose.model('Problem', problemSchema)
export default Problem
