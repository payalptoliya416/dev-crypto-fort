import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <FaExclamationTriangle size={70} className="text-yellow-400" />
        </motion.div>

        <h1 className="text-6xl font-bold text-[#25C866]">404</h1>

        <p className="mt-4 text-lg text-gray-300">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-6 px-6 py-3 bg-[#25C866] hover:bg-[#25C866]/80 transition rounded-lg"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;