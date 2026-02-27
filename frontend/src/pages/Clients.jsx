import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import FormModal from '../components/FormModal';
import '../components/DataTable.css';

const Clients = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => {
            const searchStr = searchTerm.toLowerCase();
            return (
                (item.name?.toLowerCase().includes(searchStr)) ||
                (item.email?.toLowerCase().includes(searchStr)) ||
                (item.phone?.toLowerCase().includes(searchStr))
            );
        });
    }, [data, searchTerm]);

    const fetchClients = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/clients')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this client?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/clients/${id}`);
            fetchClients();
        } catch (err) {
            console.error('Failed to delete client', err);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/clients/${editingItem._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/clients', formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchClients();
        } catch (err) {
            console.error('Failed to save client', err);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const formFields = [
        { name: 'name', label: 'Client Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'text', required: false }
    ];

    return (
        <div className="dashboard animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Clients</h1>
                    <p className="subtitle">Manage the firm's client roster and contact information.</p>
                </div>
                <button className="primary-btn add-btn" onClick={() => openModal()}>
                    <Plus size={18} /> Add Client
                </button>
            </header>
            <div className="card table-card">
                {loading ? (
                    <div className="empty-state">Loading clients...</div>
                ) : data.length === 0 ? (
                    <div className="empty-state">No clients found.</div>
                ) : (
                    <div className="data-table-wrapper">
                        <div className="table-controls">
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search Clients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Client Name</th>
                                        <th>Email Address</th>
                                        <th>Phone Number</th>
                                        <th>Registered Date</th>
                                        <th className="actions-header">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="empty-state">
                                                No clients match your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((item) => (
                                            <tr key={item._id} className="table-row">
                                                <td>
                                                    <div className="cell-primary">{item.name}</div>
                                                    <div className="cell-secondary">ID: {item._id.substring(0, 8)}...</div>
                                                </td>
                                                <td>
                                                    <div className="client-info">{item.email}</div>
                                                </td>
                                                <td>
                                                    <div className="client-info">{item.phone || 'N/A'}</div>
                                                </td>
                                                <td>
                                                    <div className="cell-date">
                                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="table-actions">
                                                    <button className="action-btn edit-btn" onClick={() => openModal(item)} title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="action-btn delete-btn" onClick={() => handleDelete(item._id)} title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                title={editingItem ? "Edit Client" : "Add New Client"}
                fields={formFields}
                initialData={editingItem}
            />
        </div>
    );
};

export default Clients;
