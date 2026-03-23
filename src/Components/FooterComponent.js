import React from "react";

function Footer() {
  return (
    <footer className="dt-footer">
      <div className="dt-footer-brand">
        <div style={{
          width: 24,
          height: 24,
          background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "0.7rem",
          flexShrink: 0,
        }}>
          <i className="fa fa-heartbeat" aria-hidden="true"></i>
        </div>
        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 700, fontSize: "0.875rem" }}>DocTel</span>
      </div>
      <span className="dt-footer-copy">
        © 2025 Swapnil Kole · Blockchain-powered healthcare records
      </span>
      <div className="dt-footer-status">
        <span style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#10b981",
          boxShadow: "0 0 6px rgba(16,185,129,0.8)",
          display: "inline-block",
          flexShrink: 0,
        }}></span>
        <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>On-chain</span>
      </div>

      <style>{`
        .dt-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(15, 23, 42, 0.97);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          z-index: 999;
        }
        .dt-footer-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .dt-footer-copy {
          color: rgba(255,255,255,0.4);
          font-size: 0.8rem;
          text-align: center;
          flex: 1;
        }
        .dt-footer-status {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }
        @media (max-width: 600px) {
          .dt-footer-copy {
            display: none;
          }
          .dt-footer {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
