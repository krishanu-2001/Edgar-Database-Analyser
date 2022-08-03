import React, { useState } from 'react';
import { generateRootFolder } from './doingit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FolderList from './FolderList';
import BreadCrumb from './BreadCrumb';

const Main = (props) => {
  let rootFolderObject = generateRootFolder(props.Company);
  const [currentFolderList, setCurrentFolderList] = useState(
    rootFolderObject.children
  );
  const [currentPath, setCurrentPath] = useState('');

  const onFolderOpen = (folderObj) => {
    setCurrentFolderList(folderObj.children);
    folderObj.name === 'root'
      ? setCurrentPath('')
      : setCurrentPath(folderObj.path + folderObj.name + '/');
  };

  return (
    <>
      <div className=" flex flex-row  text-xl text-saas-accent  space-x-2 font-semibold mt-2">
        <FontAwesomeIcon
          icon={'fa-home'}
          className="mt-1 cursor-pointer  hover:text-blue-300"
          onClick={() => {
            onFolderOpen(rootFolderObject);
          }}
        />
        <span className="arrow-right">&gt;</span>
        <BreadCrumb
          pathUrl={currentPath}
          rootFolder={rootFolderObject}
          onCrumbClick={onFolderOpen}
        />
      </div>
      <div className="w-full border-2 mt-4"></div>
      <FolderList
        folderListArr={currentFolderList}
        onFolderOpen={onFolderOpen}
      />
    </>
  );
};
export default Main;
