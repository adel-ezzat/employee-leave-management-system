export default function StatusBadge({ status }) {
    const statusClasses = {
        approved: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status] || statusClasses.pending}`}>
            {status}
        </span>
    );
}

