import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';
import LeaveBalanceCard from '@/Components/LeaveBalanceCard';
import SectionContainer from '@/Components/SectionContainer';
import EmptyState from '@/Components/EmptyState';
import { formatDate, formatDateRange } from '@/Utils/dateFormatter';
import { exportToExcel } from '@/Utils/excelExport';

export default function ManagerDashboard({ team, stats, pendingRequests, approvedRequests, rejectedRequests, onLeaveToday, onLeaveNextWeek, leaveBalances, myLeaveRequests }) {
    const handleExportMyRequests = () => {
        const columns = [
            { key: 'leave_type', label: 'Leave Type', transform: (value) => value?.name || 'N/A' },
            { key: 'start_date', label: 'Start Date' },
            { key: 'end_date', label: 'End Date' },
            { key: 'total_days', label: 'Days' },
            { key: 'status', label: 'Status', transform: (value) => value?.charAt(0).toUpperCase() + value?.slice(1) || '' },
        ];
        exportToExcel(myLeaveRequests, columns, 'my_leave_requests');
    };

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
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
                        <StatsCard label="Total Employees" value={stats?.total_employees} color="gray" />
                        <StatsCard label="Pending Requests" value={stats?.pending_requests} color="yellow" />
                        <StatsCard label="Approved Requests" value={stats?.approved_requests} color="green" />
                        <StatsCard label="Rejected Requests" value={stats?.rejected_requests} color="red" />
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6">
                        <Link href={route('leave-requests.create')}>
                            <PrimaryButton>Request Leave</PrimaryButton>
                        </Link>
                    </div>

                    {/* Leave Balances */}
                    <SectionContainer title="My Leave Balances">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {leaveBalances.map((balance) => (
                                <LeaveBalanceCard key={balance.id || balance.leave_type_id} balance={balance} />
                            ))}
                        </div>
                    </SectionContainer>

                    {/* My Leave Requests */}
                    <SectionContainer 
                        title="My Leave Requests"
                        action={
                            myLeaveRequests.length > 0 && (
                                <PrimaryButton onClick={handleExportMyRequests}>
                                    Export to Excel
                                </PrimaryButton>
                            )
                        }
                    >
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
                                                    <StatusBadge status={request.status} />
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
                            <EmptyState message="No leave requests yet" />
                        )}
                    </SectionContainer>

                    {/* Pending Requests */}
                    <SectionContainer title={`Team Pending Requests (${pendingRequests.length})`}>
                        {pendingRequests.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {pendingRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/40 flex items-center justify-center">
                                                        <span className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm">
                                                            {request.user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {request.user.name}
                                                        </div>
                                                        {request.user.email && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {request.user.email}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <StatusBadge status={request.status} />
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Leave Type:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-semibold">{request.leave_type.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Period:</span>
                                                <span className="text-gray-900 dark:text-gray-100">{formatDateRange(request.start_date, request.end_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Days:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-semibold">{request.total_days} {request.total_days === 1 ? 'day' : 'days'}</span>
                                            </div>
                                        </div>

                                        {request.reason && (
                                            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Reason:</div>
                                                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                                    {request.reason}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end pt-3 border-t border-yellow-200 dark:border-yellow-800">
                                            <Link
                                                href={route('leave-requests.show', request.id)}
                                                className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-md transition-colors duration-200 dark:bg-yellow-700 dark:hover:bg-yellow-600"
                                            >
                                                Review Request
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No pending requests" />
                        )}
                    </SectionContainer>

                    {/* On Leave Today */}
                    <SectionContainer title={`On Leave Today (${onLeaveToday.length})`}>
                        {onLeaveToday.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {onLeaveToday.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                                                <span className="text-green-700 dark:text-green-300 font-semibold text-sm">
                                                    {request.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                    {request.user.name}
                                                </div>
                                                {request.user.email && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {request.user.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Leave Type:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-semibold">{request.leave_type.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Period:</span>
                                                <span className="text-gray-900 dark:text-gray-100">{formatDateRange(request.start_date, request.end_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Days:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-semibold">{request.total_days} {request.total_days === 1 ? 'day' : 'days'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                                            <Link
                                                href={route('leave-requests.show', request.id)}
                                                className="text-sm text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
                                            >
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No one on leave today" />
                        )}
                    </SectionContainer>

                    {/* On Leave Next Week */}
                    <SectionContainer title={`On Leave Next Week (${onLeaveNextWeek.length})`}>
                        {onLeaveNextWeek.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {onLeaveNextWeek.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                                                    {request.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                    {request.user.name}
                                                </div>
                                                {request.user.email && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {request.user.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Leave Type:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-semibold">{request.leave_type.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Period:</span>
                                                <span className="text-gray-900 dark:text-gray-100">{formatDateRange(request.start_date, request.end_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-600 dark:text-gray-400 font-medium">Days:</span>
                                                <span className="text-gray-900 dark:text-gray-100 font-semibold">{request.total_days} {request.total_days === 1 ? 'day' : 'days'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                                            <Link
                                                href={route('leave-requests.show', request.id)}
                                                className="text-sm text-blue-700 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                            >
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState message="No one on leave next week" />
                        )}
                    </SectionContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

