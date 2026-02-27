import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Search, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import '../components/DataTable.css';

const Documents = () => {
    const [data, setData] = useState([]);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const uniqueStatuses = useMemo(() => {
        if (!data) return [];
        const statuses = data.map(item => item.status).filter(Boolean);
        return [...new Set(statuses)];
    }, [data]);

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => {
            const searchStr = searchTerm.toLowerCase();
            const matchesSearch =
                (item.title?.toLowerCase().includes(searchStr)) ||
                (item.caseId?.title?.toLowerCase().includes(searchStr));

            const matchesStatus = statusFilter === '' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [data, searchTerm, statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [docsRes, casesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/documents'),
                axios.get('http://localhost:5000/api/cases')
            ]);
            setData(docsRes.data);
            setCases(casesRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/documents/${id}`);
            fetchData();
        } catch (err) {
            console.error('Failed to delete document', err);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/documents/${editingItem._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/documents', formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
        } catch (err) {
            console.error('Failed to save document', err);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem({ ...item, caseId: item.caseId?._id || item.caseId });
        } else {
            setEditingItem(null);
        }
        setIsModalOpen(true);
    };

    const formFields = [
        { name: 'title', label: 'Document Title', type: 'text', required: true },
        {
            name: 'caseId',
            label: 'Related Case',
            type: 'select',
            required: true,
            options: cases.map(c => ({ value: c._id, label: c.title }))
        },
        {
            name: 'status',
            label: 'Review Status',
            type: 'select',
            required: false,
            options: [
                { value: 'Pending', label: 'Pending' },
                { value: 'Reviewed', label: 'Reviewed' },
                { value: 'Approved', label: 'Approved' }
            ]
        }
    ];

    return (
        <div className="dashboard animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Documents</h1>
                    <p className="subtitle">View all legal documents and review statuses.</p>
                </div>
                <button className="primary-btn add-btn" onClick={() => openModal()}>
                    <Plus size={18} /> Add Document
                </button>
            </header>
            <div className="card table-card">
                {loading ? (
                    <div className="empty-state">Loading documents...</div>
                ) : (
                    <div className="data-table-wrapper">
                        <div className="table-controls">
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search Documents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {uniqueStatuses.length > 0 && (
                                <div className="filter-box">
                                    <Filter size={18} className="filter-icon" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="">All Statuses</option>
                                        {uniqueStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <DataTable
                            data={filteredData}
                            type="documents"
                            onEdit={openModal}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                title={editingItem ? "Edit Document" : "Add New Document"}
                fields={formFields}
                initialData={editingItem}
            />
        </div>
    );
};

export default Documents;
