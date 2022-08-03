import React from 'react';
import ScoreChart from '../Charts/ScoreChart';
const SidebarBottomItem = ({ score, ...nativeProps }) => {
  const finalScore = Math.round(score * 100, 2);
  return (
    <div
      {...nativeProps}
      className="flex flex-row pt-2 justify-center w-full h-40 mb-8 "
    >
      <div className="flex flex-row bg-slate-50 bg-opacity-20 drop-shadow-lg w-9/12 justify-center items-center rounded-2xl hover:scale-105 px-4 duration-150 text-main ">
        <ScoreChart data={finalScore} label="Score" width="100%" />
      </div>
    </div>
  );
};

export default SidebarBottomItem;
