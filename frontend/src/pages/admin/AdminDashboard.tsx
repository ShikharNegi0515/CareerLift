import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Users, Briefcase, Activity, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import api from '@/api/client';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/admin/stats');
        setStatsData(res.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const stats = [
    { icon: Users, label: 'Total Users', value: statsData.totalUsers.toLocaleString(), color: '#0d6efd' },
    { icon: Briefcase, label: 'Active Jobs', value: statsData.activeJobs.toLocaleString(), color: '#198754' },
    { icon: Activity, label: 'Applications', value: statsData.totalApplications.toLocaleString(), color: '#fd7e14' },
    { icon: ShieldCheck, label: 'Companies', value: statsData.totalCompanies.toLocaleString(), color: '#6f42c1' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: '#0d6efd' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#212529', marginBottom: '0.25rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6c757d' }}>Welcome back, {user?.firstName}. System overview and key live platform metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <span style={{ fontSize: '1.875rem', fontFamily: 'Inter, sans-serif', fontWeight: 800, color: '#212529', display: 'block', marginBottom: 4 }}>{stat.value}</span>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: 2 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">System Status & Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { text: `Live job listings database: ${statsData.totalJobs} total records`, time: 'Current', type: 'info' },
              { text: `Registered accounts: ${statsData.totalUsers} platform members`, time: 'Current', type: 'success' },
              { text: `Companies registered: ${statsData.totalCompanies} organizations`, time: 'Current', type: 'success' },
              { text: `Total applications submitted: ${statsData.totalApplications} submissions`, time: 'Current', type: 'info' },
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: i === 3 ? 'none' : '1px solid #f0f0f0' }}>
                <div style={{ marginTop: 2 }}>
                  <CheckCircle size={16} style={{ color: '#198754' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#212529', fontWeight: 500, marginBottom: 2 }}>{log.text}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/users" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Manage Users</Link>
            <Link to="/admin/jobs" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Review & Manage Jobs</Link>
            <Link to="/admin/companies" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Manage Companies</Link>
            <Link to="/jobs" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>View Public Job Board</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
