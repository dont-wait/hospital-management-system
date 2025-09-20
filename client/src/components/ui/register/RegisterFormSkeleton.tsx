const RegisterFormSkeleton = () => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6 animate-pulse bg-white">
      {/* Form Title Area */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CitizenID Field */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        {/* First Name Field */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>

        {/* Last Name Field */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="relative">
            <div className="h-10 bg-gray-200 rounded pr-10"></div>
            <div className="absolute right-3 top-3 h-4 w-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Phone Number Field */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-28"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>

      {/* Submit Button */}
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

export default RegisterFormSkeleton;
