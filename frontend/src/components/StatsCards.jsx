export default function StatsCards({
  icon: Icon,
  num,
  label,
  iconColor,
  bgColor,   // ✅ ADDED — card background color
}) {
  return (
    <div
      style={{
       
          background: bgColor || "white",   // ✅ ADDED
        padding: 20,
        borderRadius: 12,
        border: "1px solid #E5E7EB",
      }}
    >
      <Icon size={20} color={iconColor} />

      <h2>{num}</h2>

      <p>{label}</p>
    </div>
  );
}