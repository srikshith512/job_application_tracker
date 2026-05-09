import { Search, SlidersHorizontal } from "lucide-react";

const statuses = ["All", "Saved", "Applied", "Interviewing", "Offer", "Rejected"];
const priorities = ["All", "Low", "Medium", "High"];
const jobTypes = ["All", "Full-time", "Part-time", "Contract", "Internship", "Remote"];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "applied", label: "Applied date" },
  { value: "company", label: "Company" },
  { value: "status", label: "Status" }
];

const FilterBar = ({ filters, onChange }) => {
  const updateFilter = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <section className="filter-bar" aria-label="Application filters">
      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          placeholder="Search company, role, source, tag..."
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
        />
      </label>

      <div className="filters-grid">
        <label>
          <span>Status</span>
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Priority</span>
          <select
            value={filters.priority}
            onChange={(event) => updateFilter("priority", event.target.value)}
          >
            {priorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Type</span>
          <select value={filters.jobType} onChange={(event) => updateFilter("jobType", event.target.value)}>
            {jobTypes.map((jobType) => (
              <option key={jobType}>{jobType}</option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort</span>
          <select value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-summary" aria-hidden="true">
        <SlidersHorizontal size={16} />
        Live filters
      </div>
    </section>
  );
};

export default FilterBar;
