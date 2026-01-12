export default function StatsCard({ label, value, color = 'gray' }) {
    const colorClasses = {
        gray: 'text-gray-900 dark:text-gray-100',
        yellow: 'text-yellow-600 dark:text-yellow-400',
        green: 'text-green-600 dark:text-green-400',
        red: 'text-red-600 dark:text-red-400',
    };

    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
                <div className={`mt-2 text-3xl font-semibold ${colorClasses[color]}`}>
                    {value || 0}
                </div>
            </div>
        </div>
    );
}

