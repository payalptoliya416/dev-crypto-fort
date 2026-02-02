import React from "react";

interface CommonTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CommonTabs: React.FC<CommonTabsProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex gap-6 mt-4 border-b border-[#3C3D47] overflow-x-auto whitespace-nowrap scrollbar-hide
           sm:overflow-visible">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`shrink-0 pb-[15px] text-base transition  cursor-pointer
            ${
              activeTab === tab
                ? "text-white border-b-2 border-white font-semibold"
                : "text-[#7A7D83] hover:text-white font-normal"
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CommonTabs;
