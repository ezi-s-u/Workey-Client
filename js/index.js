getUserInform()

function getUserInform() {
  const spanPayday = $('#until-payday');
  // const spanPayday = document.getElementById('until-payday');
  console.log(spanPayday);

  const user_id = Cookies.get("user_id");
  axios.get(`http://localhost:3000/main/${user_id}`)
    .then((result) => {
      const startTime = result.data.startTime
      const endTime = result.data.endTime
      const payday = new Date(result.data.payday)
      
      const todayDate = moment();
      const paydayDate = moment().year(todayDate.year()).month(todayDate.month()).date(payday.getDate());
      console.log(paydayDate)


      // 만약 현재 날짜가 이미 월급날이 지났다면 다음 달의 월급날로 설정
      if (todayDate.isAfter(paydayDate)) {
        paydayDate.add(1, 'months');
      }

      const untilPayday = paydayDate.diff(todayDate, "days");
      console.log(untilPayday)

      // ajax 
      spanPayday.html(untilPayday);

    }).catch((err) => {
      console.error(err);
    });
}

// location.href = `./index.html?user_id=${id}`;