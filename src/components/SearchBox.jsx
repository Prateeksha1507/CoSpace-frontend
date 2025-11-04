import React, { useRef } from "react";

export function Suggestions({ loading, suggestions, term, onHide, goToResultsHref }) {
  return (
    <div
      className="search-suggestions"
      onMouseDown={(e) => e.preventDefault()}
      style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 1100,
               background: "#fff", border: "1px solid #e6e6e6", borderRadius: 8,
               boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}
    >
      {loading && <div className="sug-item sug-loading">Searching…</div>}
      {!loading && !suggestions.length && (
        <div className="sug-item sug-empty">No suggestions</div>
      )}
      {!loading && suggestions.map((s) => {
        const href =
          s.kind === "org" ? `/profile/org/${s.id}` :
          s.kind === "event" ? `/event/${s.id}` : goToResultsHref;
        return (
          <a key={`${s.kind}-${s.id}`} className="sug-item" href={href} onClick={onHide}
             style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                      textDecoration: "none", color: "inherit", borderBottom: "1px solid #f3f3f3" }}>
            <span style={{ width: 18, textAlign: "center", opacity: 0.7 }}>
              {s.kind === "org" ? <i className="fa-regular fa-building" /> : <i className="fa-regular fa-calendar" />}
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {s.label}{s.sub ? <small style={{ marginLeft: 6, color: "#888" }}>@{s.sub}</small> : null}
            </span>
          </a>
        );
      })}
      {!!suggestions.length && (
        <a className="sug-item" href={goToResultsHref} onClick={onHide}
           style={{ display: "block", padding: "10px 12px", textDecoration: "none",
                    fontWeight: 600, color: "inherit" }}>
          Show all results for “{term}”
        </a>
      )}
    </div>
  );
}

export function SearchBox({ q, setQ, showSug, setShowSug, loadingSug, suggestions, goToResultsHref }) {
  const blurTimerRef = useRef(null);
  const term = q.trim();

  return (
    <div className="search-box" style={{ position: "relative" }}>
      <button
        className="search-icon-btn"
        aria-label="Search"
        type="button"
        onClick={() => {
          if (!term) return;
          setShowSug(false);
          window.location.href = goToResultsHref;
        }}
        style={{ background: "transparent", border: 0, cursor: "pointer" }}
      >
        <i className="fas fa-search"></i>
      </button>

      <input
        type="text"
        placeholder="Search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => term && setShowSug(true)}
        onBlur={() => {
          blurTimerRef.current = setTimeout(() => setShowSug(false), 120);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (!term) return;
            setShowSug(false);
            window.location.href = goToResultsHref;
          }
          if (e.key === "Escape") setShowSug(false);
        }}
        aria-autocomplete="list"
        aria-expanded={showSug}
      />

      {showSug && (
        <Suggestions
          loading={loadingSug}
          suggestions={suggestions}
          term={term}
          onHide={() => setShowSug(false)}
          goToResultsHref={goToResultsHref}
        />
      )}
    </div>
  );
}
