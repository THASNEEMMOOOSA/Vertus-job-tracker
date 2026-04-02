import { useEffect, useState } from "react";
import API from "../services/api";

export default function JobTable() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    API.get("/jobs").then((res) => {
      setJobs(res.data);
    });
  }, []);

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Company</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {jobs.map((job) => (
          <tr key={job.id}>
            <td>{job.company_name}</td>
            <td>{job.role}</td>
            <td>{job.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}