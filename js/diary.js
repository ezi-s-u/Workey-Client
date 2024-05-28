let firstName;
let userId = Cookies.get("user_id");
let diaryId;

// 이미 답했다면 답한 diary를 불러오자
$.ajax({
    type: 'get',           // 타입 (get, post, put 등등)
    url: `http://localhost:3000/diaries/list/${userId}`,           // 요청할 서버url
    async: true,            // 비동기화 여부 (default : true)
    dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
    data: {},
    success: function (result) { // 결과 성공 콜백함수
        let lastDiaryDate;
        // let lastDiaryDate = result[result.length - 1].createdAt.substring(0, 10);
        const date = new Date();
        let yourDate = date.toISOString().split('T')[0].substring(8,10);
        console.log(yourDate);
        // 오늘 일기 작성 전이라면
        // if (lastDiaryDate !== yourDate) {
            getUserFirstName();
            getTodayQuestion(yourDate);
        // } else {
        //     Cookies.set("diary_id", result[result.length-1].id);
        //     diaryId = Cookies.get("diary_id");
        //     getUserFirstName();
        //     getDiaryData();
        // }
    }
});

// user firtname 불러오기 
$.support.cors = true;
function getUserFirstName() {
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: 'http://localhost:3000/users',           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: function (result) { // 결과 성공 콜백함수
            result.forEach((result) => {
                if (result.id == userId) {
                    $("#first-name").text(result.firstName);
                }
            });
        }
    });
}

// 오늘의 질문 가져오기
let quesId;
$.support.cors = true;
function getTodayQuestion(id) {
    quesId = id;
    $.ajax({
        type: 'get',           // 타입 (get, post, put 등등)
        url: `http://localhost:3000/questions/${quesId}`,           // 요청할 서버url
        async: true,            // 비동기화 여부 (default : true)
        dataType: 'json',       // 데이터 타입 (html, xml, json, text 등등)
        data: {},
        success: function (question) { // 결과 성공 콜백함수
            $("#question").text(question);
        }
    });
}

// 즐겨찾기 클릭 이벤트 
let isClicked = false;
let originalBackgroundURL = 'url(../img/icon_star_writing.svg)';
let newBackgroundURL = 'url(../img/icon_filled_star_writing.svg)';
function isStarClicked(obj) {
    if (!isClicked) {
        obj.style.background = newBackgroundURL;
        isClicked = true;
    } else {
        obj.style.background = originalBackgroundURL;
        isClicked = false;
    }
}

function getSelfCheckScoreSum() {
    let sum = 0;
    sum += Number($(":input:radio[name=q1]:checked").val());
    sum += Number($(":input:radio[name=q2]:checked").val());
    sum += Number($(":input:radio[name=q3]:checked").val());
    sum += Number($(":input:radio[name=q4]:checked").val());
    return sum;
}

async function getStateImgSrc(score) {
    console.log("sum score: "+score);
    if (score >= 80) {
        return "./img/state_good.svg";
    } else if (score >= 46) {
        return "./img/state_normal.svg";
    } else {
        return "./img/state_bad.svg";
    }
}

async function createDiary() {
    console.log("createDiary");
    let sum = await getSelfCheckScoreSum();// 총합
    console.log(sum);
    let imgSrc = await getStateImgSrc(sum);
    console.log(imgSrc);
    let state = false;
    if ( imgSrc === "./img/state_good.svg" )
        state = true;
    console.log(state);
    let isStar = isClicked;
    console.log(isStar);

    const req = {
        "answer": $("#answer").val(),
        "star": isStar,
        "score": sum,
        "state": state,
        "companyId": Cookies.get("company_id")
    }

    console.log(req);
    await axios.post(`http://localhost:3000/diaries/${userId}/${quesId}`, req)
        .then(async (result) => {
            if (result.data.data.state) {
                console.log(result);
                await saveGoodCount(result.data.data.companyId);
            }
            // saveGoodCount(result.)
            // location.href = "../list.html";
            return true;
        }).catch((err) => {

        });

}

async function saveGoodCount(companyId) {
    console.log(companyId);
    await axios.patch(`http://localhost:3000/companies/${companyId}`)
        .then(async (result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
        });
}

// let diaryId;
async function showDiary(diaryId) {
    await axios.get(`http://localhost:3000/diaries/${diaryId}`)
        .then(async (result) => {
            Cookies.set("diary_id", diaryId);
            location.href = '../diary.html';
        }).catch((err) => {
            console.log(err);
            console.log("다이어리 실패");
        });
}

function getDiaryData() {
    axios.get(`http://localhost:3000/diaries/${diaryId}`)
        .then(async (result) => {
            console.log(result);
            $("#answer").text(result.data.answer);

        }).catch((err) => {
            console.log("문제 불러오기 실패");
        });
}