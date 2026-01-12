import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';
import SectionContainer from '@/Components/SectionContainer';
import EmptyState from '@/Components/EmptyState';
import { formatDateRange } from '@/Utils/dateFormatter';

export default function AdminDashboard({ stats, recentRequests, myLeaveRequests }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-5">
                        <StatsCard label="Total Teams" value={stats.total_teams} color="gray" />
                        <StatsCard label="Total Employees" value={stats.total_employees} color="gray" />
                        <StatsCard label="Pending Requests" value={stats.pending_requests} color="yellow" />
                        <StatsCard label="Approved Requests" value={stats.approved_requests} color="green" />
                        <StatsCard label="Rejected Requests" value={stats.rejected_requests} color="red" />
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-6">
                        <div className="flex gap-4 flex-wrap">
                            <Link href={route('users.create')}>
                                <PrimaryButton>Create User</PrimaryButton>
                            </Link>
                            <Link href={route('teams.create')}>
                                <PrimaryButton>Create Team</PrimaryButton>
                            </Link>
                            <Link href={route('leave-types.create')}>
                                <PrimaryButton>Create Leave Type</PrimaryButton>
                            </Link>
                            <Link href={route('users.index')}>
                                <PrimaryButton>Manage Users</PrimaryButton>
                            </Link>
                            <Link href={route('leave-requests.index')}>
                                <PrimaryButton>View All Requests</PrimaryButton>
                            </Link>
                        </div>
                    </div>

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

                    {/* Recent Requests */}
                    <SectionContainer title="Recent Leave Requests (All Users)">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Leave Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Dates
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                    {recentRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {request.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {request.leave_type.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {formatDateRange(request.start_date, request.end_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={request.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SectionContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

