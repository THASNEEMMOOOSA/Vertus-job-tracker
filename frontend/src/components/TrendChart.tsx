import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: { week: string; applications: number }[];
};

export default function TrendChart({ data }: Props) {
  return (
    <div className="rounded-2xl shadow-md border p-5 bg-white">
      <h2 className="text-xl font-semibold mb-4">Weekly Trend</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="applications" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}