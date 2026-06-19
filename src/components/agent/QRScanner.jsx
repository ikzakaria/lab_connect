import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
export default function QRScanner({ mode, availableRequests, onScan, onClose }) {
  const [error, setError] = useState(false);
  const scannerRef = useRef(null);
  useEffect(() => {
    let mounted = true;
    const scanner = new Html5Qrcode('agent-qr-reader');
    scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, (decodedText) => { onScan(decodedText); scanner.stop().catch(() => {}); }, () => {}).catch(() => { if (mounted) setError(true); });
    scannerRef.current = scanner;
    return () => { mounted = false; if (scannerRef.current) { scannerRef.current.stop().catch(() => {}); scannerRef.current.clear(); } };
  }, [onScan]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <div className="bg-sky-600 p-4 flex justify-between items-center"><h3 className="text-white font-bold"><i className="fa-solid fa-qrcode mr-2" />Scanner un Code QR</h3><button onClick={onClose} className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"><i className="fa-solid fa-xmark" /></button></div>
        <div className="p-4">
          <div id="agent-qr-reader" className="w-full aspect-square bg-slate-900 rounded-xl overflow-hidden relative mb-4">
            {error && <div className="absolute inset-0 flex items-center justify-center text-slate-400"><div className="text-center"><i className="fa-solid fa-camera-slash text-3xl mb-2" /><p className="text-sm">Caméra non disponible</p><p className="text-xs mt-1">Utilisez la sélection manuelle ci-dessous</p></div></div>}
          </div>
          <div className="text-center"><p className="text-sm text-slate-500 mb-3">— Ou sélectionner manuellement —</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableRequests.length === 0 ? <p className="text-slate-400 text-sm">Aucun échantillon disponible</p> :
                availableRequests.map(req => (
                  <button key={req.id} onClick={() => onScan(req.id)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-left transition-all">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0"><i className="fa-solid fa-vial text-sky-600" /></div>
                    <div className="flex-1 min-w-0"><p className="font-semibold text-sm text-slate-900 truncate">{req.patientName}</p><p className="text-xs text-slate-500 font-mono">{req.id}</p></div>
                    <i className="fa-solid fa-chevron-right text-slate-400 text-xs" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
