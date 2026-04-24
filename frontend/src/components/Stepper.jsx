export default function Stepper({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-between mb-10 relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-800 -z-0" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-rose-400 transition-all duration-500 -z-0"
        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
      />
      {steps.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex flex-col items-center relative z-10 flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                done
                  ? 'bg-cyan-500 border-cyan-400 text-gray-950'
                  : active
                  ? 'bg-gray-950 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/50 scale-110'
                  : 'bg-gray-950 border-gray-700 text-gray-600'
              }`}
            >
              {done ? '✓' : i + 1}
            </div>
            <span
              className={`mt-2 text-xs font-medium text-center ${
                active ? 'text-cyan-300' : done ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
