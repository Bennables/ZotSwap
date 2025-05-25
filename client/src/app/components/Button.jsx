export default function Button({ 
  children, 
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
}) {
  const variants = {
    primary: 'bg-[#6A89A7] text-white hover:bg-[#88BDF2]',
    accent: 'bg-[#F7B267] text-[#384959] hover:bg-[#F9C896]',
    outline: 'border-2 border-[#6A89A7] text-[#384959] hover:bg-[#6A89A7]/10'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-full
        transition-all duration-200 ease-in-out
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}