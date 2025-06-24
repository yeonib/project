
/*new*/

(() => {
  // marquee
  const initMarqueeScroll = () => {
    const marqueeInner = document.querySelector('.marquee-inner');
    if (!marqueeInner) return;

    // 복제해서 자연스럽게 반복되도록
    const clone = marqueeInner.cloneNode(true);
    marqueeInner.parentNode.appendChild(clone);
  };
  //skill bar
  const initSkillBarAnimation = () => {
    $(".bar_outer").each(function () {
      const $outer = $(this);
      const percent = $outer.data("percent");

      const $bar = $outer.find(".bar_inner");
      const $bubble = $outer.find(".speech_bubble");

      if ($bar.length && $bubble.length) {
        $bar.animate(
          { width: percent + "%" },
          2000,
          function () {
            $bubble.text(percent + "%").fadeIn();
          }
        );
      }
    });
  };

  $(window).on("load", function () {
    setTimeout(() => {
      initSkillBarAnimation();
    }, 300); // DOM 다 뜨고 여유 있게 실행
  });



  const init = () => {
    initSkillBarAnimation();
    initMarqueeScroll();
  };

  window.addEventListener("load", init);
})();








