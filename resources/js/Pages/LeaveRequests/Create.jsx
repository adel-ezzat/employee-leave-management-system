import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function CreateLeaveRequest({ leaveTypes }) {
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: '',
        document: null,
    });

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const submit = (e) => {
        e.preventDefault();
        post(route('leave-requests.store'), {
            forceFormData: true,
        });
    };

    const handleLeaveTypeChange = (e) => {
        const leaveTypeId = e.target.value;
        setData('leave_type_id', leaveTypeId);
        const selected = leaveTypes.find(type => type.id === parseInt(leaveTypeId));
        setSelectedLeaveType(selected);
        // Clear document when changing leave type
        setData('document', null);
    };

    const handleStartDateChange = (e) => {
        const startDate = e.target.value;
        setData('start_date', startDate);
        // If end_date is before the new start_date, clear it
        if (data.end_date && startDate && data.end_date < startDate) {
            setData('end_date', '');
        }
    };

    const handleDocumentChange = (e) => {
        setData('document', e.target.files[0]);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Request Leave
                </h2>
            }
        >
            <Head title="Request Leave" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="leave_type_id" value="Leave Type" />
                                    <select
                                        id="leave_type_id"
                                        value={data.leave_type_id}
                                        onChange={handleLeaveTypeChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        required
                                    >
                                        <option value="">Select Leave Type</option>
                                        {leaveTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.leave_type_id} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="start_date" value="Start Date" />
                                    <TextInput
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={handleStartDateChange}
                                        min={today}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.start_date} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="end_date" value="End Date" />
                                    <TextInput
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        min={data.start_date || today}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.end_date} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="reason" value="Reason (Optional)" />
                                    <textarea
                                        id="reason"
                                        value={data.reason}
                                        onChange={(e) => setData('reason', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        rows="4"
                                    />
                                    <InputError message={errors.reason} className="mt-2" />
                                </div>

                                {selectedLeaveType?.requires_medical_document && (
                                    <div className="mb-4">
                                        <InputLabel htmlFor="document" value="Medical Document (Required)" />
                                        <input
                                            key={data.leave_type_id}
                                            id="document"
                                            type="file"
                                            onChange={handleDocumentChange}
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                                dark:file:bg-gray-700 dark:file:text-gray-300"
                                            required
                                        />
                                        {data.document && (
                                            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                                                Selected: {data.document.name}
                                            </p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Accepted formats: PDF, JPG, JPEG, PNG (Max: 10MB)
                                        </p>
                                        <InputError message={errors.document} className="mt-2" />
                                    </div>
                                )}

                                <div className="flex items-center justify-end">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        Submit Request
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

