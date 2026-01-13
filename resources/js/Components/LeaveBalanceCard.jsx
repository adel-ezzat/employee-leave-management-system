export default function LeaveBalanceCard({ balance }) {
    const totalDays = balance.total_days || 0;
    const usedDays = balance.used_days || 0;
    const pendingDays = balance.pending_days || 0;
    const availableDays = balance.available_days || 0;
    
    // Calculate percentage used
    const usedPercentage = totalDays > 0 ? (usedDays / totalDays) * 100 : 0;
    const pendingPercentage = totalDays > 0 ? (pendingDays / totalDays) * 100 : 0;
    const availablePercentage = totalDays > 0 ? (availableDays / totalDays) * 100 : 0;

    // Determine color based on available days
    const getStatusColor = () => {
        if (availableDays === 0) return 'red';
        if (availableDays <= totalDays * 0.2) return 'yellow';
        return 'green';
    };

    const statusColor = getStatusColor();
    const colorClasses = {
        red: 'border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800',
        yellow: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800',
        green: 'border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800',
    };

    return (
        <div 
            key={balance.id || balance.leave_type_id} 
            className={`border rounded-lg p-5 hover:shadow-lg transition-all duration-200 ${colorClasses[statusColor]}`}
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                    {balance.leave_type}
                </h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Leave Balance
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Available
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {availableDays} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">days</span>
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 ${
                            statusColor === 'red' ? 'bg-red-500' :
                            statusColor === 'yellow' ? 'bg-yellow-500' :
                            'bg-green-500'
                        }`}
                        style={{ width: `${availablePercentage}%` }}
                    />
                </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Days</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{totalDays}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Used</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">{usedDays}</span>
                </div>
                {pendingDays > 0 && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Pending</span>
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">{pendingDays}</span>
                    </div>
                )}
            </div>

            {/* Usage Summary */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                        {usedDays + pendingDays} of {totalDays} days used
                    </span>
                    <span className={`font-semibold ${
                        statusColor === 'red' ? 'text-red-600 dark:text-red-400' :
                        statusColor === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                    }`}>
                        {Math.round(100 - availablePercentage)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

