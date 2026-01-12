import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

export default function EditLeaveType({ leaveType }) {
    const { data, setData, put, processing, errors } = useForm({
        name: leaveType.name || '',
        slug: leaveType.slug || '',
        description: leaveType.description || '',
        is_paid: leaveType.is_paid ?? true,
        max_days_per_year: leaveType.max_days_per_year || '',
        requires_medical_document: leaveType.requires_medical_document ?? false,
        color: leaveType.color || '#1677FF',
        is_active: leaveType.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('leave-types.update', leaveType.id));
    };

    // Auto-generate slug from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        setData('name', name);
        setData('slug', name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Edit Leave Type
                </h2>
            }
        >
            <Head title="Edit Leave Type" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <InputLabel htmlFor="name" value="Leave Type Name" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="slug" value="Slug" />
                                    <TextInput
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="description" value="Description (Optional)" />
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                        rows="3"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            name="is_paid"
                                            checked={data.is_paid}
                                            onChange={(e) => setData('is_paid', e.target.checked)}
                                        />
                                        <InputLabel htmlFor="is_paid" value="Is Paid Leave" className="ml-2" />
                                    </div>
                                    <InputError message={errors.is_paid} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="max_days_per_year" value="Max Days Per Year (Optional)" />
                                    <TextInput
                                        id="max_days_per_year"
                                        type="number"
                                        value={data.max_days_per_year}
                                        onChange={(e) => setData('max_days_per_year', e.target.value ? parseInt(e.target.value) : null)}
                                        className="mt-1 block w-full"
                                        min="1"
                                    />
                                    <InputError message={errors.max_days_per_year} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            name="requires_medical_document"
                                            checked={data.requires_medical_document}
                                            onChange={(e) => setData('requires_medical_document', e.target.checked)}
                                        />
                                        <InputLabel htmlFor="requires_medical_document" value="Requires Medical Document" className="ml-2" />
                                    </div>
                                    <InputError message={errors.requires_medical_document} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <InputLabel htmlFor="color" value="Color" />
                                    <div className="mt-1 flex items-center gap-4">
                                        <input
                                            id="color"
                                            type="color"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="h-10 w-20 rounded border-gray-300"
                                        />
                                        <TextInput
                                            type="text"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="block w-32"
                                            placeholder="#1677FF"
                                        />
                                    </div>
                                    <InputError message={errors.color} className="mt-2" />
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            name="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <InputLabel htmlFor="is_active" value="Is Active" className="ml-2" />
                                    </div>
                                    <InputError message={errors.is_active} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('leave-types.index')}
                                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                                    >
                                        Cancel
                                    </Link>
                                    <PrimaryButton disabled={processing}>
                                        Update Leave Type
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

