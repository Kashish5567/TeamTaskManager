const avatarColors = {
  blue: { bg: "rgba(79,110,247,0.15)", color: "#4F6EF7" },
  green: { bg: "rgba(34,211,165,0.15)", color: "#22D3A5" },
};

export default function Avatar({
  initials,
  color = "blue",
  size = 32,
  fontSize = 12,
}) {
  const c = avatarColors[color] || avatarColors.blue;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: c.bg,
        color: c.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        fontWeight: 500,
      }}
    >
      {initials}
    </div>
  );
}