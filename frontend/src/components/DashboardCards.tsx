type Props = {
  title: string;
  value: number;
};

export default function DashboardCard({ title, value }: Props) {
  return (
    <div className="rounded-2xl shadow-md border p-5 bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}