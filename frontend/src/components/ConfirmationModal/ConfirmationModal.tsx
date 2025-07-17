import { FC } from 'react';
import { Button } from '..';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0  overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">{message}</p>
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={onConfirm} variant="danger" className="w-24 mr-2">
              Да
            </Button>
            <Button onClick={onClose} variant="secondary" className="w-24 ml-2">
              Отмена
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
