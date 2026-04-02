// TrendChart.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Area, ComposedChart } from "recharts";

type Props = {
  data: { week: string; applications: number }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg border border-gray-200 rounded-lg text-sm">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-gray-600">
          <span className="font-semibold">{payload[0].value}</span> applications submitted
        </p>
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data }: Props) {
  const maxApplications = Math.max(...data.map(d => d.applications), 1);
  const average = data.length > 0 
    ? (data.reduce((sum, d) => sum + d.applications, 0) / data.length).toFixed(1)
    : "0";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Weekly Application Trend</h2>
          <p className="text-xs text-gray-500 mt-0.5">Application submission history</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{average}</p>
          <p className="text-xs text-gray-500">Weekly average</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <defs>
            <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
          <XAxis 
            dataKey="week" 
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            domain={[0, maxApplications + 1]}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="applications" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fill="url(#colorApplications)"
          />
          <Line 
            type="monotone" 
            dataKey="applications" 
            stroke="#2563EB" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#2563EB' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Applications per week</span>
        </div>
        <div>
          {data.length > 0 && (
            <span>Total: {data.reduce((sum, d) => sum + d.applications, 0)} applications</span>
          )}
        </div>
      </div>
    </div>
  );
}