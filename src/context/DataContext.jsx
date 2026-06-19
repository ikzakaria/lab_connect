import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createRequestObject } from '../utils/helpers';

const DataContext = createContext(null);

const seedRequests = () => {
  const r1 = createRequestObject('Jean Moreau', 45, 'M', ['hemogramme', 'glycemie'], 1, 'Dr. Martin Dupont');
  r1.status = 'collected';
  r1.collectedAt = new Date(Date.now() - 3600000).toISOString();
  r1.collectedBy = 'Inf. Sophie Bernard';

  const r2 = createRequestObject('Claire Fontaine', 32, 'F', ['lipidogramme', 'crp'], 1, 'Dr. Martin Dupont');
  r2.status = 'picked_up';
  r2.collectedAt = new Date(Date.now() - 7200000).toISOString();
  r2.collectedBy = 'Inf. Sophie Bernard';
  r2.pickedUpAt = new Date(Date.now() - 1800000).toISOString();
  r2.pickedUpBy = 'Pierre Durand';

  const r3 = createRequestObject('Robert Klein', 58, 'M', ['bilan_hepatique', 'bilan_renal', 'fer'], 1, 'Dr. Martin Dupont');

  return [r1, r2, r3];
};

export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('labconnect_requests');
    if (saved) return JSON.parse(saved);
    const seeded = seedRequests();
    localStorage.setItem('labconnect_requests', JSON.stringify(seeded));
    return seeded;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('labconnect_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const lastSyncRef = useRef(0);

  useEffect(() => {
    localStorage.setItem('labconnect_requests', JSON.stringify(requests));
    const ts = Date.now();
    localStorage.setItem('labconnect_last_sync', ts.toString());
    lastSyncRef.current = ts;
    try {
      const bc = new BroadcastChannel('labconnect_sync');
      bc.postMessage({ timestamp: ts });
    } catch (e) {}
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('labconnect_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'labconnect_requests' && e.newValue) {
        setRequests(JSON.parse(e.newValue));
      }
      if (e.key === 'labconnect_notifications' && e.newValue) {
        setNotifications(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', onStorage);
    let bc;
    try {
      bc = new BroadcastChannel('labconnect_sync');
      bc.onmessage = (ev) => {
        if (ev.data?.timestamp > lastSyncRef.current) {
          const savedReq = localStorage.getItem('labconnect_requests');
          if (savedReq) setRequests(JSON.parse(savedReq));
          const savedNotif = localStorage.getItem('labconnect_notifications');
          if (savedNotif) setNotifications(JSON.parse(savedNotif));
        }
      };
    } catch (e) {}
    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  const addNotification = useCallback((message, targetRole) => {
    const notif = {
      id: Date.now() + Math.random(),
      message,
      targetRole,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [...prev, notif]);
  }, []);

  const getUnreadNotifications = useCallback((role) => {
    return notifications.filter(n => n.targetRole === role && !n.read);
  }, [notifications]);

  const markNotificationsRead = useCallback((role) => {
    setNotifications(prev => prev.map(n => n.targetRole === role ? { ...n, read: true } : n));
  }, []);

  const addRequest = useCallback((patientName, patientAge, patientSex, testIds, doctorId, doctorName) => {
    const req = createRequestObject(patientName, patientAge, patientSex, testIds, doctorId, doctorName);
    setRequests(prev => {
      const next = [req, ...prev];
      // Notify nurse when doctor creates a request
      addNotification(`Nouvelle demande à prélever : ${patientName}`, 'nurse');
      return next;
    });
    return req.id;
  }, [addNotification]);

  const updateRequest = useCallback((requestId, updates) => {
    setRequests(prev => {
      const req = prev.find(r => r.id === requestId);
      const newStatus = updates.status;
      if (req && newStatus && newStatus !== req.status) {
        if (newStatus === 'collected') {
          addNotification(`Nouvel échantillon à récupérer : ${req.patientName}`, 'agent');
        } else if (newStatus === 'delivered') {
          addNotification(`Nouvel échantillon à analyser : ${req.patientName}`, 'lab');
        } else if (newStatus === 'completed') {
          addNotification(`Rapport d'analyse prêt pour ${req.patientName}`, 'doctor');
        }
      }
      return prev.map(r => (r.id === requestId ? { ...r, ...updates } : r));
    });
  }, [addNotification]);

  const deleteRequest = useCallback((requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  }, []);

  const value = useMemo(
    () => ({
      requests,
      notifications,
      addRequest,
      updateRequest,
      deleteRequest,
      addNotification,
      getUnreadNotifications,
      markNotificationsRead,
      getById: (id) => requests.find(r => r.id === id),
      getByStatus: (status) => requests.filter(r => r.status === status),
    }),
    [requests, notifications, addRequest, updateRequest, deleteRequest, addNotification, getUnreadNotifications, markNotificationsRead]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
};
