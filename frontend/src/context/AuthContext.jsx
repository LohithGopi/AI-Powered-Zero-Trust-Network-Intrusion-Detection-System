import React, { createContext, useContext, useState } from 'react';
import { apiLogin } from '../services/api';

const AuthContext = createContext(null);

// Default real benchmark datasets (shared globally across all views)
const DEFAULT_DATASETS = [
  { id: 1, name: 'nsl_kdd_intrusion_dataset.csv', type: 'NSL-KDD', rows: 5000, cols: 42, size: '0.62 MB', status: 'Uploaded', date: '2026-08-10 14:20', isSelected: true },
  { id: 2, name: 'unsw_nb15_network_flow_dataset.csv', type: 'UNSW-NB15', rows: 5000, cols: 43, size: '0.78 MB', status: 'Uploaded', date: '2026-08-10 12:15', isSelected: false }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nids_user');
    return saved ? JSON.parse(saved) : {
      username: 'admin',
      role: 'Admin',
      email: 'admin@jnnce.ac.in',
      batch: 'Batch No. 34'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('nids_token'));
  const [loading, setLoading] = useState(false);

  // ── Global Dataset Collection (shared across DatasetsView, TrainingView, OverviewView) ──
  const [datasets, setDatasets] = useState(DEFAULT_DATASETS);

  const activeDataset = datasets.find(d => d.isSelected) || datasets[0];

  const selectDataset = (id) => {
    setDatasets(prev => prev.map(d => ({ ...d, isSelected: d.id === id })));
  };

  const addDataset = (ds, autoSelect = true) => {
    setDatasets(prev => {
      const updated = autoSelect 
        ? prev.map(d => ({ ...d, isSelected: false }))
        : prev;
      return [{ ...ds, isSelected: autoSelect }, ...updated];
    });
  };

  const removeDataset = (id) => {
    setDatasets(prev => {
      const filtered = prev.filter(d => d.id !== id);
      // If the deleted one was selected, auto-select first remaining
      const anySelected = filtered.some(d => d.isSelected);
      if (!anySelected && filtered.length > 0) {
        return filtered.map((d, i) => ({ ...d, isSelected: i === 0 }));
      }
      return filtered;
    });
  };

  // ── Model Training Session State (Resets to 'Untrained' upon every login) ──
  const [modelStatus, setModelStatus] = useState('Untrained');
  const [modelMetrics, setModelMetrics] = useState({
    accuracy: '0.00%',
    loss: '0.0000',
    valAccuracy: '0.00%',
    epochs: 0,
    trainedAt: 'Pending Training'
  });

  const resetModelStatus = () => {
    setModelStatus('Untrained');
    setModelMetrics({
      accuracy: '0.00%',
      loss: '0.0000',
      valAccuracy: '0.00%',
      epochs: 0,
      trainedAt: 'Pending Training'
    });
  };

  const setTrainedModel = (metrics) => {
    setModelStatus('Trained');
    setModelMetrics(metrics);
  };

  const login = async (username, password, selectedRole = 'Admin') => {
    setLoading(true);
    try {
      let data = null;
      try {
        data = await apiLogin(username, password);
      } catch (err) {
        console.warn('API login call fallback active:', err);
      }

      const inferredRole = selectedRole || (data && data.role) || (
        username.toLowerCase().includes('analyst') ? 'Analyst' :
        username.toLowerCase().includes('user') ? 'User' : 'Admin'
      );

      const userObj = {
        username: (data && (data.username || (data.user && data.user.username))) || username || 'admin',
        role: (data && data.role) || inferredRole,
        email: username.includes('@') ? username : `${username}@jnnce.ac.in`,
        batch: 'Batch No. 34'
      };

      setUser(userObj);
      setIsAuthenticated(true);

      // Reset model status AND dataset collection to defaults on every new login
      resetModelStatus();
      setDatasets(DEFAULT_DATASETS);

      localStorage.setItem('nids_user', JSON.stringify(userObj));
      if (data && data.token) {
        localStorage.setItem('nids_token', data.token);
      } else {
        localStorage.setItem('nids_token', `demo_token_${userObj.role.toLowerCase()}`);
      }

      return { success: true, role: userObj.role };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nids_token');
    localStorage.removeItem('nids_user');
    setIsAuthenticated(false);
    resetModelStatus();
    setDatasets(DEFAULT_DATASETS);
    setUser({ username: 'admin', role: 'Admin', email: 'admin@jnnce.ac.in' });
  };

  const switchRole = (newRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('nids_user', JSON.stringify(updated));
  };

  const currentRole = user?.role || 'Admin';

  return (
    <AuthContext.Provider value={{
      user, role: currentRole, isAuthenticated, loading, login, logout, switchRole,
      // Dataset collection (global shared state)
      datasets, activeDataset, selectDataset, addDataset, removeDataset,
      // Model training session state
      modelStatus, setModelStatus, modelMetrics, setTrainedModel, resetModelStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
