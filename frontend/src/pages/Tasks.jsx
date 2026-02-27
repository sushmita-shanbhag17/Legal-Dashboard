import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Plus, Search, Filter } from 'lucide-react';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import '../components/DataTable.css';

const Tasks = () => {
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
                (item.description?.toLowerCase().includes(searchStr)) ||
                (item.caseId?.title?.toLowerCase().includes(searchStr));

            const matchesStatus = statusFilter === '' || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [data, searchTerm, statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksRes, casesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/tasks'),
                axios.get('http://localhost:5000/api/cases')
            ]);
            setData(tasksRes.data);
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
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            fetchData();
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingItem) {
                await axios.put(`http://localhost:5000/api/tasks/${editingItem._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/tasks', formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchData();
        } catch (err) {
            console.error('Failed to save task', err);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            // Need to convert date format for input type="date"
            const dateStr = item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '';
            setEditingItem({ ...item, caseId: item.caseId?._id || item.caseId, dueDate: dateStr });
        } else {
            setEditingItem(null);
        }
        setIsModalOpen(true);
    };

    const formFields = [
        { name: 'description', label: 'Task Description', type: 'text', required: true },
        {
            name: 'caseId',
            label: 'Related Case',
            type: 'select',
            required: true,
            options: cases.map(c => ({ value: c._id, label: c.title }))
        },
        {
            name: 'dueDate',
            label: 'Due Date',
            type: 'date',
            required: true
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: false,
            options: [
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' }
            ]
        }
    ];

    return (
        <div className="dashboard animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Tasks & Milestones</h1>
                    <p className="subtitle">View all pending and ongoing tasks.</p>
                </div>
                <button className="primary-btn add-btn" onClick={() => openModal()}>
                    <Plus size={18} /> Add Task
                </button>
            </header>
            <div className="card table-card">
                {loading ? (
                    <div className="empty-state">Loading tasks...</div>
                ) : (
                    <div className="data-table-wrapper">
                        <div className="table-controls">
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search Tasks..."
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
                            type="tasks"
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
                title={editingItem ? "Edit Task" : "Add New Task"}
                fields={formFields}
                initialData={editingItem}
            />
        </div>
    );
};

export default Tasks;
