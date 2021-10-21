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
};
