export default function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-east-bay text-sm mb-1">{label}</p>
      <p className="text-martinique font-medium">{value}</p>
    </div>
  );
}
