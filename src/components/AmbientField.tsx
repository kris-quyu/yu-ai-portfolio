type AmbientFieldProps = {
  className?: string;
};

export default function AmbientField({ className = "" }: AmbientFieldProps) {
  return <div className={`ambient-field ${className}`.trim()} aria-hidden="true" />;
}
