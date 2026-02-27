const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    type: { type: String, enum: ['Litigation', 'Corporate', 'Real Estate', 'Family'], default: 'Litigation' },
    status: { type: String, enum: ['Open', 'In Progress', 'Closed'], default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);
