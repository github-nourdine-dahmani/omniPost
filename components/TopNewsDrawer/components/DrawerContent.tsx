type DrawerContentProps = {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
};

export const DrawerContent: React.FC<DrawerContentProps> = ({ isOpen, onClose, children }) => {
    return (
        <div className={`fixed inset-y-0 right-0 z-50 w-[90%] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Review Top News
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};