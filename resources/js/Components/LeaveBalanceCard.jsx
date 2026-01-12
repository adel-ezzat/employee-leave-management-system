export default function LeaveBalanceCard({ balance }) {
    return (
        <div key={balance.id || balance.leave_type_id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-gray-100">
                {balance.leave_type}
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Total: {balance.total_days} days
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
                Used: {balance.used_days} days
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
                Pending: {balance.pending_days} days
            </div>
            <div className="mt-2 text-lg font-semibold text-blue-600 dark:text-blue-400">
                Available: {balance.available_days} days
            </div>
        </div>
    );
}

