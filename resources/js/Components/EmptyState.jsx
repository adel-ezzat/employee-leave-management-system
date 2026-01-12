export default function EmptyState({ message = 'No data available' }) {
    return (
        <p className="text-gray-500 dark:text-gray-400">{message}</p>
    );
}

