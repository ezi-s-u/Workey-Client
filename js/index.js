var progressInterval
var rotation = 8;

document.addEventListener('DOMContentLoaded', () => {
  const spanPayday = $('#until-payday');

  const spanStartTime = $('#start-time');
  const spanEndTime = $('#end-time');

  const user_id = Cookies.get("user_id");
  axios.get(`http://localhost:3000/main/${user_id}`)
    .then((result) => {
      const startTime = result.data.startTime
      // console.log(parseInt(startTime))
      const endTime = result.data.endTime
      const payday = new Date(result.data.payday)

      /* 월급날 계산 */
      const todayDate = moment();
      const paydayDate = moment().year(todayDate.year()).month(todayDate.month()).date(payday.getDate());
      // 만약 현재 날짜가 이미 월급날이 지났다면 다음 달의 월급날로 설정
      if (todayDate.isAfter(paydayDate)) {
        paydayDate.add(1, 'months');
      }

      const untilPayday = paydayDate.diff(todayDate, "days");
      // ajax innerHTML
      spanPayday.html(untilPayday);


      spanStartTime.html(convertTimeFormat(startTime)) // 화면에 출근 시간 출력
      spanEndTime.html(convertTimeFormat(endTime)) // 화면에 출근 시간 출력
      

      /* 애니메이션 */
      var startTimestamp = new Date().setHours(parseInt(startTime), 0, 0, 0);
      var endTimestamp = new Date().setHours(parseInt(endTime), 0, 0, 0);

      let workingTimeBar = document.getElementById("working-time-bar") // 바
      let barWidth = workingTimeBar.clientWidth; // 바 길이
      console.log(barWidth)

      let runningCharacter = document.getElementById("running-illust") // 캐릭터

      // 바의 너비를 조절하는 함수
      function increaseProgressBar() {
        // let now = new Date();

        // 현재 일하고 있는 시간인지
        function isWorkingTime() {
          const now = new Date();
          return now >= startTimestamp && now <= endTimestamp;
        }


        if (isWorkingTime()) {
          var currentTime = new Date() // 현재 시간
          let totalMinutes = (endTimestamp - startTimestamp);
          let elapsedTime = (currentTime - startTimestamp);
          let progress = (elapsedTime / totalMinutes) * 100;

          workingTimeBar.style.width = `${progress}%`
          console.log("width : " + workingTimeBar.style.width)

          // workingTimeBar.style.width = `${progress+0.02}%`
          runningCharacter.style.marginLeft = `${progress-11}%`


          // 이미지를 현재 각도에서 8도 회전합니다.
          rotation = (rotation === 8) ? -8 : 8;

          // 이미지의 각도를 변경합니다.
          runningCharacter.style.transform = 'rotate(' + rotation + 'deg)';
        } else {
          clearInterval(progressInterval);
          workingTimeBar.style.width = '100%';
          runningCharacter.style.marginLeft = '0px';

          // 이미지의 각도를 변경합니다.
          runningCharacter.style.transform = 'rotate(' + 0 + 'deg)';
        }

      }

      increaseProgressBar() // 페이지 로드 시 첫 번째 실행

      // 1초마다 increaseProgressBar 함수 호출
      progressInterval = setInterval(increaseProgressBar, 1000);

    }).catch((err) => {
      console.error(err);
    });
})

// '12:00 AM' 형태로 반환하는 함수
function convertTimeFormat(inputTime) {
  // 입력된 문자열을 Date 객체로 변환
  var inputDate = new Date('1970-01-01T' + inputTime);

    // 12시간 형식으로 변환
    var hours = inputDate.getHours();
    var minutes = inputDate.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0시일 경우 12로 표시

    // 시간과 분을 문자열로 조합
    var formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm;

    return formattedTime;
}

function extractNumbers(input) {
  // 정규 표현식을 사용하여 숫자와 점(.)을 찾음
  const matches = input.match(/[0-9.]+/g);
  return matches ? parseFloat(matches.join('')) : 0;
}