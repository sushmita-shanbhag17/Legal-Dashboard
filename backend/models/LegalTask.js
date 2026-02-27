const mongoose = require('mongoose');

const LegalTaskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LegalTask', LegalTaskSchema);
