import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tag name is required'],
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

tagSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s-]+/g, '_')
  }
})

const TagModel = mongoose.model('Tag', tagSchema)
export default TagModel
