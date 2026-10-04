import { Link } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Users, Briefcase, Activity, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: 'Total Users', value: '45,231', trend: '+12% this month', color: '#0d6efd' },
    { icon: Briefcase, label: 'Active Jobs', value: '1,842', trend: '+5% this month', color: '#198754' },
    { icon: Activity, label: 'Applications', value: '128,504', trend: '+22% this month', color: '#fd7e14' },
    { icon: ShieldCheck, label: 'Verified Companies', value: '3,105', trend: '+8% this month', color: '#6f42c1' },
  ];

  return (
    <div className="animate-fadeIn">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1.625rem', color: '#212529', marginBottom: '0.25rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6c757d' }}>System overview and key metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            <span style={{ fontSize: '1.875rem', fontFamily: 'Inter, sans-serif', fontWeight: 800, color: '#212529', display: 'block', marginBottom: 4 }}>{stat.value}</span>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#212529', marginBottom: 2 }}>{stat.label}</p>
            <p style={{ fontSize: '0.75rem', color: '#6c757d' }}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 className="card-title">Recent System Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { text: 'New company registration: TechCorp', time: '10 mins ago', type: 'info' },
              { text: 'Payment processed for InnovateCo (Premium Plan)', time: '45 mins ago', type: 'success' },
              { text: 'User report: Suspicious job posting ID #892', time: '2 hours ago', type: 'warning' },
              { text: 'Server load warning in US-East region', time: '3 hours ago', type: 'danger' },
              { text: 'Database backup completed successfully', time: '5 hours ago', type: 'success' },
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: i === 4 ? 'none' : '1px solid #f0f0f0' }}>
                <div style={{ marginTop: 2 }}>
                  {log.type === 'success' && <CheckCircle size={16} style={{ color: '#198754' }} />}
                  {log.type === 'warning' && <AlertTriangle size={16} style={{ color: '#ffc107' }} />}
                  {log.type === 'danger' && <AlertTriangle size={16} style={{ color: '#dc3545' }} />}
                  {log.type === 'info' && <Activity size={16} style={{ color: '#0d6efd' }} />}
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
            <Link to="/admin/jobs" className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Review Flagged Jobs</Link>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>Generate Reports</button>
            <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>System Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
