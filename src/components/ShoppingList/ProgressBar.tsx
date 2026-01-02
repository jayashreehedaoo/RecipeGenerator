export default function ProgressBar({ progress, purchasedCount, totalItems }: { progress: number, purchasedCount: number, totalItems: number }) {
    return (
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col xs:flex-row justify-between text-xs sm:text-sm mb-2 gap-1">
            <span className="text-gray-600">
              Progress: {purchasedCount} / {totalItems} items
            </span>
            <span className="font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
    )
};