import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';
import { formatDateRange } from '@/Utils/dateFormatter';

export default function LeaveRequestsIndex({ leaveRequests, filters, users }) {
    const [searchFilters, setSearchFilters] = useState(filters || {});

    const handleFilter = () => {
        // Remove empty filter values
        const filters = Object.fromEntries(
            Object.entries(searchFilters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );
        
        router.get(route('leave-requests.index'), filters, {
            preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leave Requests
                </h2>
            }
        >
            <Head title="Leave Requests" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <Link href={route('leave-requests.create')}>
                            <PrimaryButton>Request Leave</PrimaryButton>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                                {users && users.length > 0 && (
                                    <div>
                                        <select
                                            value={searchFilters.user_id || ''}
                                            onChange={(e) => setSearchFilters({ ...searchFilters, user_id: e.target.value })}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        >
                                            <option value="">All Users</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <select
                                        value={searchFilters.status || ''}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, status: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                                <div>
                                    <TextInput
                                        type="date"
                                        value={searchFilters.date_from || ''}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, date_from: e.target.value })}
                                        placeholder="From Date"
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        type="date"
                                        value={searchFilters.date_to || ''}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, date_to: e.target.value })}
                                        placeholder="To Date"
                                    />
                                </div>
                                <div>
                                    <PrimaryButton onClick={handleFilter}>Filter</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leave Requests Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Team
                                            </th>
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
                                        {leaveRequests.data.map((request) => (
                                            <tr key={request.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {request.user?.name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {request.user?.team?.name || 'No Team'}
                                                </td>
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

                            {/* Pagination */}
                            {leaveRequests.links && (
                                <div className="mt-4">
                                    {Object.entries(leaveRequests.links).map(([key, link]) => (
                                        <Link
                                            key={key}
                                            href={link.url || '#'}
                                            className={`px-3 py-2 mx-1 rounded ${
                                                link.active
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

