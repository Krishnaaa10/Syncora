import { useEffect } from "react"
import { Navigate, useLocation } from "react-router-dom"
import useSellerAuthStore from "../../stores/sellerAuthStore"

export default function ProtectedSellerRoute({ children }) {
  const { seller, isAuthChecking, initialize } = useSellerAuthStore()
  const location = useLocation()

  useEffect(() => {
    initialize()
  }, [])

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-near-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dark-pink"></div>
      </div>
    )
  }

  const publicPaths = ['/seller/login', '/seller/register', '/seller/logout']
  if (!seller && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/seller/login" replace />
  }

  return children
}
