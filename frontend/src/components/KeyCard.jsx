export default function KeyCard({ label, icon, values, color, subtitle }) {
  const palette = {
    cyan: {
      border: 'border-cyan-500/40',
      glow: 'shadow-cyan-500/20',
      text: 'text-cyan-300',
      chip: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40',
      blob: 'bg-cyan-500',
    },
    rose: {
      border: 'border-rose-500/40',
      glow: 'shadow-rose-500/20',
      text: 'text-rose-300',
      chip: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
      blob: 'bg-rose-500',
    },
  };
  const c = palette[color];
  const empty = !values;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br from-gray-900 to-gray-950 p-6 shadow-xl ${c.glow} transition-all duration-300 hover:scale-[1.02]`}
    >
      <div
        className={`absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-25 ${c.blob}`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${c.chip} px-2 py-0.5 rounded-full border`}
              >
                {label}
              </span>
              {subtitle && (
                <p className="text-[11px] text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {empty ? (
          <div className="flex items-center justify-center h-20 border border-dashed border-gray-800 rounded-lg">
            <p className="text-gray-600 text-sm italic">pendiente...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs font-mono w-6">n</span>
              <span className={`font-mono text-xl font-bold ${c.text}`}>
                {values.a}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs font-mono w-6">
                {color === 'cyan' ? 'e' : 'd'}
              </span>
              <span className={`font-mono text-xl font-bold ${c.text}`}>
                {values.b}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
