import React from "react";
import { motion } from "motion/react";

const WithdrawTab: React.FC = () => {
  return (
    <motion.div className="overflow-clip">
      <div className="p-4 bg-slate-600 overflow-auto max-h-[50vh]">
        <p className="text-sm text-gray-400">Your Deposit Address</p>
        {[...Array(6)].map((_, index) => (
          <div key={index}>
            <div className="mt-2 bg-gray-700 p-3 rounded-md text-sm font-mono truncate">
              0x1234...abcd
            </div>
            <button className="mt-2 bg-blue-600 px-4 py-2 rounded-md text-white">
              Copy
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default WithdrawTab;
