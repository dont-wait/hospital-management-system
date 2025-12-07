interface ServiceCardProps {
  serviceTitle: string;
  serviceDescription: string;
}

export default function ServiceCard({
  serviceTitle,
  serviceDescription,
}: ServiceCardProps) {
  return (
    <div className="py-6 w-full flex flex-col items-center justify-center border-2 border-silver rounded-md shadow-md">
      <div className="px-6 py-4 flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold">{serviceTitle}</h3>
      </div>
      <p className="text-center text-sm text-[#737373] px-6">
        {serviceDescription}
      </p>
    </div>
  );
}
