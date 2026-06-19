import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLE_NAMES } from '../utils/constants';
import ConfirmModal from '../components/ConfirmModal';

export default function AdminDashboard() {
  const {
    allUsers, pendingUsers, passwordResets,
    approveUser, rejectUser, approvePasswordReset, rejectPasswordReset, deleteUser, addUser
  } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('doctor');
  const [showResetPass, setShowResetPass] = useState({});

  const handleApprove = (id) => {
    approveUser(id);
    toast('Compte approuvé');
  };

  const handleReject = (id) => {
    rejectUser(id);
    toast('Compte rejeté');
  };

  const handleApproveReset = (id) => {
    const ok = approvePasswordReset(id);
    if (ok) toast('Mot de passe réinitialisé');
  };

  const handleRejectReset = (id) => {
    rejectPasswordReset(id);
    toast('Demande de réinitialisation rejetée');
  };

  const handleDelete = (id) => {
    deleteUser(id);
    toast('Compte supprimé');
    setDeleteUserId(null);
  };

  const handleAddUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      toast('Tous les champs sont requis', 'error');
      return;
    }
    const result = addUser(newUserName.trim(), newUserEmail.trim(), newUserPassword.trim(), newUserRole);
    if (result.ok) {
      toast('Compte créé');
      setShowAddUser(false);
      setNewUserName(''); setNewUserEmail(''); setNewUserPassword(''); setNewUserRole('doctor');
    } else {
      toast(result.error, 'error');
    }
  };

  const toggleShowReset = (id) => {
    setShowResetPass(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const tabs = [
    { id: 'pending', label: `Comptes en attente (${pendingUsers.length})`, icon: 'fa-user-clock' },
    { id: 'resets', label: `Mdp oublié (${passwordResets.length})`, icon: 'fa-key' },
    { id: 'users', label: `Tous les comptes (${allUsers.length})`, icon: 'fa-users' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Administration</h2>
          <p className="text-slate-500">Gestion des comptes et des demandes</p>
        </div>
        <button onClick={() => setShowAddUser(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-sky-500/30 transition-all active:scale-95 flex items-center gap-2 text-sm">
          <i className="fa-solid fa-plus" /> Ajouter un compte
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-sky-600 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <i className={`fa-solid ${tab.icon}`} />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'pending' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-400"><i className="fa-solid fa-check-circle text-4xl mb-3 text-emerald-400" /><p>Aucune demande de compte en attente</p></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-4 py-3 font-semibold text-slate-700">Nom</th><th className="px-4 py-3 font-semibold text-slate-700">Email</th><th className="px-4 py-3 font-semibold text-slate-700">Rôle</th><th className="px-4 py-3 font-semibold text-slate-700">Date</th><th className="px-4 py-3 font-semibold text-slate-700 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {pendingUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">{ROLE_NAMES[u.role]}</span></td>
                    <td className="px-4 py-3 text-slate-500">{new Date(u.requestedAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleApprove(u.id)} className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors mr-2"><i className="fa-solid fa-check mr-1" />Approuver</button>
                      <button onClick={() => handleReject(u.id)} className="text-sm bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"><i className="fa-solid fa-xmark mr-1" />Rejeter</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'resets' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {passwordResets.length === 0 ? (
            <div className="p-12 text-center text-slate-400"><i className="fa-solid fa-check-circle text-4xl mb-3 text-emerald-400" /><p>Aucune demande de réinitialisation</p></div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-4 py-3 font-semibold text-slate-700">Email</th><th className="px-4 py-3 font-semibold text-slate-700">Date</th><th className="px-4 py-3 font-semibold text-slate-700">Mot de passe demandé</th><th className="px-4 py-3 font-semibold text-slate-700 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {passwordResets.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.email}</td>
                    <td className="px-4 py-3 text-slate-500">{new Date(r.requestedAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-600">{showResetPass[r.id] ? r.newPassword : '•'.repeat(Math.min(r.newPassword?.length || 8, 12))}</span>
                        <button onClick={() => toggleShowReset(r.id)} className="text-slate-400 hover:text-slate-600"><i className={`fa-solid fa-eye${showResetPass[r.id] ? '-slash' : ''}`} /></button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleApproveReset(r.id)} className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors mr-2"><i className="fa-solid fa-check mr-1" />Approuver</button>
                      <button onClick={() => handleRejectReset(r.id)} className="text-sm bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"><i className="fa-solid fa-xmark mr-1" />Rejeter</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200"><tr><th className="px-4 py-3 font-semibold text-slate-700">ID</th><th className="px-4 py-3 font-semibold text-slate-700">Nom</th><th className="px-4 py-3 font-semibold text-slate-700">Email</th><th className="px-4 py-3 font-semibold text-slate-700">Rôle</th><th className="px-4 py-3 font-semibold text-slate-700 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-slate-500">{u.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                  <td className="px-4 py-3 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded-lg text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'doctor' ? 'bg-sky-100 text-sky-700' : u.role === 'nurse' ? 'bg-emerald-100 text-emerald-700' : u.role === 'agent' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>{ROLE_NAMES[u.role]}</span></td>
                  <td className="px-4 py-3 text-right">{u.role !== 'admin' && (<button onClick={() => setDeleteUserId(u.id)} className="text-sm text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg font-medium transition-colors"><i className="fa-solid fa-trash mr-1" />Supprimer</button>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Ajouter un compte</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label><input type="text" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Nom" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Email</label><input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Email" /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label><select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"><option value="doctor">Médecin</option><option value="nurse">Infirmier(e)</option><option value="agent">Agent de livraison</option><option value="lab">Personnel de laboratoire</option></select></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label><input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="••••••••" /></div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              <button onClick={() => setShowAddUser(false)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Annuler</button>
              <button onClick={handleAddUser} className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25">Créer</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal title="Supprimer le compte" message="Êtes-vous sûr de vouloir supprimer ce compte ? Cette action est irréversible." onConfirm={deleteUserId ? () => handleDelete(deleteUserId) : null} onCancel={() => setDeleteUserId(null)} />
    </div>
  );
}
