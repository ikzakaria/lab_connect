export const generateRequestId = () => {
  return 'LC-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createRequestObject = (patientName, patientAge, patientSex, testIds, doctorId, doctorName) => ({
  id: generateRequestId(),
  patientName,
  patientAge: patientAge || null,
  patientSex: patientSex || null,
  tests: testIds,
  status: 'demanded',
  doctorId,
  doctorName,
  createdAt: new Date().toISOString(),
  collectedAt: null,
  collectedBy: null,
  pickedUpAt: null,
  pickedUpBy: null,
  deliveredAt: null,
  deliveredBy: null,
  processingAt: null,
  processingBy: null,
  completedAt: null,
  reportUrl: null
});

export const formatDateTime = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};

export function playBellSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now);
    gain2.gain.setValueAtTime(0.15, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 1.2);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(440, now);
    gain3.gain.setValueAtTime(0.1, now);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 2);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now);
    osc3.stop(now + 2);
  } catch (e) {}
}
