const getDateNowString = (todayNow) => {
  //   const todayNow = new Date();
  const yy = todayNow.getFullYear(); //.toString().substring(2);
  const mm = todayNow.getMonth() + 1;
  const dd = todayNow.getDate();
  const hh = todayNow.getHours();
  const mn = todayNow.getMinutes();
  const ss = todayNow.getSeconds();

  return `${dd < 10 ? "0" + dd : dd}${mm < 10 ? "0" + mm : mm}${yy}${
    hh < 10 ? "0" + hh : hh
  }${mn < 10 ? "0" + mn : mn}${ss < 10 ? "0" + ss : ss}`;
};

export default getDateNowString;
