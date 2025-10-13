export default function ChatAvatar({ name = "", src = "./person.png", size = 44 }) {
  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || "")
    .join("");

  const style = { width: size, height: size };

  if (src) {
    return <img className="chatspg-avatar" style={style} src={src} alt={name} />;
  }
  return (
    <div className="chatspg-avatar chatspg-avatar--fallback" style={style} aria-label={name}>
      {initials || "?"}
    </div>
  );
}
