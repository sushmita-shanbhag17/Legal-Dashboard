require('dotenv').config();
const mongoose = require('mongoose');

const Client = require('./models/Client');
const Case = require('./models/Case');
const Document = require('./models/Document');
const LegalTask = require('./models/LegalTask');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/legaltech';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB for seeding...');

        // Clear databases
        await Client.deleteMany({});
        await Case.deleteMany({});
        await Document.deleteMany({});
        await LegalTask.deleteMany({});

        const client1 = await Client.create({ name: 'Acme Corp', email: 'contact@acme.com', phone: '123-456-7890' });
        const client2 = await Client.create({ name: 'Jane Doe', email: 'jane.doe@example.com', phone: '098-765-4321' });

        const case1 = await Case.create({ title: 'Acme Merger', clientId: client1._id, type: 'Corporate', status: 'In Progress' });
        const case2 = await Case.create({ title: 'Doe Divorce', clientId: client2._id, type: 'Family', status: 'Open' });
        const case3 = await Case.create({ title: 'Real Estate Dispute', clientId: client1._id, type: 'Real Estate', status: 'Closed' });

        await Document.create([
            { title: 'Merger Agreement v1', caseId: case1._id, status: 'Reviewed' },
            { title: 'Financial Disclosures', caseId: case1._id, status: 'Approved' },
            { title: 'Pre-nuptial Agreement', caseId: case2._id, status: 'Pending' },
            { title: 'Property Deed', caseId: case3._id, status: 'Approved' }
        ]);

        await LegalTask.create([
            { description: 'Review Merger Contract', caseId: case1._id, status: 'In Progress', dueDate: new Date(Date.now() + 86400000) },
            { description: 'File Divorce Papers', caseId: case2._id, status: 'Pending', dueDate: new Date(Date.now() + 172800000) },
            { description: 'Close Escrow', caseId: case3._id, status: 'Completed', dueDate: new Date(Date.now() - 86400000) }
        ]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
