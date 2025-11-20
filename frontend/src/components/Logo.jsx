import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 group hover:opacity-90 transition-all transform hover:scale-105"
    >
      {/* Icon/Badge */}
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-dark-pink to-pink-700 rounded-xl flex items-center justify-center shadow-lg shadow-dark-pink/50 transform group-hover:rotate-12 transition-transform">
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        </div>
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-dark-pink opacity-20 rounded-xl blur-md group-hover:opacity-30 transition-opacity animate-pulse"></div>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold bg-gradient-to-r from-dark-pink via-pink-400 to-dark-pink bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient">
          Syncora
        </span>
        <span className="text-[10px] text-text-secondary font-medium tracking-wider -mt-1">
          LOCAL • EXCELLENCE
        </span>
      </div>
    </Link>
  )
}

export default Logo

