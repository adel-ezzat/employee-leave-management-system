import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { useState } from 'react';

export default function LeaveTypesIndex({ leaveTypes }) {
    const [deletingId, setDeletingId] = useState(null);

    const handleToggleActive = (leaveType) => {
        router.patch(route('leave-types.update', leaveType.id), {
            is_active: !leaveType.is_active,
        });
    };

    const handleDelete = (leaveType) => {
        if (window.confirm(`Are you sure you want to delete "${leaveType.name}"? This action cannot be undone.`)) {
            setDeletingId(leaveType.id);
            router.delete(route('leave-types.destroy', leaveType.id), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leave Types
                </h2>
            }
        >
            <Head title="Leave Types" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('leave-types.create')}>
                            <PrimaryButton>Create Leave Type</PrimaryButton>
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Slug
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Paid
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Max Days/Year
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Medical Doc
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Leave Requests
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
                                        {leaveTypes.map((leaveType) => (
                                            <tr key={leaveType.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-4 h-4 rounded mr-2"
                                                            style={{ backgroundColor: leaveType.color }}
                                                        />
                                                        {leaveType.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {leaveType.slug}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {leaveType.is_paid ? 'Yes' : 'No'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {leaveType.max_days_per_year || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {leaveType.requires_medical_document ? 'Yes' : 'No'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {leaveType.leave_requests_count || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        leaveType.is_active
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                                    }`}>
                                                        {leaveType.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <Link
                                                            href={route('leave-types.edit', leaveType.id)}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                        {leaveType.leave_requests_count === 0 && (
                                                            <button
                                                                onClick={() => handleDelete(leaveType)}
                                                                disabled={deletingId === leaveType.id}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                                                            >
                                                                {deletingId === leaveType.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


