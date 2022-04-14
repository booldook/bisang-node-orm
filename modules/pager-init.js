module.exports = (_page, _totalRecord, _listCnt = 5, _pagerCnt = 3) => {
  const page = Number(_page);
  const totalRecord = Number(_totalRecord);
  const listCnt = Number(_listCnt);
  const pagerCnt = Number(_pagerCnt);
  const totalPage = Math.ceil(totalRecord / listCnt);
  const startIdx = (page - 1) * listCnt;
  const startPage = Math.floor((page - 1) / pagerCnt) * pagerCnt + 1;
  const endPage =
    startPage + pagerCnt - 1 > totalPage ? totalPage : startPage + pagerCnt - 1;
  const prevPage = page === 1 ? 1 : page - 1;
  const nextPage = page === totalPage ? totalPage : page + 1;
  const prevPager = startPage === 1 ? 1 : startPage - 1;
  const nextPager = endPage === totalPage ? totalPage : endPage + 1;
  return {
    page,
    totalPage,
    listCnt,
    pagerCnt,
    startIdx,
    startPage,
    endPage,
    prevPage,
    nextPage,
    prevPager,
    nextPager,
    totalRecord,
  };
};