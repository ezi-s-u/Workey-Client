/* API 연동 */
$.support.cors = true;

function login() {
  let email = document.getElementById("email").value;
  let pw = document.getElementById("password").value;

  const req = {
    email: email,
    password: pw
  }

  axios.post(`http://localhost:3000/users/login`, req)
  .then((result) => {
    Cookies.set("user_id", result.data.id);
    // Cookies.get("user_id")
  }).catch((err) => {
    
  });
}

// function login() {
// $.ajax({
//   type: 'post',               // HTTP 요청 방식 (get, post, put 등)
//   url: 'http://localhost:3000/users/login',  // 요청할 서버 URL
//   async: true,               // 비동기화 여부 (기본값: true)
//   dataType: 'json',          // 서버에서 받아올 데이터 타입 (html, xml, json, text 등)
//   data: {},                  // 서버에 전송할 데이터 (이 경우 빈 객체)
//   success: function(result) { // 서버 요청이 성공했을 때의 콜백 함수
//       // 서버 응답 데이터 중 'result' 속성에 대한 작업 수행

//       // result.result.forEach((result) => {
//       //     // 이전에 생성된 div 요소들을 삭제하는 함수 호출
//       //     deleteDivList();
          
//       //     // 서버 응답 데이터에서 'title' 속성 추출
//       //     var title = result.title;
          
//       //     // 'title'이 사용자 입력을 포함하고 있는지 확인
//       //     if (title.includes(input)) {
//       //         // 검색어를 포함하는 경우, 해당 아이템을 화면에 표시하는 함수 호출
//       //         search(result.id);
//       //     }
//       // });

//       console.log('로그인 성공?!');
//   }
// });
// }

/* 프론트 */
const pw = document.getElementById('password');
const visibleIcon = document.querySelector('.visible-btn')

// 비번 보이기 안보이기
function passwordVisible() {
  pw.classList.toggle('active');
  console.log(visibleIcon);

  if (pw.classList.contains('active')) {
    visibleIcon.style.backgroundImage = 'url("../img/icon_visible.svg")';
    pw.type = "text";
  } else {
    visibleIcon.style.backgroundImage = 'url("../img/icon_invisible.svg")';
    pw.type = "password";
  }
}

// 비번 보이기 버튼
function writePw(value) {
  console.log('writePw');
  if (value.trim() !== '') {
    visibleIcon.style.display = 'block';
  } else {
    visibleIcon.style.display = 'none';
  }
}