export function Label({ children, className, ...props }) {
  return (
    <label className={`font-bold ${className}`} {...props}>
      {children}
    </label>
  );
}
