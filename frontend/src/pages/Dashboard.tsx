// dashboard.tsx - Complete Optimized Version
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import JobsTable from "../components/JobsTable";
import JobFilters from "../components/JobFilters";
import AddJobModal from "../components/AddJobModal";
import StatusChart from "../components/StatusChart";
import TrendChart from "../components/TrendChart";
import { Plus, TrendingUp, Briefcase, Clock, CheckCircle, Activity, Download, RefreshCw, LogOut, BarChart3, Target, Award, Settings, LayoutDashboard, FileText, PieChart } from "lucide-react";
import vertusLogo from "../assets/vertusf.png";

type Job = {
  id: number;
  company_name: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  applied_date: string;
  location?: string;
  source?: string;
  notes?: string;
};

type TabType = "dashboard" | "applications" | "analytics" | "settings";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data);
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchJobs();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      (job.company_name.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase())) &&
      (status ? job.status === status : true)
  );

  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === "Applied").length;
  const interview = jobs.filter((j) => j.status === "Interview").length;
  const offer = jobs.filter((j) => j.status === "Offer").length;
  const rejected = jobs.filter((j) => j.status === "Rejected").length;
  
  const successRate = total > 0 ? ((offer / total) * 100).toFixed(1) : "0";
  const interviewRate = total > 0 ? ((interview / total) * 100).toFixed(1) : "0";

  const stats = { total, applied, interview, offer, rejected, successRate, interviewRate };

  const statusChartData = [
    { name: "Applied", value: stats.applied, color: "#F59E0B" },
    { name: "Interview", value: stats.interview, color: "#8B5CF6" },
    { name: "Offer", value: stats.offer, color: "#10B981" },
    { name: "Rejected", value: stats.rejected, color: "#EF4444" },
  ].filter((item) => item.value > 0);

  const getTrendData = () => {
    const weeks: { [key: string]: number } = {};
    const sortedJobs = [...jobs].sort((a, b) => new Date(a.applied_date).getTime() - new Date(b.applied_date).getTime());
    
    sortedJobs.forEach((job) => {
      const date = new Date(job.applied_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];
      weeks[weekKey] = (weeks[weekKey] || 0) + 1;
    });

    return Object.entries(weeks)
      .map(([week, applications]) => ({ 
        week: new Date(week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
        applications 
      }))
      .slice(-8);
  };

  const trendData = getTrendData();

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this application? This action cannot be undone.")) return;
    try {
      await API.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (error: any) {
      console.error("Error deleting job:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["Company", "Role", "Status", "Applied Date", "Location", "Source"];
    const csvData = jobs.map(job => [
      `"${job.company_name}"`,
      `"${job.role}"`,
      job.status,
      job.applied_date,
      `"${job.location || ""}"`,
      `"${job.source || ""}"`
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vertus-applications-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`w-5 h-5 ${color.replace('bg-opacity-10', '').replace('bg-', 'text-')}`} />
          </div>
          {trend && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium tracking-wide">{title}</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${color.replace('bg-opacity-10', '')}`}></div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance Metrics</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard title="Total Applications" value={stats.total} icon={Briefcase} color="bg-blue-600" subtitle="All time applications" />
                <StatCard title="Active Pipeline" value={stats.applied + stats.interview} icon={Clock} color="bg-yellow-600" subtitle={`${stats.applied} applied, ${stats.interview} interviewing`} />
                <StatCard title="Success Rate" value={`${stats.successRate}%`} icon={Award} color="bg-green-600" trend={`${stats.offer} offers received`} />
                <StatCard title="Interview Rate" value={`${stats.interviewRate}%`} icon={TrendingUp} color="bg-purple-600" subtitle={`${stats.interview} interviews scheduled`} />
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Analytics & Insights</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusChart data={statusChartData} />
                <TrendChart data={trendData} />
              </div>
            </div>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="w-4 h-4 text-gray-500" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Applications</h3>
              </div>
              <JobFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent"></div>
                    <p className="mt-4 text-sm text-gray-500">Loading applications...</p>
                  </div>
                </div>
              ) : (
                <JobsTable jobs={filteredJobs.slice(0, 10)} onEdit={handleEdit} onDelete={handleDelete} />
              )}
            </div>
          </>
        );
      case "applications":
        return (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">All Applications</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage and track all your job applications</p>
                </div>
                <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 text-sm" onClick={() => setShowModal(true)}>
                  <Plus className="w-4 h-4" />
                  Add Application
                </button>
              </div>
              <JobFilters search={search} setSearch={setSearch} status={status} setStatus={setStatus} />
            </div>
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-900 border-t-transparent"></div>
                  <p className="mt-4 text-sm text-gray-500">Loading applications...</p>
                </div>
              </div>
            ) : (
              <JobsTable jobs={filteredJobs} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </>
        );
      case "analytics":
        return (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-sm text-gray-500 mt-1">Deep insights into your job search performance</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StatusChart data={statusChartData} />
              <TrendChart data={trendData} />
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500 mt-1">Total Applications</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.successRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Success Rate</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{stats.interviewRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Interview Rate</p>
                </div>
              </div>
            </div>
          </>
        );
      case "settings":
        return (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Information</h3>
                <p className="text-sm text-gray-500 mb-4">Update your account details</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent" placeholder="your@email.com" />
                  </div>
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Save Changes</button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
                <p className="text-sm text-gray-500 mb-4">Export or delete your application data</p>
                <div className="flex gap-3">
                  <button onClick={exportToCSV} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Export All Data</button>
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">Delete Account</button>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Vertus Premium Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo + Brand */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                <img 
                  src={vertusLogo} 
                  alt="Vertus" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  VERTUS
                </h1>
                <p className="text-xs text-gray-400 font-medium tracking-wide font-serif">
                  Track and manage your job applications.
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <Activity className="w-3 h-3" />
                <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[73px] z-30">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center gap-1">
            <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === "dashboard" ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/30"}`}>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button onClick={() => setActiveTab("applications")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === "applications" ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/30"}`}>
              <FileText className="w-4 h-4" />
              Applications
            </button>
            <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === "analytics" ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/30"}`}>
              <PieChart className="w-4 h-4" />
              Analytics
            </button>
            <button onClick={() => setActiveTab("settings")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${activeTab === "settings" ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/30"}`}>
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {renderContent()}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={vertusLogo} alt="Vertus" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-gray-900">VERTUS</span>
            </div>
            <div className="flex gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Support</a>
            </div>
            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} Vertus. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <AddJobModal
          existingJob={editingJob || undefined}
          onClose={() => {
            setShowModal(false);
            setEditingJob(null);
          }}
          onSuccess={fetchJobs}
        />
      )}
    </div>
  );
}