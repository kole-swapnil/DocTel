import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function TreatmentCard({ treatment }) {
  return (
    <Link to={`/treatment/${treatment.treatment_Id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "1.25rem",
          boxShadow: "var(--shadow-sm)",
          transition: "all 0.2s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
          e.currentTarget.style.borderColor = "var(--primary-light)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "1rem",
          }}>
            <i className="fa fa-medkit" aria-hidden="true"></i>
          </div>
          <span style={{
            padding: "0.2rem 0.6rem",
            background: "#f0f9ff", color: "var(--primary)",
            borderRadius: 999, fontSize: "0.72rem", fontWeight: 700,
          }}>
            #{treatment.treatment_Id}
          </span>
        </div>
        <div style={{ marginTop: "0.5rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
            Patient Aadhar
          </div>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--dark)", fontFamily: "'Courier New', monospace" }}>
            {treatment.patientAadhar}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
            Admin Aadhar
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontFamily: "'Courier New', monospace" }}>
            {treatment.adminAadhar}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.25rem", color: "var(--primary-light)", fontSize: "0.8rem", fontWeight: 600 }}>
          View history <i className="fa fa-arrow-right" aria-hidden="true"></i>
        </div>
      </div>
    </Link>
  );
}

class AllTreatmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTreatments: [],
      searchQuery: "",
      loading: false,
      loadError: null,
    };
  }

  async componentDidMount() {
    if (this.props.contract) await this.loadAllTreatments();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.contract !== this.props.contract && this.props.contract) {
      await this.loadAllTreatments();
    }
  }

  async loadAllTreatments() {
    this.setState({ loading: true, loadError: null });
    try {
      const count = Number(await this.props.contract.methods.treatmentCount().call());
      console.log("[AllTreatments] treatmentCount =", count);
      const allTreatments = [];
      for (let i = 1; i <= count; i++) {
        try {
          console.log(`[AllTreatments] fetching treatments(${i})…`);
          const t = await this.props.contract.methods.treatments(i).call();
          console.log(`[AllTreatments] treatments(${i}) =`, t);
          allTreatments.push(t);
        } catch (err) {
          console.error(`[AllTreatments] treatments(${i}) failed:`, err.message);
        }
      }
      console.log("[AllTreatments] done. Total loaded:", allTreatments.length);
      this.setState({ allTreatments, loading: false });
    } catch (err) {
      console.error("[AllTreatments] loadAllTreatments failed:", err.message);
      this.setState({ loadError: err.message, loading: false });
    }
  }

  render() {
    const { allTreatments, searchQuery, loading, loadError } = this.state;

    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? allTreatments.filter(t =>
          String(t.patientAadhar).includes(query) ||
          String(t.treatment_Id).includes(query) ||
          String(t.adminAadhar).includes(query)
        )
      : allTreatments;

    return (
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2 className="section-title">All Treatments</h2>
          <p className="section-subtitle">
            {loading
              ? "Loading…"
              : `${allTreatments.length} treatment${allTreatments.length !== 1 ? "s" : ""} on record`}
          </p>
        </div>

        {/* Search bar */}
        <div style={{
          background: "#ffffff", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "1.25rem 1.5rem",
          boxShadow: "var(--shadow-sm)", marginBottom: "2rem",
          display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, position: "relative", minWidth: 180 }}>
            <i className="fa fa-search" aria-hidden="true" style={{
              position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)",
              color: "var(--text-muted)", fontSize: "0.85rem",
            }}></i>
            <input
              className="dt-input"
              style={{ paddingLeft: "2.25rem" }}
              type="text"
              placeholder="Search by treatment ID, patient Aadhar, or admin Aadhar…"
              value={searchQuery}
              onChange={e => this.setState({ searchQuery: e.target.value })}
            />
          </div>
          {searchQuery && (
            <button
              className="dt-btn dt-btn-ghost"
              onClick={() => this.setState({ searchQuery: "" })}
            >
              <i className="fa fa-times" aria-hidden="true"></i> Clear
            </button>
          )}
        </div>

        {/* Results */}
        {!this.props.contract ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
            <i className="fa fa-plug" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", opacity: 0.3 }} aria-hidden="true"></i>
            <p>Connect your wallet to view treatments.</p>
          </div>
        ) : loading ? (
          <div className="dt-loading"><div className="dt-spinner"></div>Loading treatments…</div>
        ) : loadError ? (
          <div className="dt-alert dt-alert-error">
            <i className="fa fa-exclamation-circle" aria-hidden="true"></i> {loadError}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)" }}>
            <i className="fa fa-medkit" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem", opacity: 0.3 }} aria-hidden="true"></i>
            <p>{query ? "No treatments match your search." : "No treatments found."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {filtered.map(t => (
              <TreatmentCard key={t.treatment_Id} treatment={t} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default AllTreatmentComponent;
