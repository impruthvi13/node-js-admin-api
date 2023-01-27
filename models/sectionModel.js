const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter the name']
    },
    icon: {
      type: String,
      required: [true, 'Please enter the icon']
    },
    image: String,
    icon_type: {
      type: String,
      default: 'font-awesome'
    },
    sequence: {
      type: Number,
      default: 1
    },
    is_active: {
      type: Boolean,
      default: true,
      select: false
    }
  },
  { timestamps: true }
);

const Section = mongoose.model('section', sectionSchema);
module.exports = Section;
