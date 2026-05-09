const StatCard = ({ icon: Icon, label, value, tone }) => {
  return (
    <article className={`stat-card ${tone || ""}`}>
      <div className="stat-icon" aria-hidden="true">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
};

export default StatCard;
