import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import PatientAvatar from '../components/PatientAvatar';
import PatientEditModal from '../components/PatientEditModal';
import ConfirmModal from '../components/ConfirmModal';
import ReportModal from '../components/lab/ReportModal';
import { TESTS_LIST } from '../utils/constants';

export default function LabDashboard() {
  const { requests, updateRequest } = useData();
  const { user } = useAuth();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  const delivered = requests.filter(r => r.status === 'delivered');
  const processing = requests.filter(r => r.status === 'processing');
  const completed = requests.filter(r => r.status === 'completed');

  const filtered = requests.filter(r => {
    if (filter === 'all') return r.status === 'delivered' || r.status === 'processing';
    return r.status === filter;
  });

  const startProcessing = (id) => { updateRequest(id, { status: 'processing', processingAt: new Date().toISOString(), processingBy: user.name }); toast('Analyse en cours'); setConfirmId(null); };
  const submitReport = (id, url) => { updateRequest(id, { status: 'completed', completedAt: new Date().toISOString(), reportUrl: url }); toast('Rapport validé - Médecin notifié'); setReportId(null); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-slate-900">Traitement des Analyses</h2><p className="text-slate-500">{delivered.length} en attente · {processing.length} en cours · {completed.length} terminés</p></div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-sm">
          <option value="all">Tous les actifs</option>
          <option value="delivered">Livrés ({delivered.length})</option>
          <option value="processing">En cours ({processing.length})</option>
          <option value="completed">Terminés ({completed.length})</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">N° Demande</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tests</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">Aucune demande dans cette catégorie</td></tr>}
              {filtered.map(req => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm text-slate-600">{req.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div onClick={() => setEditingRequest(req)} className="cursor-pointer hover:ring-2 hover:ring-sky-300 rounded-full transition-all shrink-0"><PatientAvatar name={req.patientName} photo={req.patientPhoto} size={36} /></div>
                      <div>
                        <p className="font-semibold text-slate-900 cursor-pointer hover:text-sky-600 transition-colors" onClick={() => setEditingRequest(req)}>{req.patientName} {req.patientAge ? `(${req.patientAge} ans)` : ''}</p>
                        <p className="text-xs text-slate-500">{req.doctorName} {req.patientSex ? `• ${req.patientSex === 'M' ? 'Masculin' : 'Féminin'}` : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{req.tests.map(tid => { const t = TESTS_LIST.find(x => x.id === tid); return <span key={tid} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{t?.name || tid}</span>; })}</div></td>
                  <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                  <td className="px-4 py-3 text-sm text-slate-500">{req.deliveredAt ? new Date(req.deliveredAt).toLocaleDateString('fr-FR') : new Date(req.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3 text-right">
                    {req.status === 'delivered' && <button onClick={() => setConfirmId(req.id)} className="text-sm bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm">Analyser</button>}
                    {req.status === 'processing' && <button onClick={() => setReportId(req.id)} className="text-sm bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm"><i className="fa-solid fa-file-arrow-up mr-1" />Rapport</button>}
                    {req.status === 'completed' && <button onClick={() => window.open(req.reportUrl, '_blank')} className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors shadow-sm"><i className="fa-solid fa-eye mr-1" />Voir</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal title="Commencer l'analyse" message="Confirmez-vous le début du traitement de cet échantillon ?"
        onConfirm={confirmId ? () => startProcessing(confirmId) : null} onCancel={() => setConfirmId(null)} />
      <ReportModal request={requests.find(r => r.id === reportId)} onSubmit={submitReport} onClose={() => setReportId(null)} />
      <PatientEditModal request={editingRequest} onClose={() => setEditingRequest(null)} />
    </div>
  );
}
