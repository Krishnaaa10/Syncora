import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SellerLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center text-center mt-4">
      <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-dark-pink to-pink-500 animate-pulse mb-8">
        Syncora
      </div>

      <h1 className="text-2xl font-semibold mb-3 text-white">
        Thank you for using Syncora
      </h1>

      <p className="text-text-secondary mb-8">
        Logging you out securely...
      </p>

      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500 mb-6 mx-auto"></div>

      <p className="text-gray-500 text-sm">
        Redirecting to homepage in a few seconds
      </p>
    </div>
  );
};

export default SellerLogout;
