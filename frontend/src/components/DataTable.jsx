import { useMemo } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './DataTable.css';

const DataTable = ({ data, type, onEdit, onDelete }) => {

    // Format Date Helper
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Status Badge Helper
    const getStatusBadge = (status) => {
        let statusClass = 'status-default';
        if (status === 'Closed' || status === 'Approved' || status === 'Completed') statusClass = 'status-success';
        if (status === 'In Progress' || status === 'Reviewed') statusClass = 'status-info';
        if (status === 'Open' || status === 'Pending') statusClass = 'status-warning';

        return <span className={`status-badge ${statusClass}`}>{status}</span>;
    };

    const uniqueStatuses = useMemo(() => {
        if (!data) return [];
        const statuses = data.map(item => item.status).filter(Boolean);
        return [...new Set(statuses)];
    }, [data]);

    if (!data || data.length === 0) {
        return <div className="empty-state">No active records found.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        {type === 'cases' && <th>Client</th>}
                        <th>Status</th>
                        <th>Type/Date</th>
                        {(onEdit || onDelete) && <th className="actions-header">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={onEdit || onDelete ? 5 : 4} className="empty-state">
                                No records match your search.
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr key={item._id} className="table-row">
                                <td>
                                    <div className="cell-primary">
                                        {item.title || item.description || item.name}
                                    </div>
                                    <div className="cell-secondary">ID: {item._id.substring(0, 8)}...</div>
                                </td>

                                {type === 'cases' && (
                                    <td>
                                        <div className="client-info">
                                            {item.clientId?.name || 'Unknown Client'}
                                        </div>
                                    </td>
                                )}

                                <td>{getStatusBadge(item.status)}</td>

                                <td>
                                    <div className="cell-date">
                                        {type === 'cases' ? item.type : formatDate(item.dueDate || item.uploadDate || item.createdAt)}
                                    </div>
                                </td>

                                {(onEdit || onDelete) && (
                                    <td className="table-actions">
                                        {onEdit && (
                                            <button className="action-btn edit-btn" onClick={() => onEdit(item)} title="Edit">
                                                <Edit size={16} />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button className="action-btn delete-btn" onClick={() => onDelete(item._id)} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
