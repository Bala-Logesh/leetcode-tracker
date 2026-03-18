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

const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s-]+/g, '_')
}

tagSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name)
  }
})

tagSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate() as any

  if (update.$setOnInsert && update.$setOnInsert.name) {
    update.$setOnInsert.slug = slugify(update.$setOnInsert.name)
  } else if (update.name) {
    update.slug = slugify(update.name)
  }
})

tagSchema.pre('insertMany', function (docs) {
  docs.forEach((doc: any) => {
    if (doc.name) {
      doc.slug = slugify(doc.name)
    }
  })
})

const Tag = mongoose.model('Tag', tagSchema)
export default Tag
