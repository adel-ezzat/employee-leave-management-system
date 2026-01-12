import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function LeaveBalancesIndex({ balances, user, year, canEdit, availableLeaveTypes = [] }) {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: user?.id || '',
        leave_type_id: '',
        total_days: '',
        year: year,
    });

    const handleEdit = (balance) => {
        setEditingId(balance.id);
        setEditValue(balance.total_days.toString());
    };

    const handleSave = (balanceId) => {
        router.patch(route('leave-balances.update', balanceId), {
            total_days: parseInt(editValue),
        }, {
            onSuccess: () => {
                setEditingId(null);
                setEditValue('');
            },
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue('');
    };

    const handleAddBalance = (e) => {
        e.preventDefault();
        post(route('leave-balances.store'), {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const handleCancelAdd = () => {
        reset();
        setShowAddForm(false);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leave Balances{user && ` - ${user.name}`}
                </h2>
            }
        >
            <Head title="Leave Balances" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {user && (
                        <div className="mb-6">
                            <Link
                                href={route('users.index')}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                ← Back to Users
                            </Link>
                        </div>
                    )}

                    <div className="mb-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Year: {year}
                        </div>
                        {canEdit && (
                            availableLeaveTypes.length > 0 ? (
                                <PrimaryButton onClick={() => setShowAddForm(!showAddForm)}>
                                    {showAddForm ? 'Cancel' : 'Add Leave Balance'}
                                </PrimaryButton>
                            ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    All leave types already have balances
                                </span>
                            )
                        )}
                    </div>

                    {showAddForm && canEdit && availableLeaveTypes.length > 0 && (
                        <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                    Add New Leave Balance
                                </h3>
                                <form onSubmit={handleAddBalance}>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <InputLabel htmlFor="leave_type_id" value="Leave Type" />
                                            <select
                                                id="leave_type_id"
                                                value={data.leave_type_id}
                                                onChange={(e) => {
                                                    setData('leave_type_id', e.target.value);
                                                    const selectedType = availableLeaveTypes.find(lt => lt.id === parseInt(e.target.value));
                                                    if (selectedType && selectedType.max_days_per_year) {
                                                        setData('total_days', selectedType.max_days_per_year);
                                                    }
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                                required
                                            >
                                                <option value="">Select Leave Type</option>
                                                {availableLeaveTypes.map((leaveType) => (
                                                    <option key={leaveType.id} value={leaveType.id}>
                                                        {leaveType.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.leave_type_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="total_days" value="Total Days" />
                                            <TextInput
                                                id="total_days"
                                                type="number"
                                                value={data.total_days}
                                                onChange={(e) => setData('total_days', e.target.value)}
                                                className="mt-1 block w-full"
                                                min="0"
                                                required
                                            />
                                            <InputError message={errors.total_days} className="mt-2" />
                                        </div>

                                        <div className="flex items-end">
                                            <div className="flex gap-2">
                                                <PrimaryButton type="submit" disabled={processing}>
                                                    {processing ? 'Adding...' : 'Add Balance'}
                                                </PrimaryButton>
                                                <button
                                                    type="button"
                                                    onClick={handleCancelAdd}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Leave Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Total Days
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Used Days
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Pending Days
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                Available Days
                                            </th>
                                            {canEdit && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {balances.length > 0 ? (
                                            balances.map((balance) => (
                                                <tr key={balance.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="w-4 h-4 rounded mr-2"
                                                                style={{ backgroundColor: balance.leave_type?.color || '#1677FF' }}
                                                            />
                                                            {balance.leave_type?.name || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {editingId === balance.id ? (
                                                            <div className="flex items-center gap-2">
                                                                <TextInput
                                                                    type="number"
                                                                    value={editValue}
                                                                    onChange={(e) => setEditValue(e.target.value)}
                                                                    className="w-20"
                                                                    min="0"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={() => handleSave(balance.id)}
                                                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={handleCancel}
                                                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span>{balance.total_days}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {balance.used_days}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                        {balance.pending_days}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                        {balance.available_days !== undefined 
                                                            ? balance.available_days 
                                                            : Math.max(0, (balance.total_days || 0) - (balance.used_days || 0) - (balance.pending_days || 0))
                                                        }
                                                    </td>
                                                    {canEdit && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            {editingId === balance.id ? (
                                                                <span className="text-gray-400">Editing...</span>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleEdit(balance)}
                                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={canEdit ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    No leave balances found for this year.
                                                </td>
                                            </tr>
                                        )}
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

