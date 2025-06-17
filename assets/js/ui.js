
/*new*/

(() => {
  const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";
  const specialChars = "▪";

  // marquee
  const initMarqueeScroll = () => {
    const marqueeInner = document.querySelector('.marquee-inner');
    if (!marqueeInner) return;

    // 복제해서 자연스럽게 반복되도록
    const clone = marqueeInner.cloneNode(true);
    marqueeInner.parentNode.appendChild(clone);
  };
  //intro
  const initTerminalPreloader = () => {
    const terminalLines = document.querySelectorAll(".terminal-line");
    const preloaderEl = document.getElementById("preloader");
    const contentEl = document.getElementById("content");

    const originalTexts = {};
    document.querySelectorAll('.terminal-line span[data-scramble="true"]').forEach((span, index) => {
      const originalText = span.textContent;
      originalTexts[index] = originalText;
      span.setAttribute("data-original-text", originalText);
      span.textContent = "";
    });

    gsap.set(".terminal-line", { opacity: 0 });

    const updateProgress = (percent) => {
      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = percent + "%";
      }
    };

    const animateTerminalPreloader = () => {
      updateProgress(0);
      const tl = gsap.timeline({ onComplete: revealContent });
      const totalDuration = 6;
      const allLines = Array.from(document.querySelectorAll(".terminal-line"));
      allLines.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));

      const textRevealTl = gsap.timeline();

      allLines.forEach((line, lineIndex) => {
        const baseOpacity = lineIndex % 2 === 0 ? 1 : 0.7;
        const timePoint = (lineIndex / allLines.length) * (totalDuration * 0.8);

        textRevealTl.to(line, { opacity: baseOpacity, duration: 0.3 }, timePoint);

        const scrambleSpans = line.querySelectorAll('span[data-scramble="true"]');
        scrambleSpans.forEach((span) => {
          const originalText = span.getAttribute("data-original-text") || span.textContent;
          textRevealTl.to(span, {
            duration: 0.8,
            scrambleText: {
              text: originalText,
              chars: specialChars,
              revealDelay: 0,
              speed: 0.3
            },
            ease: "none"
          }, timePoint + 0.1);
        });
      });

      tl.add(textRevealTl, 0);

      for (let i = 0; i < 3; i++) {
        const randomTime = 1 + i * 1.5;
        tl.add(() => {
          const glitchTl = gsap.timeline();
          const allScrambleSpans = document.querySelectorAll('span[data-scramble="true"]');
          const randomSpans = [];
          const numToGlitch = 3 + Math.floor(Math.random() * 3);
          for (let j = 0; j < numToGlitch; j++) {
            const randomIndex = Math.floor(Math.random() * allScrambleSpans.length);
            randomSpans.push(allScrambleSpans[randomIndex]);
          }

          randomSpans.forEach((span) => {
            const text = span.textContent || span.getAttribute("data-original-text");
            glitchTl.to(span, {
              duration: 0.2,
              scrambleText: {
                text: text,
                chars: specialChars,
                revealDelay: 0,
                speed: 0.1
              },
              ease: "none",
              repeat: 1
            }, Math.random() * 0.5);
          });
          return glitchTl;
        }, randomTime);
      }

      const disappearTl = gsap.timeline();
      disappearTl.to(allLines, {
        opacity: 0,
        duration: 0.2,
        stagger: 0.1,
        ease: "power1.in"
      });
      tl.add(disappearTl, totalDuration - 1);

      tl.eventCallback("onUpdate", () => {
        const progress = Math.min(99, tl.progress() * 100);
        updateProgress(progress);
      });

      tl.call(() => updateProgress(100), [], totalDuration - 0.5);
    };

    const revealContent = () => {
      const titleLines = document.querySelectorAll(".quote-section .title-line span");
      const revealTl = gsap.timeline();

      revealTl.to(preloaderEl, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.64,
        ease: slideEase,
        onComplete: () => {
          preloaderEl.style.display = "none";
        }
      });

      revealTl.to(contentEl, {
        opacity: 1,
        visibility: "visible",
        duration: 0.3
      }, "-=0.3");

      revealTl.call(() => {
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach((link) => {
          const splitLink = new SplitText(link, {
            type: "chars",
            charsClass: "char",
            position: "relative",
            linesClass: "line",
            deepSlice: true,
            propIndex: true
          });
          link._splitText = splitLink;

          link.addEventListener("mouseenter", () => {
            gsap.to(splitLink.chars, {
              x: (i) => `${0.5 + i * 0.1}em`,
              duration: 0.64,
              ease: slideEase,
              stagger: { each: 0.015, from: "start" }
            });
          });
          link.addEventListener("mouseleave", () => {
            gsap.to(splitLink.chars, {
              x: 0,
              duration: 0.64,
              ease: slideEase,
              stagger: { each: 0.01, from: "end" }
            });
          });
        });
      });

      revealTl.to(titleLines, {
        y: "0%",
        duration: 0.64,
        stagger: 0.1,
        ease: slideEase
      }, "-=0.2");
    };

    gsap.set(preloaderEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
    });

    const titleLines = document.querySelectorAll(".quote-section .title-line span");
    gsap.set(titleLines, { y: "100%" });

    animateTerminalPreloader();
  };

  const initScrollHorizontal = () => {
    gsap.registerPlugin(ScrollTrigger);
    const scrollContainer = document.querySelector(".main__scroll");
    const panels = gsap.utils.toArray(".scroll__panel");
    const totalScrollWidth = scrollContainer.scrollWidth;
    document.body.style.height = totalScrollWidth + "px";
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: scrollContainer,
        pin: ".main-container__main",
        scrub: 1,
        end: () => "+=" + totalScrollWidth
      }
    });
  };

  const initLogoAnimation = () => {
    const logoSvg = document.querySelector(".draw-title text");
    if (logoSvg) {
      logoSvg.classList.add("animate");
    }
  };

  const initMenuCloneEffect = () => {
    const menuPanel = document.getElementById("menuPanel");
    const originalMenu = menuPanel.querySelector(".menu-panel__list");
    const header = menuPanel.querySelector(".menu-panel__header");
    const clonedMenu = originalMenu.cloneNode(true);
    clonedMenu.classList.add("menu-panel__list--clone");
    document.body.appendChild(clonedMenu);
    ScrollTrigger.create({
      trigger: ".main__scroll",
      start: "top top",
      end: () => "+=" + (document.querySelector(".main__scroll").scrollWidth - window.innerWidth),
      scrub: true,
      onUpdate: () => {
        const menuRect = menuPanel.getBoundingClientRect();
        const triggerX = 0 - header.offsetWidth;
        if (menuRect.left <= triggerX) {
          originalMenu.style.opacity = "0";
          clonedMenu.style.opacity = "1";
        } else {
          originalMenu.style.opacity = "1";
          clonedMenu.style.opacity = "0";
        }
      }
    });
  };

  const initAboutTextAnimation = () => {
    const fadeTxt = document.querySelector('.fade-txt');
    const slideTxt = document.querySelector('.slide-txt');
    if (fadeTxt) setTimeout(() => fadeTxt.classList.add('show'), 300);
    if (slideTxt) setTimeout(() => slideTxt.classList.add('show'), 600);
  };

  const initMenuActiveEffect = () => {
    document.querySelectorAll('#menuPanel .menu-panel__list a').forEach(link => {
      ['mouseenter', 'mouseleave'].forEach(event =>
        link.addEventListener(event, () => {
          link.style.transition = 'color 1s ease';
          link.style.color = event === 'mouseenter' ? '#0000CD' : '#332B24';
        })
      );
    });
  };

  const initaboutHoverEffect = () => {
    const wrapper = document.querySelector('.content_wrap');
    const cateItems = wrapper.querySelectorAll('.about_cate--list');
    const contentArea = wrapper.querySelector('.about_content_area');
    const contentItems = contentArea ? contentArea.querySelectorAll('.about_content_area > div') : [];
    if (!cateItems.length || !contentArea || !contentItems.length) return;
    let currentIndex = null;
    cateItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        currentIndex = index;
        contentArea.classList.add('show');
        contentItems.forEach(content => content.classList.remove('show'));
        const target = contentArea.querySelector(`.about_content--0${index + 1}`);
        if (target) target.classList.add('show');
      });
    });
  };

  const initProjectPageTransition = () => {
    const overlay = document.querySelector('.page-transition');
    if (!overlay) return;
    const links = document.querySelectorAll('.project-link a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        requestAnimationFrame(() => {
          overlay.classList.add('active');
          setTimeout(() => {
            window.location.href = href;
          }, 1000);
        });
      });
    });
  };

  const init = () => {
    initTerminalPreloader();
    initScrollHorizontal();
    initLogoAnimation();
    initMenuCloneEffect();
    initAboutTextAnimation();
    initMenuActiveEffect();
    initaboutHoverEffect();
    initProjectPageTransition();
    initMarqueeScroll();
  };

  window.addEventListener("load", init);
})();








