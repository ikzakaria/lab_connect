export default function PatientAvatar({ name, photo, size = 40 }) {
  const getInitials = (n) => n?.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
  if (photo) {
    return <img src={photo} alt={name} className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-500 font-bold"
      style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {getInitials(name)}
    </div>
  );
}
