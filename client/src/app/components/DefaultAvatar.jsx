export default function DefaultAvatar({ className = "w-32 h-32" }) {
  return (
    <div className={`${className} rounded-full bg-[#6A89A7] flex items-center justify-center`}>
      <span className="text-4xl font-medium text-white">ZS</span>
    </div>
  );
}