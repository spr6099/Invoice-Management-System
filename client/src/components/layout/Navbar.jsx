import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
// console.log(user)
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 sm:px-6 h-14 flex items-center justify-between">
      {/* Left: Mobile menu + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile sidebar button */}
        <button
          className="sm:hidden text-2xl focus:outline-none"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <h2 className="text-lg font-bold">Invoice App</h2>
      </div>

      {/* Right: Desktop user info */}
      <div className="hidden sm:flex items-center gap-4">
        <span className="text-sm text-gray-300">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
