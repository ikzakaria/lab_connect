import { jsPDF } from 'jspdf';
const DUMMY_RESULTS = {
  hemogramme: ['13.2','14.5','11.8','15.1'], glycemie: ['0.92','1.05','0.78','0.88'],
  lipidogramme: ['1.8','2.1','1.5','1.9'], bilan_hepatique: ['35','28','42','31'],
  bilan_renal: ['12','15','10','14'], crp: ['3.2','8.5','1.1','4.0'],
  vitamine_d: ['45','22','68','38'], tsh: ['2.1','4.5','1.2','3.0'],
  fer: ['85','120','45','95'], groupage: ['A+','O+','B-','AB+']
};
export function generateLabReport(request, technicianName, labName) {
  const doc = new jsPDF();
  const tests = request.tests || [];
  doc.setFillColor(2,132,199); doc.rect(0,0,210,35,'F');
  doc.setTextColor(255,255,255); doc.setFontSize(22); doc.setFont('helvetica','bold');
  doc.text('LabConnect',15,22); doc.setFontSize(12); doc.setFont('helvetica','normal');
  doc.text("Rapport d'Analyse Sanguine",195,22,{align:'right'});
  doc.setTextColor(30,41,59); doc.setFontSize(11);
  const y0=50;
  doc.setFont('helvetica','bold'); doc.text('Patient:',15,y0); doc.setFont('helvetica','normal'); doc.text(request.patientName,45,y0);
  doc.setFont('helvetica','bold'); doc.text('N° Demande:',15,y0+8); doc.setFont('helvetica','normal'); doc.text(request.id,45,y0+8);
  doc.setFont('helvetica','bold'); doc.text('Médecin:',15,y0+16); doc.setFont('helvetica','normal'); doc.text(request.doctorName,45,y0+16);
  doc.setFont('helvetica','bold'); doc.text('Date prélèvement:',120,y0); doc.setFont('helvetica','normal');
  doc.text(request.collectedAt?new Date(request.collectedAt).toLocaleDateString('fr-FR'):'N/A',160,y0);
  doc.setFont('helvetica','bold'); doc.text('Date rapport:',120,y0+8); doc.setFont('helvetica','normal');
  doc.text(new Date().toLocaleDateString('fr-FR'),160,y0+8);
  let y=y0+32; doc.setFillColor(241,245,249); doc.rect(15,y,180,10,'F');
  doc.setFontSize(10); doc.setFont('helvetica','bold');
  doc.text('TEST',20,y+7); doc.text('RÉSULTAT',90,y+7); doc.text('UNITÉ',130,y+7); doc.text('RÉFÉRENCE',160,y+7);
  y+=15; doc.setFont('helvetica','normal');
  tests.forEach((tid,i)=>{
    const pool=DUMMY_RESULTS[tid]||['Normal']; const val=pool[Math.floor(Math.random()*pool.length)];
    if(i%2===1){doc.setFillColor(248,250,252); doc.rect(15,y-5,180,10,'F');}
    doc.text(tid,20,y); doc.setFont('helvetica','bold'); doc.text(val,90,y); doc.setFont('helvetica','normal');
    doc.text('-',130,y); doc.text('-',160,y); y+=10;
  });
  doc.setFontSize(9); doc.setTextColor(100,116,139);
  doc.text('Ce rapport a été généré électroniquement par LabConnect.',105,280,{align:'center'});
  doc.text(`Laboratoire: ${labName||'BioAnalyse'} | Technicien: ${technicianName}`,105,285,{align:'center'});
  doc.setDrawColor(148,163,184); doc.line(140,265,190,265); doc.setFontSize(8);
  doc.text('Signature et cachet',165,270,{align:'center'});
  return doc.output('bloburl');
}
