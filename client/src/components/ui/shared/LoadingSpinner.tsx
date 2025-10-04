interface LoadingSpinnerProps {
  text: string;
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps) => (
  <div className="flex items-center space-x-2">
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    <span>{text}</span>
  </div>
);
