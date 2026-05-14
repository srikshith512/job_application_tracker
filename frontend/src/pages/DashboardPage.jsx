import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  CircleSlash,
  ClipboardList,
  LogOut,
  MessageSquareText,
  Plus,
  Send,
  Trophy
} from "lucide-react";
import { apiRequest } from "../api/client.js";
import ApplicationCard from "../components/ApplicationCard.jsx";
import ApplicationForm from "../components/ApplicationForm.jsx";
import EmptyState from "../components/EmptyState.jsx";
import FilterBar from "../components/FilterBar.jsx";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialFilters = {
  search: "",
  status: "All",
  priority: "All",
  jobType: "All",
  sort: "newest"
};

const statusIcons = {
  Saved: ClipboardList,
  Applied: Send,
  Interviewing: MessageSquareText,
  Offer: Trophy,
  Rejected: CircleSlash
};

const cleanPayload = (payload) => {
  const cleaned = { ...payload };

  ["_id", "id", "user", "__v", "createdAt", "updatedAt"].forEach((field) => {
    delete cleaned[field];
  });

  ["deadline", "nextActionDate", "appliedDate"].forEach((field) => {
    if (!cleaned[field]) {
      delete cleaned[field];
    }
  });

  return cleaned;
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: {} });
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    return params.toString();
  }, [filters]);

  const hasFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") {
      return value !== "newest";
    }

    return value && value !== "All";
  });

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const [applicationData, statsData] = await Promise.all([
        apiRequest(`/applications?${queryString}`),
        apiRequest("/applications/stats")
      ]);
      setApplications(applicationData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [queryString]);

  const openCreateForm = () => {
    setEditingApplication(null);
    setFormOpen(true);
  };

  const openEditForm = (application) => {
    setEditingApplication(application);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingApplication(null);
  };

  const handleSave = async (payload) => {
    setSaving(true);
    setError("");

    try {
      if (editingApplication) {
        await apiRequest(`/applications/${editingApplication._id}`, {
          method: "PUT",
          body: JSON.stringify(cleanPayload(payload))
        });
      } else {
        await apiRequest("/applications", {
          method: "POST",
          body: JSON.stringify(cleanPayload(payload))
        });
      }

      closeForm();
      await loadApplications();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this application?");

    if (!confirmed) {
      return;
    }

    try {
      await apiRequest(`/applications/${id}`, { method: "DELETE" });
      await loadApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (application, status) => {
    try {
      await apiRequest(`/applications/${application._id}`, {
        method: "PUT",
        body: JSON.stringify(cleanPayload({ ...application, status }))
      });
      await loadApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p>Job Application Tracker</p>
          <h1>Dashboard</h1>
          <span>Signed in as {user?.name}</span>
        </div>

        <div className="header-actions">
          <button className="secondary-button" type="button" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
          <button className="primary-button" type="button" onClick={openCreateForm}>
            <Plus size={18} />
            Add application
          </button>
        </div>
      </header>

      <section className="stats-grid" aria-label="Pipeline statistics">
        <StatCard icon={BriefcaseBusiness} label="Total" value={stats.total || 0} tone="total" />
        <StatCard icon={Send} label="Applied" value={stats.byStatus?.Applied || 0} tone="applied" />
        <StatCard
          icon={MessageSquareText}
          label="Interviewing"
          value={stats.byStatus?.Interviewing || 0}
          tone="interviewing"
        />
        <StatCard icon={Trophy} label="Offers" value={stats.byStatus?.Offer || 0} tone="offer" />
      </section>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && (
        <div className="alert" role="alert">
          <CircleSlash size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <section className="loading-grid" aria-label="Loading applications">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="skeleton-card" key={index} />
          ))}
        </section>
      ) : applications.length ? (
        <section className="application-grid" aria-label="Applications">
          {applications.map((application) => {
            const Icon = statusIcons[application.status] || CheckCircle2;

            return (
              <div className="application-wrapper" key={application._id}>
                <div className="status-rail" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <ApplicationCard
                  application={application}
                  onDelete={handleDelete}
                  onEdit={openEditForm}
                  onStatusChange={handleStatusChange}
                />
              </div>
            );
          })}
        </section>
      ) : (
        <EmptyState onCreate={openCreateForm} hasFilters={hasFilters} />
      )}

      <ApplicationForm
        application={editingApplication}
        isOpen={formOpen}
        onClose={closeForm}
        onSubmit={handleSave}
        saving={saving}
      />
    </main>
  );
};

export default DashboardPage;
