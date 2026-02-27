import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Briefcase, Users, FileText, CheckSquare, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import './Dashboard.css';

const API_URL = 'http://localhost:5000/api';
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentCases, setRecentCases] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerms, setSearchTerms] = useState({
        cases: '',
        tasks: ''
    });

    const filteredCases = useMemo(() => {
        if (!recentCases) return [];
        return recentCases.filter(c => {
            const s = searchTerms.cases.toLowerCase();
            return c.title?.toLowerCase().includes(s) || c.clientId?.name?.toLowerCase().includes(s);
        });
    }, [recentCases, searchTerms.cases]);

    const filteredTasks = useMemo(() => {
        if (!recentTasks) return [];
        return recentTasks.filter(t => {
            const s = searchTerms.tasks.toLowerCase();
            return t.description?.toLowerCase().includes(s) || t.caseId?.title?.toLowerCase().includes(s);
        });
    }, [recentTasks, searchTerms.tasks]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, casesRes, tasksRes] = await Promise.all([
                    axios.get(`${API_URL}/dashboard/stats`),
                    axios.get(`${API_URL}/cases/recent`),
                    axios.get(`${API_URL}/tasks/recent`)
                ]);

                setStats(statsRes.data);
                setRecentCases(casesRes.data);
                setRecentTasks(tasksRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading || !stats) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
                <p>Loading Dashboard Analytics...</p>
            </div>
        );
    }

    return (
        <div className="dashboard animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p className="subtitle">Welcome back! Here's your firm's activity summary.</p>
                </div>
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input type="text" placeholder="Search cases, clients..." />
                </div>
            </header>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper blue">
                        <Users size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Total Clients</p>
                        <h3 className="kpi-value">{stats.overview.totalClients}</h3>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper green">
                        <Briefcase size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Active Cases</p>
                        <h3 className="kpi-value">{stats.overview.totalCases}</h3>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper purple">
                        <FileText size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Documents</p>
                        <h3 className="kpi-value">{stats.overview.totalDocuments}</h3>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper orange">
                        <CheckSquare size={24} />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Tasks Pending</p>
                        <h3 className="kpi-value">{stats.overview.totalTasks}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="card chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Document Status Distribution</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.documentStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.documentStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2e3344', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Cases by Type</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.caseTypes} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e3344" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: '#222635' }}
                                    contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2e3344', borderRadius: '8px' }}
                                />
                                <Bar dataKey="value" name="Cases" radius={[6, 6, 0, 0]}>
                                    {stats.caseTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Task Progress</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.taskStatus}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={0}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.taskStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2e3344', borderRadius: '8px' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <div className="card-header">
                        <h3 className="card-title">Case Status Breakdown</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.caseStatus} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2e3344" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1d27', borderColor: '#2e3344', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Data Table Section */}
            <div className="tables-grid">
                <div className="card table-card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Cases</h3>
                    </div>
                    <div className="data-table-wrapper">
                        <div className="table-controls">
                            <div className="search-box" style={{ width: '100%', marginBottom: '10px' }}>
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search Recent Cases..."
                                    value={searchTerms.cases}
                                    onChange={(e) => setSearchTerms({ ...searchTerms, cases: e.target.value })}
                                />
                            </div>
                        </div>
                        <DataTable data={filteredCases} type="cases" />
                    </div>
                </div>

                <div className="card table-card">
                    <div className="card-header">
                        <h3 className="card-title">Pending Tasks</h3>
                    </div>
                    <div className="data-table-wrapper">
                        <div className="table-controls">
                            <div className="search-box" style={{ width: '100%', marginBottom: '10px' }}>
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search Pending Tasks..."
                                    value={searchTerms.tasks}
                                    onChange={(e) => setSearchTerms({ ...searchTerms, tasks: e.target.value })}
                                />
                            </div>
                        </div>
                        <DataTable data={filteredTasks} type="tasks" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
