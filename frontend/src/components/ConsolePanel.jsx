import { useEffect, useRef } from 'react';

export default function ConsolePanel({ lines }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/80 border-b border-gray-800">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-gray-500 font-mono">rsa-calculations.log</span>
      </div>

      {/* Console body */}
      <div className="p-4 h-72 overflow-y-auto font-mono text-sm leading-relaxed custom-scrollbar">
        {lines.length === 0 ? (
          <p className="text-gray-600 italic">Los cálculos aparecerán aquí...</p>
        ) : (
          lines.map((line, i) => (
            <div
              key={i}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {line.includes('✓') ? (
                <span className="text-emerald-400">{line}</span>
              ) : line.includes('Clave Pública') ? (
                <span className="text-cyan-400 font-bold">{line}</span>
              ) : line.includes('Clave Privada') ? (
                <span className="text-rose-400 font-bold">{line}</span>
              ) : line.startsWith('  ') && line.includes('→') ? (
                <span className="text-amber-300">{line}</span>
              ) : (
                <span className="text-gray-300">{line}</span>
              )}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
