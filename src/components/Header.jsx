import React, { useState, useEffect, useRef } from "react";
import "../styles/header.css";
import { suggestSearch } from "../api/searchAPI";
import { SearchBox } from "../components/SearchBox"; // <— import the extracted SearchBox component
import { getCurrentActorDocument } from "../api/authAPI";
import Avatar from "./Avatar"

function Header() {
  const [open, setOpen] = useState(false);
  const [actor, setActor] = useState(null);

  useEffect(() => {
    const fetchActor = async () => {
      const actorData = await getCurrentActorDocument();
      setActor(actorData);
    };

    fetchActor();
  }, []);

  // Search state
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [loadingSug, setLoadingSug] = useState(false);

  const debounceRef = useRef(null);

  // Lock scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  // Debounced suggestion fetching
  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setSuggestions([]);
      setShowSug(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingSug(true);
        const res = await suggestSearch(term, 6);
        setSuggestions(Array.isArray(res?.suggestions) ? res.suggestions : []);
        setShowSug(true);
      } catch {
        setSuggestions([]);
        setShowSug(false);
      } finally {
        setLoadingSug(false);
      }
    }, 200);

    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [q]);

  const term = q.trim();
  const goToResultsHref = `/search?q=${encodeURIComponent(term)}`;

  return (
    <>
      <header className="header" style={{ position: "relative", zIndex: 1001 }}>
        {/* Left: Logo */}
        <a href="/" className="brand-only">
          <img src="/logo.png" alt="CoSpace Logo" className="logo" />
          <span className="brand-name">CoSpace</span>
        </a>

        {/* Hamburger (visible on mobile) */}
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={toggle}
          type="button"
        >
          <i className={open ? "fa-solid fa-xmark" : "fa fa-bars"} />
        </button>

        {/* Desktop Nav */}
        {true ? (
          <div className="desktop-right">
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/settings">Settings</a>
              <a href="/chats" className="primary-btn">Chats</a>
            </nav>

            <div>
              <SearchBox
                q={q}
                setQ={setQ}
                showSug={showSug}
                setShowSug={setShowSug}
                loadingSug={loadingSug}
                suggestions={suggestions}
                goToResultsHref={goToResultsHref}
              />

              <a href="/notifications" className="bell-container">
                <i className="fa-regular fa-bell"></i>
              </a>
              <a href="/my-profile" className="avatar-container">
                <Avatar src={actor?.profilePicture} backup={actor?._id} />
              </a>
            </div>
          </div>
        ):
              <SearchBox
                q={q}
                setQ={setQ}
                showSug={showSug}
                setShowSug={setShowSug}
                loadingSug={loadingSug}
                suggestions={suggestions}
                goToResultsHref={goToResultsHref}
              />
        }
      </header>

      {/* Backdrop */}
      {open && <div className="backdrop show" onClick={close}></div>}

      {/* Sidebar (mobile) */}
      <aside
        className={`sidebar ${open ? "open" : ""}`}
        aria-hidden={!open}
        style={{
          pointerEvents: open ? "auto" : "none",
          zIndex: 1002,
        }}
      >
        <div className="sidebar-header">
          <span>Menu</span>
          <button className="close-btn" aria-label="Close" onClick={close} type="button">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          {/* Mobile search */}
          <div className="mobile-search">
            {open && (
              <SearchBox
                q={q}
                setQ={setQ}
                showSug={showSug}
                setShowSug={setShowSug}
                loadingSug={loadingSug}
                suggestions={suggestions}
                goToResultsHref={goToResultsHref}
              />
            )}
          </div>

          <nav className="sidebar-links">
            <a href="/" onClick={close}>Home</a>
            <a href="/settings" onClick={close}>Settings</a>
            <a href="/chats" onClick={close}>Chats</a>
            <a href="/notifications" onClick={close}>Notifications</a>
            <a href="/my-profile" onClick={close}>My Profile</a>
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Header;
