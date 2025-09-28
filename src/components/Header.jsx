import React from "react";
import "../styles/header.css";

function Header({loggedIn=false}) {

  if (!loggedIn) { 
    return(
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="CoSpace Logo" className="logo" />
        <span className="brand-name">CoSpace</span>
      </div>
    </header>
    )
  }

  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="CoSpace Logo" className="logo" />
        <span className="brand-name">CoSpace</span>
        <nav className="nav-links">
          <a href="/home">Home</a>
          <a href="/events">Events</a>
          <a href="/chats" className="btn-primary">Chats</a>
        </nav>
      </div>

      <div className="header-right">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search" />
        </div>
        <a href="/notifications"  className="bell-container">
          <i className="fa-regular fa-bell"></i>
        </a>
        {/* <img
          src="https://via.placeholder.com/30"
          alt="User Avatar"
          className="avatar"
        /> */}
        <a href="/ny-profile"  className="avatar-container">
          <i class="fa-solid fa-user"></i>
        </a>
      </div>
    </header>
  );
}

export default Header;
