export function logActivity(action: string, details: string, user?: { name: string; email: string }) {
  const logs = JSON.parse(localStorage.getItem('farm_activity_logs') || '[]');
  const currentUser = user || (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();
  
  const newLog = {
    id: Date.now(),
    action,
    details,
    createdAt: new Date().toISOString(),
    user: currentUser ? { name: currentUser.name, email: currentUser.email || currentUser.loginId } : undefined
  };
  
  localStorage.setItem('farm_activity_logs', JSON.stringify([newLog, ...logs]));
}
