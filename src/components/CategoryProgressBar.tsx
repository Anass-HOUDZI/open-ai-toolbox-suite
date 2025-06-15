
interface CategoryProgressBarProps {
  available: number;
  total: number;
}
export default function CategoryProgressBar({ available, total }: CategoryProgressBarProps) {
  const pct = Math.round((available / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1 text-sm font-medium text-gray-700">
        <span>Outils disponibles</span>
        <span>{available} / {total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
        <div
          className="bg-gradient-to-r from-green-400 via-yellow-400 to-pink-400 h-3 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
