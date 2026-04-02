// AddJobModal.tsx
import { useState, useEffect } from "react";
import { X, Briefcase, Building2, Calendar, MapPin, Hash, FileText, Save, Send } from "lucide-react";
import API from "../services/api";

type Job = {
  id?: number;
  company_name: string;
  role: string;
  location?: string | null;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  source?: string | null;
  notes?: string | null;
  applied_date: string;
};

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  existingJob?: Job;
};

export default function AddJobModal({ onClose, onSuccess, existingJob }: Props) {
  const [form, setForm] = useState<Job>({
    company_name: "",
    role: "",
    location: "",
    status: "Applied",
    source: "",
    notes: "",
    applied_date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingJob) {
      setForm({
        ...existingJob,
        applied_date: existingJob.applied_date.split("T")[0],
      });
    }
  }, [existingJob]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.company_name.trim()) newErrors.company_name = "Company name is required";
    if (!form.role.trim()) newErrors.role = "Job role is required";
    if (!form.applied_date) newErrors.applied_date = "Application date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      if (existingJob) {
        await API.put(`/jobs/${existingJob.id}`, form);
      } else {
        await API.post("/jobs", form);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {existingJob ? "Edit Application" : "New Application"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {existingJob ? "Update your job application details" : "Add a new job to your tracking pipeline"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white text-gray-900 ${
                  errors.company_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Google, Microsoft, Amazon"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                autoFocus
              />
            </div>
            {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Job Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white text-gray-900 ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Senior Frontend Developer"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white text-gray-900"
                  placeholder="City, State or Remote"
                  value={form.location || ""}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Source</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white text-gray-900"
                  placeholder="LinkedIn, Indeed, Referral"
                  value={form.source || ""}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Application Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white text-gray-900 ${
                    errors.applied_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={form.applied_date}
                  onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
                />
              </div>
              {errors.applied_date && <p className="text-xs text-red-500 mt-1">{errors.applied_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-gray-900"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Job["status"] })}
              >
                <option value="Applied">Applied - Application submitted</option>
                <option value="Interview">Interview - In conversation</option>
                <option value="Offer">Offer - Received offer</option>
                <option value="Rejected">Rejected - Not selected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all bg-white text-gray-900 resize-none"
                placeholder="Add interview notes, salary expectations, or other important details..."
                rows={3}
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                {existingJob ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                {existingJob ? "Update Application" : "Save Application"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}