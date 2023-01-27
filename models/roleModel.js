const mongoose = require('mongoose');
const Section = require('./sectionModel');

const roleSchema = new mongoose.Schema(
  {
    section_id: {
      type: mongoose.Schema.ObjectId,
      ref: Section
    },
    title: {
      type: String,
      required: [true, 'Please enter the title']
    },
    route: String,
    params: String,
    image: String,
    icon_type: {
      type: String,
      default: 'font-awesome'
    },
    allowed_permissions: String,
    sequence: {
      type: Number,
      default: 1
    },
    is_display: {
      type: Boolean,
      default: true
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Role = mongoose.model('role', roleSchema);
module.exports = Role;
