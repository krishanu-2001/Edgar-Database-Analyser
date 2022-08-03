// import { mdiFolder, mdiDelete, mdiPencil } from "@mdi/js";
import React from 'react';
import FolderItem from './FolderItem';
import FileItem from './FileItem';
export default function folderList({ folderListArr, onFolderOpen }) {
  // console.log(folderListArr);
  return folderListArr.length ? (
    <div className="grid   lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 grid-flow-row place-content-start gap-8 bg-gray-100 bg-opacity-60 p-6 rounded-xl h-full mt-4  ">
      {folderListArr.map((item) =>
        item.isFolder ? (
          <FolderItem
            key={item.name}
            folderObj={item}
            onFolderOpen={onFolderOpen}
          />
        ) : (
          <FileItem key={item.name} folderObj={item} />
        )
      )}
    </div>
  ) : (
    <div className="grid  text-center text-gray-400 text-opacity-70 text-2xl gap-2 bg-gray-100 bg-opacity-60 p-6 rounded-xl h-full mt-4">
      <div className="mt-8">This Folder is Empty</div>
    </div>
  );
}
