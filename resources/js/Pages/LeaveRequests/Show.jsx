import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { usePage } from '@inertiajs/react';
import { formatDate } from '@/Utils/dateFormatter';
import { useState } from 'react';

export default function ShowLeaveRequest({ leaveRequest }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const canApprove = user?.isAdmin || (user?.isManager && leaveRequest.user?.team_id === user.team_id);

    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleApprove = (e) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('leave-requests.approve', leaveRequest.id), {
            status: 'approved',
            rejection_reason: null,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        setProcessing(true);
        router.post(route('leave-requests.approve', leaveRequest.id), {
            status: 'rejected',
            rejection_reason: rejectionReason,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Leave Request Details
                </h2>
            }
        >
            <Head title="Leave Request Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee</div>
                                        <div className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                                            {leaveRequest.user.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Team</div>
                                        <div className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                                            {leaveRequest.user?.team?.name || 'No Team'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Leave Type</div>
                                        <div className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                                            {leaveRequest.leave_type.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</div>
                                        <div className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                                            {formatDate(leaveRequest.start_date)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date</div>
                                        <div className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                                            {formatDate(leaveRequest.end_date)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Days</div>
                                        <div className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                                            {leaveRequest.total_days}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                                        <div className="mt-1">
                                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                                                leaveRequest.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                                                leaveRequest.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                            }`}>
                                                {leaveRequest.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {leaveRequest.reason && (
                                    <div className="mt-6">
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Reason</div>
                                        <div className="mt-1 text-gray-900 dark:text-gray-100">
                                            {leaveRequest.reason}
                                        </div>
                                    </div>
                                )}

                                {leaveRequest.rejection_reason && (
                                    <div className="mt-6">
                                        <div className="text-sm font-medium text-red-500 dark:text-red-400">Rejection Reason</div>
                                        <div className="mt-1 text-red-900 dark:text-red-100">
                                            {leaveRequest.rejection_reason}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {canApprove && leaveRequest.status === 'pending' && (
                                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="rejection_reason" value="Rejection Reason (Required if rejecting)" />
                                            <textarea
                                                id="rejection_reason"
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                                rows="3"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <form onSubmit={handleApprove}>
                                                <PrimaryButton type="submit" disabled={processing}>
                                                    Approve
                                                </PrimaryButton>
                                            </form>
                                            <form onSubmit={handleReject}>
                                                <DangerButton type="submit" disabled={processing || !rejectionReason.trim()}>
                                                    Reject
                                                </DangerButton>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

