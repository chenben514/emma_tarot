/* 00. 可改動區域 ------------------------------ */
/* 00-01. 商業邏輯  */
const cardCount = 78;
const targetCardCount = 3;

/* 00-02.  版型位置  */
const targetCardRatio = 1.5;
const finalCardRatio = 1.5;
const centerCardMargin = 20;
const targetCardMargin = 40;
const finalCardMargin = 20;
const initCardLeft = 20;
const initCardTop = 20;
const spreadX = 30;
let cardRowCount = 2;
let cardBackImg = "url('../img/card_back.png')";
const shufferX = 5;
const shufferY = 1;

const shufferRound = 5; //default can set 50, for debug purpose, set to 0
const showCardTime = 70; //default can set 70, for debug purpose, set to 0
/* 00.可改動區域 (結束) ------------------------ */

/* 01. 先算好的數字 ----------------------------- */
const windowHeight = $(window).height();
const windowWidth = $(window).width();

let cardWidth = Number(
  getComputedStyle(document.documentElement).getPropertyValue("--card-width")
);
if (windowWidth < 900 || windowHeight < 600) cardWidth = cardWidth / 2;
let cardHeight = Math.floor((cardWidth * 12) / 7);

const targetCardHeight = cardHeight * targetCardRatio;
const targetCardWidth = cardWidth * targetCardRatio;
const finalCardHeight = targetCardHeight * finalCardRatio;
const finalCardWidth = targetCardWidth * finalCardRatio;

//01.01. 出牌區

if (windowWidth < 900 || windowHeight < 600) cardRowCount = cardRowCount * 1.5;

const sectionCardTop = $(".section_cards")[0].offsetTop;
// alert(sectionCardTop);
const targetCardTop =
  windowHeight - targetCardHeight - targetCardMargin - sectionCardTop;
// alert(targetCardTop);
const targetCardTxtTop = targetCardTop + targetCardHeight + 5;

// alert(cardRowCount);

//01.02. 抽牌區
let pickCardTop = centerCardMargin;

/* 01. 先算好的數字(結束) ----------------------- */

/* 02. 初始值 ----------------------------- */
let initCard = false;
let cardStatus = "init";
let nowTargetCount = 0;

let cardReverse = [];
let targetCardPos = [];

for (let i = 0; i < targetCardCount; i++) {
  var myCardPos = new Object(),
    x = 0,
    y = 0;
  targetCardPos.push(myCardPos);
}
/* 02. 初始值（結束）--------------------------- */

// 1. 抽牌
let centerCardTop = 0;
let centerCardLeft = 0;

// 1.1.1 顯示第一張牌
centerCardTop = Math.floor(pickCardTop) + targetCardHeight * (shufferY / 2);

centerCardLeft = windowWidth / 2 - targetCardWidth / 2;

for (let i = 0; i < cardCount; i++) {
  // if (i % 5 === 0) {
  //   centerCardLeft += 1;
  //   centerCardTop -= 1;
  // }

  $("#center_cards").append(
    '<div class="center_card" id="center_card' +
      String(i).padStart(2, "0") +
      '"' +
      ' style="left:' +
      centerCardLeft +
      "px;" +
      " top:" +
      centerCardTop +
      "px;" +
      " width: " +
      targetCardWidth +
      "px;" +
      " height: " +
      targetCardHeight +
      "px;" +
      '"></div>'
  );
}

// 1.1.2 洗牌
for (let j = 0; j < shufferRound; j++) {
  for (let i = 0; i < cardCount; i++) {
    let centerCardShiftX =
      Math.floor(
        centerCardLeft + targetCardWidth * ((Math.random() - 0.5) * shufferX)
      ) + "px";
    // console.log("centerCardShiftX" + i + ":" + centerCardShiftX);

    let centerCardShiftY =
      Math.floor(
        centerCardTop + targetCardHeight * ((Math.random() - 0.5) * shufferY)
      ) + "px";
    // console.log("centerCardShiftY" + i + ":" + centerCardShiftY);
    let centerCardID = "#center_card" + String(i).padStart(2, "0");

    $(centerCardID).animate(
      {
        left: centerCardShiftX,
        top: centerCardShiftY,
      },
      1000
    );
  }
}
// 1.2. 顯示抽牌
let rowcardCount = Math.ceil(cardCount / cardRowCount);
// alert(cardRowCount);
// console.log(i + ":" + rowcardCount);

let centerCardColGap =
  ($(window).width() - 2 * centerCardMargin - rowcardCount * cardWidth) /
  (rowcardCount - 2);

//擺放牌陣
for (let i = 0; i < cardCount; i++) {
  centerCardTop = Math.floor(
    pickCardTop + Math.floor(i / rowcardCount) * (cardHeight / 2)
  );

  centerCardLeft =
    centerCardMargin +
    (i % rowcardCount) * cardWidth +
    (i % rowcardCount) * centerCardColGap;

  let centerCardID = "#center_card" + String(i).padStart(2, "0");

  $(centerCardID).animate(
    {
      left: centerCardLeft,
      top: centerCardTop,
    },
    1000 + i * showCardTime
  );
}

// 2.顯示出牌位置
let targetCardLeft = 0;

let targetCardGap = Math.floor(
  ($(window).width() -
    2 * targetCardMargin -
    targetCardCount * targetCardWidth) /
    (targetCardCount - 1)
);

for (let i = 0; i < targetCardCount; i++) {
  targetCardLeft = targetCardMargin + i * targetCardWidth + i * targetCardGap;
  targetCardPos[i].x = targetCardLeft;
  targetCardPos[i].y = targetCardTop;

  $("#target_cards").append(
    '<div class="target_card" id="target_card' +
      i +
      '"' +
      ' style="left:' +
      targetCardLeft +
      "px;" +
      " top:" +
      targetCardTop +
      "px;" +
      " width: " +
      targetCardWidth +
      "px;" +
      " height: " +
      targetCardHeight +
      "px;" +
      '"></div>'
  );
  $("#target_cards").append(
    '<div class="target_card_txt" id="target_card_txt' +
      i +
      '"' +
      ' style="left:' +
      targetCardLeft +
      "px;" +
      " top:" +
      targetCardTxtTop +
      "px;" +
      '">' +
      "尚未選擇" +
      "</div>"
  );
}

/* 3. 選牌 */
$(document).on("click", ".center_card", function () {
  if (nowTargetCount >= targetCardCount) {
    alert("你已經選了" + targetCardCount + "張牌了");
    return;
  }
  let clickID = "#" + this.id;

  let pickCardNo = parseInt(clickID.slice(clickID.length - 2, clickID.length));
  let cardNo = cardPos[pickCardNo];
  let cardImage = "url(./img/cards/" + cardNo + ".jpg)";

  let targetCardID = "#target_card" + nowTargetCount;
  let textID = "#target_card_txt" + nowTargetCount;
  let targetTextWidth = Number(document.querySelector(textID).offsetWidth);
  let targetCardMid = targetCardPos[nowTargetCount].x + cardWidth / 2;
  let targetTextLeftStr = targetCardMid - targetTextWidth / 2 + "px";
  nowTargetCount++;
  $(clickID).animate(
    {
      left: targetCardPos[nowTargetCount - 1].x + "px",
      top: targetCardPos[nowTargetCount - 1].y + "px",
      width: targetCardWidth + "px",
      height: targetCardHeight + "px",
    },
    1000,
    function () {
      $(clickID).css("opacity", 1);
      $(clickID).css("visibility", "hidden");
      $(targetCardID).css("background-image", cardImage);

      console.log("cardNo:" + cardNo);
      let cardResult = cardName[cardNo];
      if (cardReverse[cardNo] == 0) {
        cardResult += "(逆)";
        $(targetCardID).css("transform", "rotate(180deg)");
      } else {
        cardResult += "(正)";
      }

      ///2.顯示出牌文字
      document.querySelector(textID).innerText = cardResult;
      $("#pick_card_result").val(
        $("#pick_card_result").val() + nowTargetCount + ":" + cardResult + ";"
      );

      $(textID).css("left", targetTextLeftStr);
      // document.querySelector(textID).style.visibility = "visible";
      // document.querySelector(textID).style.opacity = "1";
      if (nowTargetCount === targetCardCount) {
        finalShow();
      }
    }
  );
});

/* 4. 選完所有牌 */
function finalShow() {
  let finalCardTop = pickCardTop;

  let finalCardLeft = 0;

  let finalCardGap = Math.floor(
    ($(window).width() -
      2 * finalCardMargin -
      targetCardCount * finalCardWidth) /
      (targetCardCount - 1)
  );

  let finalTextWidth;
  let finalTextHeight;
  let btnTopStr;
  let btnLeftStr;
  for (let i = 0; i < targetCardCount; i++) {
    ///1.顯示最後出牌位置
    finalCardLeft = finalCardMargin + i * finalCardWidth + i * finalCardGap;

    let targetCardID = "#target_card" + i;

    $(targetCardID).animate(
      {
        left: finalCardLeft,
        top: finalCardTop,
        width: finalCardWidth,
        height: finalCardHeight,
      },
      1000
    );

    ///2.顯示最後出牌文字
    let textID = "#target_card_txt" + i;
    let finalTextWidth = Number(document.querySelector(textID).offsetWidth);
    finalTextHeight = Number(document.querySelector(textID).offsetHeight);
    finalCardMid = finalCardLeft + finalCardWidth / 2;
    let finalTextLeft = finalCardMid - finalTextWidth / 2;
    let finalTextTop = finalCardTop + finalCardHeight + 20;

    $(textID).animate(
      {
        left: finalTextLeft + "px",
        top: finalTextTop + "px",
      },
      2000
    );

    ///3.記錄洗牌按鈕位置
    console.log("i:" + i + " targetCardCount:" + targetCardCount);
    if (i == Math.floor(targetCardCount / 2)) {
      btnTopStr = finalTextTop + 20 + finalTextHeight + "px;";

      if (windowWidth < 900 || windowHeight < 600)
        btnLeftStr = finalTextLeft - 20 + "px;";
      else btnLeftStr = finalTextLeft - 50 + "px;";
    }
  }
  // 3.把所有選牌隱藏
  for (let i = 0; i < cardCount; i++) {
    let CardID = "#center_card" + String(i).padStart(2, "0");
    $(CardID).css("visibility", "hidden");
    $(CardID).css("opacity", "true");
  }
  // 4. 顯示訊息
  document.querySelector("#message_1 h1").innerText = "以下是您的選擇結果";

  // 5. 顯示按鈕
  $("#target_cards").append(
    '<a href="#"  onclick="javascript:window.location.reload()" class="btn btn--white" id="refresh"' +
      ' style="left:' +
      btnLeftStr +
      " top:" +
      btnTopStr +
      '">重新洗牌</a>'
  );
}

/* N.1. 陣列亂數函數 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// N.2. 亂數取牌
cardPos = [];
cardReverse = [];
for (let i = 0; i < cardCount; i++) {
  cardPos.push(i);
  cardReverse.push(Math.floor(Math.random() * 2));
}
shuffle(cardPos);

// window.onload = function () {
//   document.getElementById("send").addEventListener("click", function (event) {
//     // event.preventDefault();
//     // generate a five digit number for the contact_number variable
//     // these IDs from the previous steps
//     console.log("send click");
//     let templateParams = {
//       name: $("#name").val(),
//       email: $("#email").val(),
//       question: $("#question").val(),
//       pick_card_result: $("#pick_card_result").val(),
//     };

//     if ($("#name").val().length === 0) {
//       alert("未填您的稱呼");
//       return;
//     }

//     if ($("#email").val().length === 0) {
//       alert("未填您的聯絡方式");
//       return;
//     }
//     console.log("email send");
//     emailjs.send("service_h6qkwrl", "template_qvkthmf", templateParams).then(
//       function () {
//         console.log("SUCCESS!");
//         alert("已成功送出");
//       },
//       function (error) {
//         console.log("FAILED...", error);
//         alert("傳送失敗:" + error);
//       }
//     );
//   });

//   document.getElementById("back").addEventListener("click", function (event) {
//     window.scrollTo(0, 0);
//   });
// };

function sendMail(event) {
  event.preventDefault();
  console.log("send click");
  let templateParams = {
    name: $("#name").val(),
    email: $("#email").val(),
    question: $("#question").val(),
    pick_card_result: $("#pick_card_result").val(),
  };

  if ($("#name").val().length === 0) {
    alert("未填您的稱呼");
    return;
  }

  if ($("#email").val().length === 0) {
    alert("未填您的聯絡方式");
    return;
  }
  console.log("email send");
  emailjs.send("service_h6qkwrl", "template_qvkthmf", templateParams).then(
    function () {
      console.log("SUCCESS!");
      alert("已成功送出");
    },
    function (error) {
      console.log("FAILED...", error);
      alert("傳送失敗:" + error);
    }
  );
  window.scrollTo(0, 0);
}

function returnTop(event) {
  event.preventDefault();
  window.scrollTo(0, 0);
}
