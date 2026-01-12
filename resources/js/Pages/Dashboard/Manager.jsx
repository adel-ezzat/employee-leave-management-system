import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { formatDate, formatDateRange } from '@/Utils/dateFormatter';

export default function ManagerDashboard({ team, pendingRequests, approvedRequests, rejectedRequests, onLeaveToday, onLeaveNextWeek, leaveBalances, myLeaveRequests }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Manager Dashboard - {team?.name}
                </h2>
            }
        >
            <Head title="Manager Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Quick Actions */}
                    <div className="mb-6">
                        <Link href={route('leave-requests.create')}>
                            <PrimaryButton>Request Leave</PrimaryButton>
                        </Link>
                    </div>

                    {/* Leave Balances */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                My Leave Balances
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {leaveBalances.map((balance) => (
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
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* My Leave Requests */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                My Leave Requests
                            </h3>
                            {myLeaveRequests.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Leave Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Dates
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Days
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {myLeaveRequests.map((request) => (
                                                <tr key={request.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {request.leave_type.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {formatDateRange(request.start_date, request.end_date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {request.total_days}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                            request.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                        }`}>
                                                            {request.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('leave-requests.show', request.id)}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No leave requests yet</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Requests */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Team Pending Requests ({pendingRequests.length})
                            </h3>
                            {pendingRequests.length > 0 ? (
                                <div className="space-y-4">
                                    {pendingRequests.map((request) => (
                                        <div key={request.id} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                                        {request.user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {request.leave_type.name} - {formatDateRange(request.start_date, request.end_date)}
                                                    </div>
                                                    {request.reason && (
                                                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                            {request.reason}
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    href={route('leave-requests.show', request.id)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    Review
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No pending requests</p>
                            )}
                        </div>
                    </div>

                    {/* On Leave Today */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                On Leave Today ({onLeaveToday.length})
                            </h3>
                            {onLeaveToday.length > 0 ? (
                                <div className="space-y-2">
                                    {onLeaveToday.map((request) => (
                                        <div key={request.id} className="text-sm text-gray-900 dark:text-gray-100">
                                            {request.user.name} - {request.leave_type.name} ({formatDateRange(request.start_date, request.end_date)})
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No one on leave today</p>
                            )}
                        </div>
                    </div>

                    {/* On Leave Next Week */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                On Leave Next Week ({onLeaveNextWeek.length})
                            </h3>
                            {onLeaveNextWeek.length > 0 ? (
                                <div className="space-y-2">
                                    {onLeaveNextWeek.map((request) => (
                                        <div key={request.id} className="text-sm text-gray-900 dark:text-gray-100">
                                            {request.user.name} - {request.leave_type.name} ({formatDateRange(request.start_date, request.end_date)})
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">No one on leave next week</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

