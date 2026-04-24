export default function CipherFlow({ mensaje, cipher, e, n, mode = 'encrypt' }) {
  if (!mensaje || !cipher?.length) return null;

  const chars = mensaje.split('');

  return (
    <div className="mt-4 space-y-2">
      {chars.map((c, i) => (
        <div
          key={i}
          className="flex items-center gap-3 bg-gray-950/60 border border-gray-800 rounded-lg p-3 animate-fade-in hover:border-cyan-500/40 transition"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono text-lg text-cyan-300 font-bold">
            {c === ' ' ? '␣' : c}
          </div>
          <span className="text-gray-500">→</span>
          <div className="px-3 py-1.5 rounded-md bg-gray-900 border border-gray-800 font-mono text-sm text-amber-300">
            {c.charCodeAt(0)}
          </div>
          <span className="text-gray-500 font-mono text-xs">
            ^{e} mod {n}
          </span>
          <span className="text-gray-500">=</span>
          <div
            className={`px-3 py-1.5 rounded-md font-mono text-sm font-bold ${
              mode === 'encrypt'
                ? 'bg-rose-500/10 border border-rose-500/40 text-rose-300'
                : 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300'
            }`}
          >
            {cipher[i]}
          </div>
        </div>
      ))}
    </div>
  );
}
