import {
  Building2,
  CalendarClock,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Trash2
} from "lucide-react";

const statusOptions = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

const formatDate = (date) => {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
};

const ApplicationCard = ({ application, onDelete, onEdit, onStatusChange }) => {
  return (
    <article className="application-card">
      <div className="card-topline">
        <span className={`status-pill ${application.status.toLowerCase()}`}>{application.status}</span>
        <span className={`priority-pill ${application.priority.toLowerCase()}`}>
          {application.priority} priority
        </span>
      </div>

      <div className="card-title-row">
        <div>
          <h3>{application.position}</h3>
          <p>
            <Building2 size={16} aria-hidden="true" />
            {application.company}
          </p>
        </div>

        <div className="icon-actions">
          <button type="button" className="icon-button" onClick={() => onEdit(application)} aria-label="Edit">
            <Pencil size={17} />
          </button>
          <button
            type="button"
            className="icon-button danger"
            onClick={() => onDelete(application._id)}
            aria-label="Delete"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      <div className="card-meta">
        <span>
          <MapPin size={15} aria-hidden="true" />
          {application.location || "Remote"}
        </span>
        <span>
          <CalendarClock size={15} aria-hidden="true" />
          Applied {formatDate(application.appliedDate)}
        </span>
        {application.source && (
          <span>
            <ExternalLink size={15} aria-hidden="true" />
            {application.source}
          </span>
        )}
        {application.contactEmail && (
          <span>
            <Mail size={15} aria-hidden="true" />
            {application.contactEmail}
          </span>
        )}
      </div>

      {application.notes && <p className="card-notes">{application.notes}</p>}

      <div className="tag-row">
        {application.tags?.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="card-footer">
        <label>
          <span>Move to</span>
          <select
            value={application.status}
            onChange={(event) => onStatusChange(application, event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>

        <div>
          <span>Next action</span>
          <strong>{application.nextAction || "Follow up"}</strong>
          {application.nextActionDate && <small>{formatDate(application.nextActionDate)}</small>}
        </div>
      </div>
    </article>
  );
};

export default ApplicationCard;
