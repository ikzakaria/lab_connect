import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import NewRequestModal from '../components/doctor/NewRequestModal';
import ReportViewer from '../components/doctor/ReportViewer';
import { TESTS_LIST } from '../utils/constants';

export default function DoctorDashboard() {
  const { requests, updateRequest, deleteRequest } = useData();
  const { user } = useAuth();
  const toast = useToast();
  const [showNew, setShowNew] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Only show requests created by this doctor
  const myRequests = requests.filter(r => r.doctorId === user.id);
  const pending = myRequests.filter(r => r.status !== 'completed');
  const completed = myRequests.filter(r => r.status === 'completed');

  const testLabels = (ids) => ids.map(tid => TESTS_LIST.find(t => t.id === tid)?.name || tid).join(', ');

  const patientInfo = (req) => {
    const parts = [];
    if (req.patientAge) parts.push(`${req.patientAge} ans`);
    if (req.patientSex) parts.push(req.patientSex === 'M' ? 'Masculin' : 'Féminin');
    return parts.length > 0 ? `• ${parts.join(' • ')}` : '';
  };

  const startRename = (req) => {
    setEditingRequest(req);
    setEditName(req.patientName);
  };

  const confirmRename = () => {
    if (editingRequest && editName.trim()) {
      updateRequest(editingRequest.id, { patientName: editName.trim() });
      toast('Patient renommé');
    }
    setEditingRequest(null);
  };

  const handleDelete = (id) => {
    deleteRequest(id);
    toast('Demande supprimée');
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tableau de bord</h2>
          <p className="text-slate-500">{pending.length} demande(s) en cours · {completed.length} rapport(s) terminé(s)</p>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-sky-500/30 transition-all active:scale-95 flex items-center gap-2">
          <i className="fa-solid fa-plus" /> Nouvelle demande
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><i className="fa-solid fa-clock text-amber-500" /> Demandes en attente</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {pending.length === 0 && <div className="p-8 text-center text-slate-400">Aucune demande en attente</div>}
            {pending.map(req => (
              <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3"><StatusBadge status={req.status} /><span className="text-xs text-slate-400 font-mono">{req.id}</span></div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startRename(req)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Renommer"><i className="fa-solid fa-pen text-xs" /></button>
                    <button onClick={() => setDeleteId(req.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Supprimer"><i className="fa-solid fa-trash text-xs" /></button>
                  </div>
                </div>
                <h4 className="font-semibold text-slate-900">{req.patientName} <span className="text-xs font-normal text-slate-500">{patientInfo(req)}</span></h4>
                <p className="text-xs text-slate-500 mt-1 truncate">{testLabels(req.tests)}</p>
                <div className="mt-2 flex gap-2 text-xs text-slate-400">
                  {req.collectedAt && <span><i className="fa-solid fa-vial mr-1" />Prélevé</span>}
                  {req.pickedUpAt && <span><i className="fa-solid fa-truck mr-1" />En transit</span>}
                  {req.processingAt && <span><i className="fa-solid fa-microscope mr-1" />Analyse en cours</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><i className="fa-solid fa-file-circle-check text-emerald-500" /> Rapports terminés</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {completed.length === 0 && <div className="p-8 text-center text-slate-400">Aucun rapport terminé</div>}
            {completed.map(req => (
              <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0"><i className="fa-solid fa-file-medical text-emerald-600" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{req.patientName} <span className="text-xs font-normal text-slate-500">{patientInfo(req)}</span></h4>
                  <p className="text-xs text-slate-500 truncate">{testLabels(req.tests)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewing(req)} className="text-sky-600 hover:text-sky-700 p-2 rounded-lg hover:bg-sky-50 transition-colors"><i className="fa-solid fa-eye" /></button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button onClick={() => startRename(req)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Renommer"><i className="fa-solid fa-pen text-xs" /></button>
                    <button onClick={() => setDeleteId(req.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Supprimer"><i className="fa-solid fa-trash text-xs" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNew && <NewRequestModal onClose={() => setShowNew(false)} />}
      {viewing && <ReportViewer reportUrl={viewing.reportUrl} patientName={viewing.patientName} requestId={viewing.id} onClose={() => setViewing(null)} />}

      {editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Renommer le patient</h3>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-4" autoFocus />
            <div className="flex gap-3">
              <button onClick={() => setEditingRequest(null)} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Annuler</button>
              <button onClick={confirmRename} className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25">Enregistrer</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal title="Supprimer la demande" message="Êtes-vous sûr de vouloir supprimer cette demande ? Cette action est irréversible." onConfirm={deleteId ? () => handleDelete(deleteId) : null} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
