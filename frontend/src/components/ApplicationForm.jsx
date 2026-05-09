import { useEffect, useState } from "react";
import { X } from "lucide-react";

const statusOptions = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];
const priorityOptions = ["Low", "Medium", "High"];
const jobTypeOptions = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const emptyForm = {
  company: "",
  position: "",
  location: "Remote",
  jobType: "Full-time",
  status: "Saved",
  priority: "Medium",
  salaryRange: "",
  appliedDate: new Date().toISOString().slice(0, 10),
  deadline: "",
  source: "",
  contactName: "",
  contactEmail: "",
  notes: "",
  nextAction: "",
  nextActionDate: "",
  tags: ""
};

const toDateInputValue = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().slice(0, 10);
};

const mapApplicationToForm = (application) => ({
  company: application.company || "",
  position: application.position || "",
  location: application.location || "Remote",
  jobType: application.jobType || "Full-time",
  status: application.status || "Saved",
  priority: application.priority || "Medium",
  salaryRange: application.salaryRange || "",
  appliedDate: toDateInputValue(application.appliedDate),
  deadline: toDateInputValue(application.deadline),
  source: application.source || "",
  contactName: application.contactName || "",
  contactEmail: application.contactEmail || "",
  notes: application.notes || "",
  nextAction: application.nextAction || "",
  nextActionDate: toDateInputValue(application.nextActionDate),
  tags: application.tags?.join(", ") || ""
});

const ApplicationForm = ({ application, isOpen, onClose, onSubmit, saving }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(application ? mapApplicationToForm(application) : emptyForm);
  }, [application, isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="application-form-title">
      <div className="modal-backdrop" onClick={onClose} />
      <form className="application-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div>
            <p>{application ? "Update role" : "New application"}</p>
            <h2 id="application-form-title">
              {application ? "Edit application" : "Add application"}
            </h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close form">
            <X size={18} />
          </button>
        </div>

        <div className="form-grid two-columns">
          <label>
            <span>Company</span>
            <input
              required
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Acme Labs"
            />
          </label>

          <label>
            <span>Position</span>
            <input
              required
              value={form.position}
              onChange={(event) => updateField("position", event.target.value)}
              placeholder="Frontend Developer"
            />
          </label>
        </div>

        <div className="form-grid three-columns">
          <label>
            <span>Status</span>
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Priority</span>
            <select
              value={form.priority}
              onChange={(event) => updateField("priority", event.target.value)}
            >
              {priorityOptions.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Job type</span>
            <select value={form.jobType} onChange={(event) => updateField("jobType", event.target.value)}>
              {jobTypeOptions.map((jobType) => (
                <option key={jobType}>{jobType}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-grid two-columns">
          <label>
            <span>Location</span>
            <input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="Bengaluru or Remote"
            />
          </label>

          <label>
            <span>Salary range</span>
            <input
              value={form.salaryRange}
              onChange={(event) => updateField("salaryRange", event.target.value)}
              placeholder="12 LPA - 18 LPA"
            />
          </label>
        </div>

        <div className="form-grid three-columns">
          <label>
            <span>Applied date</span>
            <input
              type="date"
              value={form.appliedDate}
              onChange={(event) => updateField("appliedDate", event.target.value)}
            />
          </label>

          <label>
            <span>Deadline</span>
            <input
              type="date"
              value={form.deadline}
              onChange={(event) => updateField("deadline", event.target.value)}
            />
          </label>

          <label>
            <span>Next action date</span>
            <input
              type="date"
              value={form.nextActionDate}
              onChange={(event) => updateField("nextActionDate", event.target.value)}
            />
          </label>
        </div>

        <div className="form-grid two-columns">
          <label>
            <span>Source</span>
            <input
              value={form.source}
              onChange={(event) => updateField("source", event.target.value)}
              placeholder="LinkedIn, referral, company site"
            />
          </label>

          <label>
            <span>Tags</span>
            <input
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="react, remote, referral"
            />
          </label>
        </div>

        <div className="form-grid two-columns">
          <label>
            <span>Contact name</span>
            <input
              value={form.contactName}
              onChange={(event) => updateField("contactName", event.target.value)}
              placeholder="Recruiter name"
            />
          </label>

          <label>
            <span>Contact email</span>
            <input
              type="email"
              value={form.contactEmail}
              onChange={(event) => updateField("contactEmail", event.target.value)}
              placeholder="recruiter@company.com"
            />
          </label>
        </div>

        <label>
          <span>Next action</span>
          <input
            value={form.nextAction}
            onChange={(event) => updateField("nextAction", event.target.value)}
            placeholder="Send follow-up email"
          />
        </label>

        <label>
          <span>Notes</span>
          <textarea
            rows="4"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Interview notes, role details, links, prep reminders..."
          />
        </label>

        <div className="form-actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={saving}>
            {saving ? "Saving..." : application ? "Save changes" : "Create application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
