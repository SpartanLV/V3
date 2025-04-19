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
      setReportData(prev => ({ ...prev, [type]: res.data.data || [] }));
    } catch (err) {
      console.error('Failed to fetch report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = async (type) => {
    try {
      const res = await api.get(`/admin/reports/${type}?format=csv`, {
        responseType: 'blob' // Important to get file blob
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`CSV export failed for ${type}:`, err);
    }
  };

  useEffect(() => {
    fetchReportData(activeTab);
  }, [activeTab]);

  const renderTable = () => {
    const data = reportData[activeTab];
  
    // Check if data is valid (non-null and non-empty)
    if (!data || data.length === 0) {
      return <p>No data available</p>;
    }
  
    const columns = Object.keys(data[0]);
  
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((key, idx) => (
              <th key={idx}>{key.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((key, j) => (
                <td key={j}>
                  {typeof row[key] === 'object' && row[key] !== null
                    ? JSON.stringify(row[key])
                    : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };
  

  return (
    <div className="mt-4 px-4">
      <h2 className="mb-3">System Reports</h2>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="users" title="User Reports">
          <Button variant="success" className="mb-3" onClick={() => downloadCSV('users')}>
            Export to CSV
          </Button>
          {renderTable()}
        </Tab>
        <Tab eventKey="courses" title="Course Reports">
          <Button variant="success" className="mb-3" onClick={() => downloadCSV('courses')}>
            Export to CSV
          </Button>
          {renderTable()}
        </Tab>
        <Tab eventKey="bookings" title="Booking Reports">
          <Button variant="success" className="mb-3" onClick={() => downloadCSV('bookings')}>
            Export to CSV
          </Button>
          {renderTable()}
        </Tab>
      </Tabs>
      {loading && <div className="text-center">Loading report data...</div>}
    </div>
  );
};

export default Reports;
