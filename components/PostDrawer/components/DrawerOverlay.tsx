type DrawerOverlayProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-800/75 transition-opacity"
            onClick={onClose}
        />
    );
};