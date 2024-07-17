export function Card({ children, className, ...props }) {
  return (
    <div className={`border rounded-lg p-4 shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, ...props }) {
  return (
    <div className='p-4' {...props}>
      {children}
    </div>
  );
}
