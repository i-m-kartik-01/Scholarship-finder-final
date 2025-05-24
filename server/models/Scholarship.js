import mongoose from 'mongoose';

const ScholarshipSchema = new mongoose.Schema({
  name: String,
  amount: String,
  deadline: String,
  link: String,
  source: String
});

export default mongoose.model('Scholarship', ScholarshipSchema);