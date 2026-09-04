import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVillageReports, getVillageStatus } from '../services/api';
import { FileText, ArrowLeft } from 'lucide-react';

const ReportHistory = () => {
  const { id } = useParams();
  const [reports, setReports] = useState([]);
  const [village, setVillage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [reportsRes, statusRes] = await Promise.all([
          getVillageReports(id),
          getVillageStatus(id)
        ]);
        setReports(reportsRes.data);
        setVillage(statusRes.data.village);
      } catch (error) {
        console.error("Error fetching reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  if (loading) return <div className="container text-center mt-4">Loading reports...</div>;

  return (
    <div className="container">
      <div className="mb-4">
        <Link to={`/village/${id}`} className="text-primary font-semibold flex items-center gap-2 mb-4 hover:underline">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold">Report History</h1>
        <p className="text-muted mt-2">Previous shortage reports for {village?.name || 'this village'}</p>
      </div>

      {reports.length === 0 ? (
        <div className="card text-center py-5">
          <FileText size={48} className="text-muted mx-auto mb-4" />
          <h2 className="font-semibold text-lg">No Reports Found</h2>
          <p className="text-muted">There are no water shortage reports for this village.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div key={report._id} className="card" style={{ marginBottom: 0 }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold">{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span className="text-muted text-sm ml-2">
                    {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`status-badge ${
                  report.status === 'Resolved' ? 'status-Normal' : 
                  report.status === 'Pending' ? 'status-Warning' : 'status-Low'
                }`}>
                  {report.status}
                </span>
              </div>
              
              <div className="mt-3 text-sm flex flex-col gap-1">
                <div className="flex gap-2">
                  <span className="text-muted">Water Available:</span>
                  <span className="font-semibold">{report.waterAvailable ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted">People Affected:</span>
                  <span className="font-semibold">{report.peopleAffected}</span>
                </div>
                {report.description && (
                  <div className="mt-2 p-3 bg-gray-50 rounded" style={{ backgroundColor: 'var(--bg-color)' }}>
                    {report.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
