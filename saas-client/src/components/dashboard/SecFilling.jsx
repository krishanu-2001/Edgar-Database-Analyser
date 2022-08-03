import React, { useContext } from 'react';
import Main from '../folder/Main';
import Context from '../../context/context-config';

function SecFilling(props) {
  const myContext = useContext(Context);
  const Companies = myContext.selectedCompanies;

  if (!Companies[0]) {
    return <div>No Company Selected</div>;
  }
  if (
    !Companies[0]._10k ||
    !Companies[0]._10q ||
    Companies[0]._10k.length === 0 ||
    Companies[0]._10q.length === 0
  ) {
    return <div>No Data Available</div>;
  }
  return (
    <div className="flex flex-col h-full  ml-2 rounded-xl ">
      <Main Company={Companies[0]} />
    </div>
  );
}

export default SecFilling;
