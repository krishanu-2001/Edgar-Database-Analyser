import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import folderIcon from '../../assets/img/folderIcon.png';
import React from 'react';

const FolderItem = ({ folderObj, onFolderOpen }) => {
  // console.log(folderObj);
  return (
    <div
      className=" cursor-pointer w-40  bg-white hover:bg-opacity-100 bg-opacity-80 
    text-saas-header text-opacity-5 hover:text-opacity-5 rounded-xl border    p-4 flex flex-col justify-between drop-shadow-lg hover:drop-shadow-md h-44"
      onClick={() => onFolderOpen(folderObj)}
    >
      <div className="py-2 px-3 bg-gray-200 bg-opacity-60  mx-5 mt-2 rounded-xl">
        {
          /*<FontAwesomeIcon
          className="  lg:h-auto text-slate-900 text-opacity-80  flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          icon={' fa-folder-open '}
  />*/
          <img src={folderIcon} alt="fireSpot" />
        }
      </div>
      <div className="text-gray-900 text-opacity-70 font-bold text-lg my-2 text-center">
        {folderObj.name}
        <div className="text-center text-opacity-90 text-gray-500 text-sm font-normal">
          Items {folderObj.children.length}
        </div>
      </div>
    </div>
  );
};

export default FolderItem;
