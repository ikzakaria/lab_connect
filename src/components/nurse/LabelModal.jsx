import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { TESTS_LIST } from '../../utils/constants';
export default function LabelModal({ request, onClose }) {
  const canvasRef = useRef(null);
  useEffect(() => { if (canvasRef.current && request) { QRCode.toCanvas(canvasRef.current, request.id, { width: 70, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } }).catch(() => {}); } }, [request]);
  if (!request) return null;
  const testNames = request.tests.map(tid => TESTS_LIST.find(t => t.id === tid)?.name.substring(0, 15) || tid).join(', ');
  const handlePrint = () => { window.print(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-slate-900">Étiquette d'Échantillon</h3><button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-lg" /></button></div>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 mb-4 flex justify-center">
          <div className="print-label-wrapper bg-white border border-slate-900 relative" style={{ width: '10cm', height: '5cm', padding: '0.4cm', fontFamily: 'Arial, sans-serif', fontSize: '9pt', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className="flex justify-between items-start"><div><div style={{ fontSize: '11pt', fontWeight: 'bold', color: '#0284c7' }}>LabConnect</div><div style={{ fontSize: '7pt', color: '#64748b' }}>{request.id}</div></div><canvas ref={canvasRef} style={{ width: '1.8cm', height: '1.8cm' }} /></div>
            <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{request.patientName}</div>
            <div style={{ fontSize: '7pt', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{testNames}</div>
            <div className="flex justify-between" style={{ fontSize: '7pt', color: '#64748b' }}><span>{new Date(request.collectedAt || request.createdAt).toLocaleDateString('fr-FR')}</span><span>{request.doctorName}</span></div>
          </div>
        </div>
        <div className="flex gap-3"><button onClick={onClose} className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition-colors">Fermer</button><button onClick={handlePrint} className="flex-1 px-4 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium transition-colors shadow-lg shadow-sky-500/25"><i className="fa-solid fa-print mr-2" />Imprimer</button></div>
      </div>
    </div>
  );
}
