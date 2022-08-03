import React from 'react';
import fileItem from '../../assets/img/fileItem.png';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

const FolderItem = ({ folderObj }) => {
  return (
    <Tooltip
      title={folderObj.name.replaceAll('_', ' ')}
      placement="bottom"
      TransitionComponent={Zoom}
    >
      <a href={folderObj.content.url} target="_blank">
        <div
          className="  cursor-pointer w-40  bg-white hover:bg-opacity-100 bg-opacity-80 
    text-saas-header text-opacity-5 hover:text-opacity-5 rounded-xl 
     p-4 flex flex-col justify-between drop-shadow-lg hover:drop-shadow-md h-44"
        >
          <div className="py-2 px-3 bg-gray-200 bg-opacity-60  mx-5 mt-2 rounded-xl">
            <img src={fileItem} alt="fireSpot" />
          </div>

          <div className="text-saas-accent truncate hover:text text-ellipsis text-opacity-70 font-bold  overflow-hidden text-sm my-2 text-center">
            {folderObj.name.replaceAll('_', ' ')}
          </div>
        </div>
      </a>
    </Tooltip>
  );
};

export default FolderItem;
