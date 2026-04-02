// StatusChart.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = {
  Applied: "#F59E0B",
  Interview: "#8B5CF6",
  Offer: "#10B981",
  Rejected: "#EF4444"
};

type Props = {
  data: { name: string; value: number; color: string }[];
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg border border-gray-200 rounded-lg text-sm">
        <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
        <p className="text-gray-600">{payload[0].value} applications</p>
        <p className="text-xs text-gray-400 mt-1">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

export default function StatusChart({ data }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const chartData = data.map(item => ({ ...item, total }));

  // Custom label rendering function
  const renderCustomLabel = (props: any) => {
    const { name, percent } = props;
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Application Status Distribution</h2>
          <p className="text-xs text-gray-500 mt-0.5">Overview of your application pipeline</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500">Total applications</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            innerRadius={50}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#9CA3AF"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3 text-center text-sm">
          <div>
            <p className="text-xs text-gray-500">Conversion Rate</p>
            <p className="font-semibold text-gray-900">
              {data.find(d => d.name === "Offer")?.value 
                ? ((data.find(d => d.name === "Offer")?.value || 0) / total * 100).toFixed(1)
                : "0"}%
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Interview Rate</p>
            <p className="font-semibold text-gray-900">
              {data.find(d => d.name === "Interview")?.value 
                ? ((data.find(d => d.name === "Interview")?.value || 0) / total * 100).toFixed(1)
                : "0"}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}