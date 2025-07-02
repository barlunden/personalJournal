export default function Button({
  type = "button",
  loading = false,
  disabled = false,
  style = {},
  onClick,
  children,
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      
      style={style}
      onClick={onClick}
    >
      {loading ? "Sending..." : children}
    </button>
  );
}
