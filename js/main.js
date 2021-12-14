const marioListUl = $("#marioList");
const lnbUl = $("#main #lnb");
let marioSlider = null;
let marioTweener = null;
let _z = 0;
let total = 0;
const zAmount = 5000;
const wheelStep = zAmount / 10;

function loadJson(jsonFile) {
  $.ajax({
    url: jsonFile,
    success: function (res) {
      const marioList = res.items;
      let output = "";
      let lnbOutput = "";
      _z = 0;
      total = marioList.length;
      $.each(marioList, function (idx, item) {
        lnbOutput += `
        <li>${item.title}</li>
        `;
        output += `
      <li style="background : ${item.bg}; transform:translateZ(${-zAmount * idx}px); z-index:${total - idx}">
      <div class="info" >
      <h2 class="title" data-splitting>${item.title}</h2>
      <p class="desc" data-splitting>${item.desc}</p>
      <a href="${item.link}" target="${item.target}">MORE</a>
      </div>
      <div class="img">
      <img src="${item.img}">
      </div>
      </li>
      `;
      });
      lnbUl.html(lnbOutput);
      marioListUl.html(output);
      gsap.from("#marioList li", {
        z: "-=100000",
        opacity: 0,
        scale: 0,
        stagger: {
          from: "end",
          each: 0.2,
        },
      });
      $("#lnb li").eq(0).addClass("on");
      // eq : 순서..
    },
    error: function (err) {
      location.href = "error.html";
      return;
    },
  });
}
loadJson("../data/mario.json");

//ajax는 비동기..
const gnbList = $("#gnb ul li");

gnbList.on("click", function (e) {
  e.preventDefault();
  const jsonFile = $(this).data("json");
  if ($(this).hasClass("selected")) return;
  $(this).addClass("selected").siblings("li").removeClass("selected");
  loadJson(jsonFile);
});

console.log(Math.min(10, 4, 5, 6, 2, 3));
// 이벤트 위임.. event delegation
const lnbList = $("#lnb li");
let oldIndex = 0;
$("#lnb").on("click", "li", function () {
  if ($(this).hasClass("on")) return;
  $(this).addClass("on").siblings("li").removeClass("on");
  _z = zAmount * $(this).index();
  const _duration = Math.min(1.5, Math.abs($(this).index() - oldIndex) * 0.5);
  // 최소값, 최대값 : Math.min, Math.max
  $("#marioList li").each(function (idx, item) {
    gsap.to(item, { z: _z - zAmount * idx, duration: _duration });
  });
  oldIndex = $(this).index();
});

$(window).on("mousewheel", function (e) {
  const wheel = e.originalEvent.deltaY;
  if (wheel > 0) {
    _z += wheelStep;
    if (_z > zAmount * (total - 1)) {
      _z = zAmount * (total - 1);
      return;
    }
  } else {
    _z -= wheelStep;
    if (_z < 0) {
      _z = 0;
      return;
    }
  }
  $("#marioList li").each(function (idx, item) {
    gsap.to(item, { z: _z - zAmount * idx });
  });
  const lnbSelected = Math.floor(_z / zAmount);
  $("#lnb li").eq(lnbSelected).addClass("on").siblings("li").removeClass("on");
});
