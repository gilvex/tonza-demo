import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type TabsProps = {
  children: React.ReactNode;
};

type TabProps = {
  label: string;
  children: React.ReactNode;
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const tabsArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(tabsArray[0].props.label);

  return (
    <div className="flex flex-col">
      {/* Tab Headers */}
      <div className="flex pb-2">
        {tabsArray.map((tab) => (
          <button
            key={tab.props.label}
            className={`flex-1 text-center pb-2 transition-all border-b ${
              activeTab === tab.props.label
                ? "border-blue-300 text-white font-bold"
                : "border-gray-700 text-white/60"
            }`}
            onClick={() => setActiveTab(tab.props.label)}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {/* Tab Content with Smooth Height Animation */}
      <AnimatePresence mode="wait">
        {tabsArray.map(
          (tab) =>
            activeTab === tab.props.label && (
              <motion.div
                key={tab.props.label}
                initial={{ height: 0, translateY: 20 }}
                animate={{ height: "auto", translateY: 0 }}
                exit={{ height: 0, translateY: 20 }}
              >
                {tab.props.children}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
