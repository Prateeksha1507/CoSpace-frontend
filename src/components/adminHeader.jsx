import LogoutButton from "./Logout";

export function AdminHeader() {
  return (
    <header className="header" style={{ position: "relative", zIndex: 1001 }}>
      {/* Always show logo */}
      <a href="/" className="brand-only">
        <img src="/logo.png" alt="CoSpace Logo" className="logo" />
        <span className="brand-name">CoSpace</span>
      </a>
      <LogoutButton/>
    </header>
  );
}