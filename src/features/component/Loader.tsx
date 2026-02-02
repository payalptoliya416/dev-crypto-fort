
import { motion } from "framer-motion";

export default function Loader() {
  const bars = [0, 1, 2, 3];

  return (
    <div className="flex items-end space-x-2 h-12">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-2 h-10 rounded-full"
          style={{
            background: "linear-gradient(to top, #22c55e, #4ade80)",
            boxShadow: "0 0 12px rgba(34,197,94,0.7)",
          }}
          animate={{
            scaleY: [0.4, 1.4, 0.4],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
