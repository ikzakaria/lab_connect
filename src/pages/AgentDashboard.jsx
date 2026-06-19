import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/ConfirmModal';
import PatientAvatar from '../components/PatientAvatar';
import PatientEditModal from '../components/PatientEditModal';
import QRScanner from '../components/agent/QRScanner';

export default function AgentDashboard() {
  const { requests, updateRequest } = useData();
  const { user } = useAuth();
  const toast = useToast();
  const [scanMode, setScanMode] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingRequest, setEditingRequest] = useState(null);

  const toPickup = requests.filter(r => r.status === 'collected');
  const toDeliver = requests.filter(r => r.status === 'picked_up');

  const doPickup = (id) => { updateRequest(id, { status: 'picked_up', pickedUpAt: new Date().toISOString(), pickedUpBy: user.name }); toast('Pris en charge'); setConfirmAction(null); };
  const doDeliver = (id) => { updateRequest(id, { status: 'delivered', deliveredAt: new Date().toISOString(), deliveredBy: user.name }); toast('Livré au laboratoire'); setConfirmAction(null); };

  const toggleSelect = (id) => { setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const batchDeliver = () => { selectedIds.forEach(id => doDeliver(id)); setSelectedIds(new Set()); };

  const handleQRScan = (requestId) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) { toast('Code QR non reconnu', 'error'); return; }
    if (scanMode === 'pickup' && req.status === 'collected') setConfirmAction({ id: req.id, type: 'pickup' });
    else if (scanMode === 'deliver' && req.status === 'picked_up') setConfirmAction({ id: req.id, type: 'deliver' });
    else toast('Statut incompatible', 'error');
    setScanMode(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold text-slate-900">Logistique</h2><p className="text-slate-500">{toPickup.length} à récupérer · {toDeliver.length} à livrer</p></div>
        <button onClick={() => setScanMode('pickup')} className="w-14 h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-lg shadow-sky-500/30 flex items-center justify-center transition-all active:scale-90"><i className="fa-solid fa-camera text-xl" /></button>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Prises en charge ({toPickup.length})</h3>
        {toPickup.length === 0 && <div className="text-center text-slate-400 py-8 bg-white rounded-2xl border border-slate-200">Aucun échantillon à récupérer</div>}
        <div className="grid gap-3">
          {toPickup.map(req => (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
              <div onClick={() => setEditingRequest(req)} className="cursor-pointer hover:ring-2 hover:ring-sky-300 rounded-full transition-all shrink-0"><PatientAvatar name={req.patientName} photo={req.patientPhoto} size={48} /></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate cursor-pointer hover:text-sky-600 transition-colors" onClick={() => setEditingRequest(req)}>{req.patientName} {req.patientAge ? `(${req.patientAge} ans)` : ''}</h4>
                <p className="text-xs text-slate-500">{req.id} · {req.doctorName}</p>
              </div>
              <button onClick={() => setConfirmAction({ id: req.id, type: 'pickup' })} className="min-h-[48px] bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-purple-500/30 transition-all active:scale-95">Prendre en charge</button>
            </div>
          ))}
        </div>
      </div>

      {toDeliver.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">En cours de livraison ({toDeliver.length})</h3>
            {toDeliver.length > 1 && selectedIds.size > 0 && <button onClick={batchDeliver} className="text-sm text-sky-600 hover:text-sky-700 font-medium">Livrer sélection ({selectedIds.size})</button>}
          </div>
          <div className="grid gap-3">
            {toDeliver.map(req => (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex items-center gap-4 animate-[fadeIn_0.3s_ease-out]">
                <input type="checkbox" checked={selectedIds.has(req.id)} onChange={() => toggleSelect(req.id)} className="w-5 h-5 text-sky-600 rounded border-slate-300 focus:ring-sky-500" />
                <div onClick={() => setEditingRequest(req)} className="cursor-pointer hover:ring-2 hover:ring-sky-300 rounded-full transition-all shrink-0"><PatientAvatar name={req.patientName} photo={req.patientPhoto} size={48} /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 truncate cursor-pointer hover:text-sky-600 transition-colors" onClick={() => setEditingRequest(req)}>{req.patientName} {req.patientAge ? `(${req.patientAge} ans)` : ''}</h4>
                  <p className="text-xs text-slate-500">Pris en charge à {new Date(req.pickedUpAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <button onClick={() => setConfirmAction({ id: req.id, type: 'deliver' })} className="min-h-[48px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm shadow-lg shadow-indigo-500/30 transition-all active:scale-95">Livrer</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmModal title={confirmAction?.type === 'pickup' ? 'Confirmer la prise en charge' : 'Confirmer la livraison'}
        message={confirmAction?.type === 'pickup' ? 'Confirmez-vous la récupération de cet échantillon au cabinet médical ?' : 'Confirmez-vous la livraison de cet échantillon au laboratoire ?'}
        onConfirm={confirmAction ? (() => (confirmAction.type === 'pickup' ? doPickup(confirmAction.id) : doDeliver(confirmAction.id))) : null}
        onCancel={() => setConfirmAction(null)} />

      {scanMode && <QRScanner mode={scanMode} availableRequests={scanMode === 'pickup' ? toPickup : toDeliver} onScan={handleQRScan} onClose={() => setScanMode(null)} />}
      <PatientEditModal request={editingRequest} onClose={() => setEditingRequest(null)} />
    </div>
  );
}
