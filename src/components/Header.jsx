import React, { useState, useEffect } from "react";
import "../styles/header.css";

function Header({ loggedIn = false }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <>
      <header className="header">
        {/* Left: Logo */}
        <a href="/" className="brand-only">
          <img src="/logo.png" alt="CoSpace Logo" className="logo" />
          <span className="brand-name">CoSpace</span>
        </a>

        {/* Hamburger visible only on small screens */}
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={toggle}
        >
          <i className={open ? "fa-solid fa-xmark" : "fa fa-bars"} />
        </button>

        {/* Right: Full nav (hidden on mobile) */}
        {loggedIn && (
          <div className="desktop-right">
            <nav className="nav-links">
              <a href="/">Home</a>
              <a href="/settings">Settings</a>
              <a href="/chats" className="primary-btn">Chats</a>
            </nav>
            <div>
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search" />
              </div>

              <a href="/notifications" className="bell-container">
                <i className="fa-regular fa-bell"></i>
              </a>
              <a href="/my-profile" className="avatar-container">
                <i className="fa-solid fa-user"></i>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Sidebar (mobile) */}
      <div className={`backdrop ${open ? "show" : ""}`} onClick={close}></div>
      <aside className={`sidebar ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="sidebar-header">
          <span>Menu</span>
          <button className="close-btn" aria-label="Close" onClick={close}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search" />
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
