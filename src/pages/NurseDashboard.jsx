import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import PatientAvatar from '../components/PatientAvatar';
import PatientEditModal from '../components/PatientEditModal';
import LabelModal from '../components/nurse/LabelModal';
import { TESTS_LIST } from '../utils/constants';

export default function NurseDashboard() {
  const { requests, updateRequest } = useData();
  const { user } = useAuth();
  const toast = useToast();
  const [confirmId, setConfirmId] = useState(null);
  const [labelRequest, setLabelRequest] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  const demanded = requests.filter(r => r.status === 'demanded');
  const collected = requests.filter(r => r.status === 'collected');

  const doCollect = (id) => {
    updateRequest(id, { status: 'collected', collectedAt: new Date().toISOString(), collectedBy: user.name });
    toast('Échantillon collecté');
    setConfirmId(null);
    setLabelRequest(id);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Collecte des Échantillons</h2>
        <p className="text-slate-500">{demanded.length} patient(s) en attente de prélèvement</p>
      </div>

      {demanded.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><i className="fa-solid fa-check text-3xl text-emerald-600" /></div>
          <h3 className="text-lg font-semibold text-slate-900">Tous les prélèvements sont effectués</h3>
          <p className="text-slate-500 mt-1">Aucune demande en attente pour le moment.</p>
        </div>
      )}

      <div className="grid gap-4">
        {demanded.map(req => (
          <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow animate-[fadeIn_0.3s_ease-out]">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Demande</span>
                  <span className="text-xs text-slate-400 font-mono">{req.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div onClick={() => setEditingRequest(req)} className="cursor-pointer hover:ring-2 hover:ring-sky-300 rounded-full transition-all">
                    <PatientAvatar name={req.patientName} photo={req.patientPhoto} size={48} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 cursor-pointer hover:text-sky-600 transition-colors" onClick={() => setEditingRequest(req)}>
                      {req.patientName} {req.patientAge ? `(${req.patientAge} ans)` : ''}
                    </h3>
                    <p className="text-sm text-slate-500"><i className="fa-solid fa-user-doctor mr-1" /> {req.doctorName} {req.patientSex ? `• ${req.patientSex === 'M' ? 'Homme' : 'Féminin'}` : ''}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {req.tests.map(tid => { const t = TESTS_LIST.find(x => x.id === tid); return <span key={tid} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">{t?.name || tid}</span>; })}
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 justify-end">
                <button onClick={() => setConfirmId(req.id)}
                  className="min-h-[48px] bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <i className="fa-solid fa-vial" /><span>Prélever</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {collected.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">En attente de prise en charge ({collected.length})</h3>
          <div className="grid gap-4">
            {collected.map(req => (
              <div key={req.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 opacity-75">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div onClick={() => setEditingRequest(req)} className="cursor-pointer hover:ring-2 hover:ring-sky-300 rounded-full transition-all">
                      <PatientAvatar name={req.patientName} photo={req.patientPhoto} size={40} />
                    </div>
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">Échantillon collecté</span>
                      <h4 className="font-bold text-slate-900 mt-1 cursor-pointer hover:text-sky-600 transition-colors" onClick={() => setEditingRequest(req)}>
                        {req.patientName} {req.patientAge ? `(${req.patientAge} ans)` : ''}
                      </h4>
                      <p className="text-xs text-slate-500">Prélevé à {new Date(req.collectedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <button onClick={() => setLabelRequest(req.id)} className="text-sky-600 hover:text-sky-700 p-3 rounded-xl hover:bg-sky-50 transition-colors"><i className="fa-solid fa-print text-xl" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal title="Confirmer le prélèvement" message="Êtes-vous sûr d'avoir prélevé l'échantillon sanguin ? Cette action est irréversible."
        onConfirm={confirmId ? () => doCollect(confirmId) : null} onCancel={() => setConfirmId(null)} />
      <LabelModal request={requests.find(r => r.id === labelRequest)} onClose={() => setLabelRequest(null)} />
      <PatientEditModal request={editingRequest} onClose={() => setEditingRequest(null)} />
    </div>
  );
}
