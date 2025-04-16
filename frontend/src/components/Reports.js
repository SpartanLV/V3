import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Tab, Tabs, Table, Button } from 'react-bootstrap';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [reportData, setReportData] = useState({ users: [], courses: [], bookings: [] });
  const [loading, setLoading] = useState(false);

  const fetchReportData = async (type) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports/${type}`);
      setReportData(prev => ({ ...prev, [type]: res.data }));
    } catch (err) {
      console.error('Failed to fetch report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData(activeTab);
  }, [activeTab]);

  const exportToCSV = (data, fileName) => {
    // Simple CSV export implementation
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="mt-4">
      <h2>System Reports</h2>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="users" title="User Reports">
          <Button variant="success" className="mb-3" onClick={() => exportToCSV(reportData.users, 'users')}>
            Export to CSV
          </Button>
          <Table striped bordered hover>
            {/* User report table implementation */}
          </Table>
        </Tab>
        <Tab eventKey="courses" title="Course Reports">
          {/* Course report implementation */}
        </Tab>
        <Tab eventKey="bookings" title="Booking Reports">
          {/* Booking report implementation */}
        </Tab>
      </Tabs>
      {loading && <div className="text-center">Loading report data...</div>}
    </div>
  );
};

export default Reports;