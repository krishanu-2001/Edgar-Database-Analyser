function get_filings(obj, curPath) {

  let children = [];

  // console.log(obj.sec_filing)
  // obj[sec_filing].forEach(({ name, url }) =>
  for (let filing of obj.sec_filing) {
    // console.log(name, url);
    children.push({
      name: filing.name,
      path: `${curPath}`,
      children: null,
      isFolder: false,
      content: { url: filing.url }
    });
  }
  return children;
}

function get_year(obj, curPath) {
  let children = [];
  // console.log(Object.keys(obj));
  // Object.keys(obj).forEach((name) =>
  /*for (let name of Object.keys(obj)) {
    console.log(name)
    children.push({
      name: name,
      path: `${curPath}`,
      children: get_filings(obj[name], `${curPath}${name}/`),
      isFolder: true,
      content: null
    });*/
  for (let item of obj) {
    //  console.log(item)
    children.push({
      name: item.id,
      path: `${curPath}`,
      children: get_filings(item, `${curPath}${item.id}/`),
      isFolder: true,
      content: null
    });
  }
  return children;
}

function get_forms(obj) {
  let children = [
    {
      name: '10-K',
      path: '',
      children: get_year(obj['_10k'], '10-K/'),
      isFolder: true,
      content: null
    },
    {
      name: '10-Q',
      path: '',
      children: get_year(obj['_10q'], '10-Q/'),
      isFolder: true,
      content: null
    }
  ];
  return children;
}

const generateRootFolder = (obj) => {
  //console.log(obj)
  return {
    name: 'root',
    path: '',
    children: get_forms(obj),
    isFolder: true,
    content: null
  };
}

export { generateRootFolder };
