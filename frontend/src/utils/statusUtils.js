export const getStatusColor = (status) => {
  switch (status) {
    case 'NORMAL':
      return { text: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', border: '#059669', icon: '🟢' };
    case 'LOW':
      return { text: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)', border: '#2563eb', icon: '🔵' };
    case 'WARNING':
      return { text: '#fbbf24', bg: 'rgba(245, 158, 11, 0.15)', border: '#d97706', icon: '🟠' };
    case 'CRITICAL':
      return { text: '#f87171', bg: 'rgba(239, 68, 68, 0.18)', border: '#dc2626', icon: '🔴' };
    default:
      return { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: '#64748b', icon: '⚪' };
  }
};

export const generateAsciiBar = (percentage) => {
  const totalBlocks = 10;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
};

export const formatTime = (dateString) => {
  if (!dateString) return 'Just now';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};
