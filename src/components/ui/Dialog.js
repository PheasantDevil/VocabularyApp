export function Dialog({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-4 rounded-lg max-w-md w-full'>{children}</div>
    </div>
  );
}

export function DialogContent({ children }) {
  return <div className='mt-4'>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className='text-lg font-bold'>{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className='text-xl font-bold'>{children}</h2>;
}

export function DialogFooter({ children }) {
  return <div className='mt-4 flex justify-end space-x-2'>{children}</div>;
}
