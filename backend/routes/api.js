const express = require('express');
const router = express.Router();

const Client = require('../models/Client');
const Case = require('../models/Case');
const Document = require('../models/Document');
const LegalTask = require('../models/LegalTask');

// Get Dashboard Stats
router.get('/dashboard/stats', async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const totalCases = await Case.countDocuments();
        const totalDocuments = await Document.countDocuments();
        const totalTasks = await LegalTask.countDocuments();

        // Aggregation for Document Status
        const documentStatus = await Document.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Aggregation for Case Types
        const caseTypes = await Case.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        const taskStatus = await LegalTask.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const caseStatus = await Case.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Format Data for Recharts
        const docsData = documentStatus.map(d => ({ name: d._id, value: d.count }));
        const casesData = caseTypes.map(c => ({ name: c._id, value: c.count }));
        const tasksData = taskStatus.map(t => ({ name: t._id, value: t.count }));
        const casesStatusData = caseStatus.map(c => ({ name: c._id, value: c.count }));

        res.json({
            overview: { totalClients, totalCases, totalDocuments, totalTasks },
            documentStatus: docsData,
            caseTypes: casesData,
            taskStatus: tasksData,
            caseStatus: casesStatusData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get recent collections data for tables
router.get('/cases/recent', async (req, res) => {
    try {
        const recentCases = await Case.find().populate('clientId').sort({ createdAt: -1 }).limit(10);
        res.json(recentCases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/tasks/recent', async (req, res) => {
    try {
        const recentTasks = await LegalTask.find().populate('caseId').sort({ dueDate: 1 }).limit(10);
        res.json(recentTasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/documents/recent', async (req, res) => {
    try {
        const recentDocs = await Document.find().populate('caseId').sort({ uploadDate: -1 }).limit(10);
        res.json(recentDocs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Additional endpoints for pages
router.get('/cases', async (req, res) => {
    try {
        const cases = await Case.find().populate('clientId').sort({ createdAt: -1 });
        res.json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/clients', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/documents', async (req, res) => {
    try {
        const docs = await Document.find().populate('caseId').sort({ uploadDate: -1 });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await LegalTask.find().populate('caseId').sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CRUD for Cases ---
router.post('/cases', async (req, res) => {
    try {
        const newCase = await Case.create(req.body);
        const populatedCase = await Case.findById(newCase._id).populate('clientId');
        res.status(201).json(populatedCase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/cases/:id', async (req, res) => {
    try {
        const updatedCase = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('clientId');
        res.json(updatedCase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/cases/:id', async (req, res) => {
    try {
        await Case.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// --- CRUD for Clients ---
router.post('/clients', async (req, res) => {
    try {
        const newClient = await Client.create(req.body);
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/clients/:id', async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/clients/:id', async (req, res) => {
    try {
        await Client.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// --- CRUD for Documents ---
router.post('/documents', async (req, res) => {
    try {
        const newDoc = await Document.create(req.body);
        const populatedDoc = await Document.findById(newDoc._id).populate('caseId');
        res.status(201).json(populatedDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/documents/:id', async (req, res) => {
    try {
        const updatedDoc = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('caseId');
        res.json(updatedDoc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/documents/:id', async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// --- CRUD for Tasks ---
router.post('/tasks', async (req, res) => {
    try {
        const newTask = await LegalTask.create(req.body);
        const populatedTask = await LegalTask.findById(newTask._id).populate('caseId');
        res.status(201).json(populatedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await LegalTask.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('caseId');
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        await LegalTask.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
