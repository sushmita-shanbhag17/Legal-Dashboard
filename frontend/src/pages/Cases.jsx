import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Search, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import '../components/DataTable.css';

const Cases = () => {
    const [data, setData] = useState([]);
    const [clients, setClients] = useState([]);
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
                (item.type?.toLowerCase().includes(searchStr)) ||
                (item.clientId?.name?.toLowerCase().includes(searchStr));

            const matchesStatus = statusFilter === '' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [data, searchTerm, statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [casesRes, clientsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/cases'),
                axios.get('http://localhost:5000/api/clients')
            ]);
            setData(casesRes.data);
            setClients(clientsRes.data);
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
        if (!window.confirm('Are you sure you want to delete this case?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/cases/${id}`);
            fetchData();
        } catch (err) {
            console.error('Failed to delete case', err);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/cases/${editingItem._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/cases', formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
        } catch (err) {
            console.error('Failed to save case', err);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem({ ...item, clientId: item.clientId?._id || item.clientId });
        } else {
            setEditingItem(null);
        }
        setIsModalOpen(true);
    };

    const formFields = [
        { name: 'title', label: 'Case Title', type: 'text', required: true },
        {
            name: 'clientId',
            label: 'Client',
            type: 'select',
            required: true,
            options: clients.map(c => ({ value: c._id, label: c.name }))
        },
        {
            name: 'type',
            label: 'Case Type',
            type: 'select',
            required: false,
            options: [
                { value: 'Litigation', label: 'Litigation' },
                { value: 'Corporate', label: 'Corporate' },
                { value: 'Real Estate', label: 'Real Estate' },
                { value: 'Family', label: 'Family' }
            ]
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: false,
            options: [
                { value: 'Open', label: 'Open' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Closed', label: 'Closed' }
            ]
        }
    ];

    return (
        <div className="dashboard animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Legal Cases</h1>
                    <p className="subtitle">View all recorded cases in the firm.</p>
                </div>
                <button className="primary-btn add-btn" onClick={() => openModal()}>
                    <Plus size={18} /> Add Case
                </button>
            </header>
            <div className="card table-card">
                {loading ? (
                    <div className="empty-state">Loading cases...</div>
                ) : (
                    <div className="data-table-wrapper">
                        <div className="table-controls">
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search Cases..."
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
                            type="cases"
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
                title={editingItem ? "Edit Case" : "Add New Case"}
                fields={formFields}
                initialData={editingItem}
            />
        </div>
    );
};

export default Cases;
