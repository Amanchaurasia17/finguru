
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  phone: String,
  riskAppetite: String,
  transactionsJson: { type: String },
  classifiedTransactions: Array,
  monthlyIncome: {
  type: Number,
  default: 0,
},
savingsTargetAmount: {
  type: Number,
  default: 0,
},

  // Add tax-related fields
  taxData: {
    salaryIncome: { type: Number, default: 0 },
    businessIncome: { type: Number, default: 0 },
    otherIncome: { type: Number, default: 0 },
    investment80C: { type: Number, default: 0 },
    healthInsurance80D: { type: Number, default: 0 },
    educationLoan80E: { type: Number, default: 0 },
    homeLoanInterest: { type: Number, default: 0 },
    rentPaid: { type: Number, default: 0 }
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

