import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SectionContainer from '@/Components/SectionContainer';
import { exportToExcel } from '@/Utils/excelExport';
import { useState } from 'react';

export default function UsersIndex({ users, teams, filters }) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const isAdmin = currentUser?.isAdmin || false;
    const [expandedUsers, setExpandedUsers] = useState(new Set());
    const [searchFilters, setSearchFilters] = useState(filters || {});
    
    const handleFilter = () => {
        // Remove empty filter values
        const activeFilters = Object.fromEntries(
            Object.entries(searchFilters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );
        
        router.get(route('users.index'), activeFilters, {
            preserveState: true,
        });
    };

    const toggleExpand = (userId) => {
        const newExpanded = new Set(expandedUsers);
        if (newExpanded.has(userId)) {
            newExpanded.delete(userId);
        } else {
            newExpanded.add(userId);
        }
        setExpandedUsers(newExpanded);
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', userId));
        }
    };

    const handleExport = () => {
        // Get all unique leave types from all users
        const allLeaveTypes = new Map();
        users.forEach(user => {
            if (user.leave_balances && user.leave_balances.length > 0) {
                user.leave_balances.forEach(balance => {
                    if (!allLeaveTypes.has(balance.leave_type_id)) {
                        allLeaveTypes.set(balance.leave_type_id, balance.leave_type_name);
                    }
                });
            }
        });

        // Base columns
        const columns = [
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role', transform: (value) => value?.charAt(0).toUpperCase() + value?.slice(1) || '' },
            { key: 'team', label: 'Team', transform: (value) => value?.name || '-' },
        ];

        // Add columns for each leave type
        allLeaveTypes.forEach((leaveTypeName, leaveTypeId) => {
            columns.push({
                key: `leave_balance_${leaveTypeId}`,
                label: `${leaveTypeName} (Used/Available)`,
                transform: (value, row) => {
                    // Use row parameter directly since the key doesn't exist on the item
                    if (!row.leave_balances || row.leave_balances.length === 0) {
                        return '-';
                    }
                    const balance = row.leave_balances.find(b => b.leave_type_id === leaveTypeId);
                    if (!balance) {
                        return '-';
                    }
                    return `${balance.used_days}/${balance.available_days}`;
                }
            });
        });

        exportToExcel(users, columns, 'users');
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        {isAdmin && (
                            <Link href={route('users.create')}>
                                <PrimaryButton>Create User</PrimaryButton>
                            </Link>
                        )}
                        {!isAdmin && <div></div>}
                        <PrimaryButton onClick={handleExport}>
                            Export to Excel
                        </PrimaryButton>
                    </div>

                    {/* Filters */}
                    {teams && teams.length > 0 && (
                        <SectionContainer>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 justify-between items-center">
                                <div>
                                    <select
                                        value={searchFilters.team_id || ''}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, team_id: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    >
                                        <option value="">All Teams</option>
                                        {teams.map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <PrimaryButton onClick={handleFilter}>Filter</PrimaryButton>
                                </div>
                            </div>
                        </SectionContainer>
                    )}

                    {/* Users Table */}
                    <SectionContainer>
                        <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-8">
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Team
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Leave Balances
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {users.map((user) => {
                                            const isExpanded = expandedUsers.has(user.id);
                                            const hasLeaveBalances = user.leave_balances && user.leave_balances.length > 0;
                                            
                                            return (
                                                <>
                                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {hasLeaveBalances && (
                                                                <button
                                                                    onClick={() => toggleExpand(user.id)}
                                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                                >
                                                                    {isExpanded ? (
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {user.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {user.email}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' :
                                                                user.role === 'manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                                                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {user.team ? user.team.name : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                            {hasLeaveBalances ? (
                                                                <div className="flex flex-wrap gap-2">
                                                                    {user.leave_balances.map((balance) => (
                                                                        <span
                                                                            key={balance.leave_type_id}
                                                                            className="px-2 py-1 text-xs rounded"
                                                                            style={{
                                                                                backgroundColor: `${balance.leave_type_color}20`,
                                                                                color: balance.leave_type_color,
                                                                                border: `1px solid ${balance.leave_type_color}40`
                                                                            }}
                                                                        >
                                                                            {balance.leave_type_name}: {balance.used_days}/{balance.available_days}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex items-center gap-3">
                                                                {isAdmin && (
                                                                    <Link
                                                                        href={route('users.edit', user.id)}
                                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                {(user.role === 'employee' || user.role === 'manager' || user.role === 'admin') && (
                                                                    <Link
                                                                        href={route('leave-balances.index', { user_id: user.id })}
                                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                                    >
                                                                        Leave Balances
                                                                    </Link>
                                                                )}
                                                                {isAdmin && (
                                                                    <button
                                                                        onClick={() => handleDelete(user.id)}
                                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    {isExpanded && hasLeaveBalances && (
                                                        <tr key={`${user.id}-details`} className="bg-gray-50 dark:bg-gray-900">
                                                            <td colSpan={7} className="px-6 py-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                                        Leave Balances for {user.name}
                                                                    </h4>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                        {user.leave_balances.map((balance) => (
                                                                            <div
                                                                                key={balance.leave_type_id}
                                                                                className="p-3 rounded-lg border"
                                                                                style={{
                                                                                    borderColor: `${balance.leave_type_color}40`,
                                                                                    backgroundColor: `${balance.leave_type_color}10`
                                                                                }}
                                                                            >
                                                                                <div className="flex items-center gap-2 mb-2">
                                                                                    <div
                                                                                        className="w-3 h-3 rounded-full"
                                                                                        style={{ backgroundColor: balance.leave_type_color }}
                                                                                    />
                                                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                                        {balance.leave_type_name}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="space-y-1 text-xs">
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                                                                                        <span className="font-medium text-gray-900 dark:text-gray-100">{balance.total_days}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-gray-600 dark:text-gray-400">Used:</span>
                                                                                        <span className="font-medium text-red-600 dark:text-red-400">{balance.used_days}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                                                                                        <span className="font-medium text-yellow-600 dark:text-yellow-400">{balance.pending_days}</span>
                                                                                    </div>
                                                                                    <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700">
                                                                                        <span className="text-gray-600 dark:text-gray-400">Available:</span>
                                                                                        <span className="font-semibold text-green-600 dark:text-green-400">{balance.available_days}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                    </SectionContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

