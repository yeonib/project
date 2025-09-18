
/*new*/

(() => {
  // marquee
  const initMarqueeScroll = () => {
    const marqueeInner = document.querySelector('.marquee-inner');
    if (!marqueeInner) return;

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
    }, 300); 
  });

  const init = () => {
    initSkillBarAnimation();
    initMarqueeScroll();
  };

  window.addEventListener("load", init);
})();








