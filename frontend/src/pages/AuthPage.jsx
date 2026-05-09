import { useState } from "react";
import { BriefcaseBusiness, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const AuthPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const isRegister = mode === "register";

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-label="Authentication">
        <div className="brand-mark">
          <BriefcaseBusiness size={28} aria-hidden="true" />
        </div>

        <div className="auth-copy">
          <p>Job Application Tracker</p>
          <h1>{isRegister ? "Create your tracker" : "Welcome back"}</h1>
          <span>
            Keep every role, recruiter note, deadline, and follow-up in one protected dashboard.
          </span>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              <span>Name</span>
              <div className="input-with-icon">
                <UserRound size={18} aria-hidden="true" />
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Your name"
                />
              </div>
            </label>
          )}

          <label>
            <span>Email</span>
            <div className="input-with-icon">
              <Mail size={18} aria-hidden="true" />
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="input-with-icon password-field">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                required
                minLength="6"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button full-width" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>
      </section>

      <section className="auth-preview" aria-label="Dashboard preview">
        <div className="preview-toolbar">
          <span />
          <span />
          <span />
        </div>
        <div className="preview-header">
          <p>Pipeline overview</p>
          <strong>23 applications</strong>
        </div>
        <div className="preview-board">
          {["Saved", "Applied", "Interviewing"].map((status, index) => (
            <div className="preview-column" key={status}>
              <span>{status}</span>
              <div style={{ height: 58 + index * 16 }} />
              <div style={{ height: 42 + index * 10 }} />
              <div style={{ height: 50 }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
