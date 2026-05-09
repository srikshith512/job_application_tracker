import { BriefcaseBusiness } from "lucide-react";

const EmptyState = ({ onCreate, hasFilters }) => {
  return (
    <section className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        <BriefcaseBusiness size={32} />
      </div>
      <h2>{hasFilters ? "No applications match this view" : "Start tracking your search"}</h2>
      <p>
        {hasFilters
          ? "Adjust the search or filters to see more applications."
          : "Add your first role, keep notes, and move it through each stage of the hiring process."}
      </p>
      {!hasFilters && (
        <button className="primary-button" type="button" onClick={onCreate}>
          Add application
        </button>
      )}
    </section>
  );
};

export default EmptyState;
