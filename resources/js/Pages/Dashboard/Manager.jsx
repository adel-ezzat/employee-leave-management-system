import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';
import LeaveBalanceCard from '@/Components/LeaveBalanceCard';
import SectionContainer from '@/Components/SectionContainer';
import EmptyState from '@/Components/EmptyState';
import { formatDate, formatDateRange } from '@/Utils/dateFormatter';

export default function ManagerDashboard({ team, stats, pendingRequests, approvedRequests, rejectedRequests, onLeaveToday, onLeaveNextWeek, leaveBalances, myLeaveRequests }) {
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
                    <SectionContainer title="My Leave Requests">
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
                            <EmptyState message="No pending requests" />
                        )}
                    </SectionContainer>

                    {/* On Leave Today */}
                    <SectionContainer title={`On Leave Today (${onLeaveToday.length})`}>
                        {onLeaveToday.length > 0 ? (
                            <div className="space-y-2">
                                {onLeaveToday.map((request) => (
                                    <div key={request.id} className="text-sm text-gray-900 dark:text-gray-100">
                                        {request.user.name} - {request.leave_type.name} ({formatDateRange(request.start_date, request.end_date)})
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
                            <div className="space-y-2">
                                {onLeaveNextWeek.map((request) => (
                                    <div key={request.id} className="text-sm text-gray-900 dark:text-gray-100">
                                        {request.user.name} - {request.leave_type.name} ({formatDateRange(request.start_date, request.end_date)})
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

