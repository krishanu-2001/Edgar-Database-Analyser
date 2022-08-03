import React from 'react';

const findFolderListInCurrentList = (foldername, foldersArr) => {
  for (let folder of foldersArr) {
    if (folder.name === foldername) return folder;
  }
  return {
    name: 'root',
    path: '',
    children: [],
    isFolder: true,
    content: null
  };
};
const BreadCrumb = ({ pathUrl, rootFolder, onCrumbClick }) => {
  //console.log(pathUrl);

  const pathArr = pathUrl.split('/');
  pathArr.splice(pathArr.length - 1, 1);
  let tempObj;
  let tempFolder = rootFolder.children.slice();
  //console.log(pathArr);
  return !pathArr || !pathArr.length ? null : (
    <div className="  flex flex-row space-x-2 items-center text-md font-semibold">
      <div className=" bread-crumb-list flex flex-row space-x-2 items-center">
        {pathArr.map((name) => {
          tempObj = findFolderListInCurrentList(name, tempFolder);
          tempFolder = tempObj.children.slice();
          return (
            <div className="   flex flex-row space-x-2 " key={name}>
              <BreadcrumbItem folderObj={tempObj} onCrumbClick={onCrumbClick} />
              <span className="arrow-right">&gt;</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BreadcrumbItem = function ({ folderObj, onCrumbClick }) {
  return (
    <div
      className="hover:text-blue-300 cursor-pointer "
      onClick={() => {
        onCrumbClick(folderObj);
      }}
    >
      {folderObj.name}
    </div>
  );
};

export default BreadCrumb;
