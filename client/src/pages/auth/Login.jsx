import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser({ email, password });
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader text="Logging in..." />}

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Login
          </h2>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../../api/authApi";
// import { useAuth } from "../../hooks/useAuth";
// import Loader from "../../components/common/Loader";

// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       setError("Email and password are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const data = await loginUser({ email, password });
//       login(data.token, data.user);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {loading && <Loader text="Logging in..." />}

//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8">
//           <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
//             Login
//           </h2>

//           {/* ERROR MESSAGE */}
//           {error && (
//             <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 disabled={loading}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 disabled={loading}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//               />
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-2 rounded-lg text-white font-semibold transition
//                 ${
//                   loading
//                     ? "bg-blue-400 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700"
//                 }
//               `}
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>

//           {/* Footer */}
//           <p className="text-sm text-center text-gray-600 mt-6">
//             Don’t have an account?{" "}
//             <span
//               onClick={() => navigate("/register")}
//               className="text-blue-600 cursor-pointer hover:underline"
//             >
//               Register
//             </span>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;
