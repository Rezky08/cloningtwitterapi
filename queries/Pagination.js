const DEFAULT_PAGE = 1;
const DEFAULT_PERPAGE = 10;
const pagination = (page = 1, perpage = 10) => {
  page = parseInt(page);
  perpage = parseInt(perpage);
  return [
    { $skip: page > 0 ? (page - 1) * perpage : 0 },
    {
      $limit: perpage,
    },
  ];
};

module.exports = {
  pagination,
  DEFAULT_PAGE,
  DEFAULT_PERPAGE,
};
