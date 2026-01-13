import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import StatsCard from '@/Components/StatsCard';
import StatusBadge from '@/Components/StatusBadge';
import LeaveBalanceCard from '@/Components/LeaveBalanceCard';
import SectionContainer from '@/Components/SectionContainer';
import EmptyState from '@/Components/EmptyState';
import { formatDateRange } from '@/Utils/dateFormatter';
import { exportToExcel } from '@/Utils/excelExport';

export default function EmployeeDashboard({ stats, leaveRequests, leaveBalances }) {
    const handleExport = () => {
        const columns = [
            { key: 'leave_type', label: 'Leave Type', transform: (value) => value?.name || 'N/A' },
            { key: 'start_date', label: 'Start Date' },
            { key: 'end_date', label: 'End Date' },
            { key: 'total_days', label: 'Days' },
            { key: 'status', label: 'Status', transform: (value) => value?.charAt(0).toUpperCase() + value?.slice(1) || '' },
        ];
        exportToExcel(leaveRequests, columns, 'my_leave_requests');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    My Dashboard
                </h2>
            }
        >
            <Head title="Employee Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
                        <StatsCard label="Pending Requests" value={stats?.pending_requests} color="yellow" />
                        <StatsCard label="Approved Requests" value={stats?.approved_requests} color="green" />
                        <StatsCard label="Rejected Requests" value={stats?.rejected_requests} color="red" />
                    </div>

                    {/* Quick Action */}
                    <div className="mb-6">
                        <Link href={route('leave-requests.create')}>
                            <PrimaryButton>Request Leave</PrimaryButton>
                        </Link>
                    </div>

                    {/* Leave Balances */}
                    <SectionContainer title="Leave Balances">
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
                            leaveRequests.length > 0 && (
                                <PrimaryButton onClick={handleExport}>
                                    Export to Excel
                                </PrimaryButton>
                            )
                        }
                    >
                        {leaveRequests.length > 0 ? (
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
                                        {leaveRequests.map((request) => (
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

