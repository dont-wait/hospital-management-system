const LoginFormSkeleton = () => {
  return (
    <div className="w-full max-w-sm mx-auto p-6 space-y-4 animate-pulse bg-white">
      {/* Form Title Area */}
      <div className="space-y-2 mb-6">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>

      {/* CitizenID Field */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-36"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="relative">
          <div className="h-10 bg-gray-200 rounded pr-10"></div>
          <div className="absolute right-3 top-3 h-4 w-4 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>

      {/* Additional Links Area */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
};

export default LoginFormSkeleton;
