export default function SectionContainer({ title, children, className = '', action }) {
    return (
        <div className={`mb-6 overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 ${className}`}>
            <div className="p-6">
                {(title || action) && (
                    <div className="flex justify-between items-center mb-4">
                        {title && (
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {title}
                            </h3>
                        )}
                        {action && (
                            <div>{action}</div>
                        )}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

