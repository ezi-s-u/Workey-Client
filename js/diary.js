let firstName;
let userId = Cookies.get("user_id");
let diaryId;

// 쿼리스트링값 저장
const url = new URL(window.location.href);
const urlParams = url.searchParams;
console.log(urlParams.get('id'));

// 쿼리스트링이 없다면
if (urlParams.get('id') !== null) {
    diaryId = urlParams.get('id');
    getDiaryData();
} else {
    // 이미 답했다면 답한 diary를 불러오자
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: `http://localhost:3000/diaries/list/${userId}`,           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: async function (result) { // 결과 성공 콜백함수
            // let lastDiaryDate = result[result.length - 1].createdAt.substring(0, 10);
            console.log(today);
            let yourDate = String(today).substring(8, 10);
            console.log("yourDate: "+yourDate);
            // 오늘 일기 작성 전이라면
            // if (lastDiaryDate !== yourDate) {
            await setUserFirstName();
            await setTodayQuestion(yourDate);
            
            // } else {
            //     Cookies.set("diary_id", result[result.length-1].id);
            //     diaryId = Cookies.get("diary_id");
            //     setUserFirstName();
            //     getDiaryData();
            // }
        }
    });
}

// user firtname 불러오기 
$.support.cors = true;
async function setUserFirstName() {
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: 'http://localhost:3000/users',           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: async function (result) { // 결과 성공 콜백함수
            result.forEach((result) => {
                if (result.id == userId) {
                    $("#first-name").text(result.firstName);
                }
            });
        }
    });
}

// 오늘의 질문 가져오기
$.support.cors = true;
async function setTodayQuestion(id) {
    let quesId = id;
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: `http://localhost:3000/questions/${quesId}`,           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: async function (question) { // 결과 성공 콜백함수
            $("#question").text(question);
        }
    });
}

// 즐겨찾기 클릭 이벤트 
let isClicked = false;
let originalBackgroundURL = 'url(../img/icon_star_writing.svg)';
let newBackgroundURL = 'url(../img/icon_filled_star_writing.svg)';
async function isStarClicked(obj) {
    if (!isClicked) {
        obj.style.background = newBackgroundURL;
        isClicked = true;
    } else {
        obj.style.background = originalBackgroundURL;
        isClicked = false;
    }
}

async function getSelfCheckScoreSum() {
    let sum = 0;
    sum += Number($(":input:radio[name=q1]:checked").val());
    sum += Number($(":input:radio[name=q2]:checked").val());
    sum += Number($(":input:radio[name=q3]:checked").val());
    sum += Number($(":input:radio[name=q4]:checked").val());
    return sum;
}

async function getStateImgSrc(score) {
    console.log("sum score: " + score);
    if (score >= 80) {
        return "./img/state_good.svg";
    } else if (score >= 46) {
        return "./img/state_normal.svg";
    } else {
        return "./img/state_bad.svg";
    }
}

// post new diary
async function createDiary() {
    let sum = await getSelfCheckScoreSum();// 총합
    let imgSrc = await getStateImgSrc(sum);
    let state = false;
    if (imgSrc === "./img/state_good.svg")
        state = true;
    let isStar = isClicked;

    const req = {
        "answer": $("#answer").val(),
        "star": isStar,
        "score": sum,
        "state": state,
        "companyId": Cookies.get("company_id")
    }

    let dateFormat = await getTodayDate(String(today));
    let quesId = dateFormat.substring(10, 12);
    
    axios.post(`http://localhost:3000/diaries/${userId}/${quesId}`, req)
        .then(async (result) => {
            if (result.data.data.state) {
                await saveGoodCount(result.data.data.companyId);
            }
            // location.href = "../list.html";
            return true;
        }).catch((err) => {
            console.log(err);
        });

}

async function saveGoodCount(companyId) {
    let req = {};

    axios.patch(`http://localhost:3000/companies/${companyId}`, req)
        .then(async (result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
}

async function getDiaryData() {
    await setUserFirstName();
    axios.get(`http://localhost:3000/diaries/${diaryId}`)
        .then(async (result) => {
            console.log("quesId: " + result.data.quesId);
            await setTodayQuestion(result.data.quesId);
            // document.getElementById("question").textContent = question;
            // console.log($("p#question.title").text());
            console.log(question);
            console.log(result);
            $("#answer").text(result.data.answer);
        }).catch((err) => {
            console.log("문제 불러오기 실패");
        });
}