// main variables that used in code
const slideContainer = document.querySelector('.slide__container')
const rotateBlock = document.querySelector('.rotate__block');
const agreementButton = document.querySelector('.agree');
const nextSlideButton = document.querySelector('.arrow--next');
const prevSlideButton = document.querySelector('.arrow--prev');

// additional variables for timeout Ids
let nextButtonTimeout;
let prevButtonTimeout;
let lastSlideActionTimeout;

// additional variables for arrows
const hiddenArrowClass = 'hidden';
let nextArrowDelay = 3.7;

// additional varibles for slides
const totalSlideAmount = 11;
const pathNames = Array.from(
  { length: totalSlideAmount }, (_, i) => ({ count: i + 1, pathName:`./slides/slide--${i + 1}.html` })
);

// additional function for detecting correct font-size
function heightDetect(percent) {
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  return (percent * (height - 6)) / 100;
}
function widthDetect(percent) {
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  return (percent * width) / 100;
}
function setResponsiveFontSize() {
  $('.slide__container').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
  $('.arrows').css({
    'font-size': `clamp(1px, ${heightDetect(0.925925)}px,${widthDetect(0.520833)}px)`
  });
}

// function for action after last slide
function lastSlideAction() {
  let id = $('#presentation', window.parent.document).attr('data-id');
  let $url = $('#presentation', window.parent.document).attr('data-request-url');
  let href = $('#presentation', window.parent.document).attr('data-href');
  let $token = $('meta[name="csrf-token"]', window.parent.document).attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $token
    }
  });
  $.ajax({
    type: "POST",
    url: $url,
    data: {"id": id},
    success: function (data) {
      if (data !== false) {
        parent.location.href = href;
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

// function that animate number from 0 to correct num
function animateNumber(delay, className) {
  const allElements = document.querySelectorAll(`${className}[data-number]`);

  allElements.forEach(el => {
    const targetNumber = Number(el.getAttribute('data-number'));

    gsap.to(el, {
      duration: 2.5,
      innerHTML: targetNumber,
      delay,
      onUpdate: () => {
        el.innerHTML = Math.round(el.innerHTML);
      },
      onComplete: () => {
        el.innerHTML = targetNumber;
      }
    });
  });
}

// function that type text from scretch
function typewriterEffect(selector, duration, delay) {
  const el = document.querySelector(selector);
  const innerText = el.getAttribute('data-text');

  gsap.to(el, {
    duration: duration,
    text: innerText,
    ease: 'none',
    delay,
  });
}

// object that store manipulations with slides
const slideActions = {
  1: () => {
    $('.arrow--next').addClass('arrow--white');
    gsap.fromTo('.slide--1__content h3',
      { scale: 0 },
      {
        scale: 1.2, duration: 0.65, delay: 1, ease: "power2.out",
        onComplete() {
          gsap.to('.slide--1__content h3', { scale: 1, delay: 0.05, duration: 0.25, ease: "power2.in" });
        }
      }
    );
    gsap.from('.slide--1__content h2', { opacity: 0, duration: 0.75, delay: 1.95, y: '25%' });
    gsap.from('.slide--1__content h4', { opacity: 0, duration: 0.75, delay: 2.7 });
    nextArrowDelay = 3.7;
  },
  2: () => {
    $('.arrow--next').removeClass('arrow--white');
    $('.arrow--prev').removeClass('arrow--white');

    gsap.from('.slide--2__right-top h2', { opacity: 0, duration: 0.75, delay: 1, y: '-25%' });
    gsap.from('.slide--2__right-bottom p', { opacity: 0, duration: 0.75, delay: 1, y: '25%' });
    gsap.from('.slide--2__line', { opacity: 0, duration: 0.75, delay: 1.5, scaleY: '0' });
    gsap.from('.slide--2__button.night', { opacity: 0, duration: 0.75, delay: 2.25, y: '-25%' });
    gsap.from('.slide--2__button.day', { opacity: 0, duration: 0.75, delay: 2.25, y: '25%' });


    $('.slide--2__button img').on('click', function() {
      $(this).parent().addClass('active');

      gsap.to(
        $(this).parent().parent().find('ul li'),
        { x: 0, opacity: 1, delay: 0.5, duration: 0.35, stagger: 0.25, ease: "power2.out" }
      );

      if ($(this).parent().parent().find('p').length !== 0) {
        gsap.to(
          $(this).parent().parent().find('p'),
          { y: 0, opacity: 1, delay: 1.85, duration: 0.35 }
        );
      }

      if ($('.slide--2__button.active').length === 2) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.5 * 1000);
      }
    });
  },
  3: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');

    $('.slide--3__right .triangle').on('click', function() {
      $(this).parent().parent().addClass('active');

      gsap.to(
        '.slide--3__right ul li',
        { y: 0, opacity: 1, delay: 0.5, duration: 0.7, stagger: 0.3, ease: "power2.out" }
      );

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 4.5 * 1000);
    });
  },
  4: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    
    $('.slide--4__bottle-click').on('click', function() {
      $(this).addClass('active');

      gsap.to('.slide--4__content-wrapper > p', { opacity: 1, duration: 0.75, delay: 0.75, x: '0' });
      gsap.to('.slide--4__content h2', { opacity: 1, duration: 0.75, delay: 1.1, x: '0' });
      gsap.to('.slide--4__content h3', { opacity: 1, duration: 0.75, delay: 1.45, x: '0' });
      gsap.to('.slide--4__block', { opacity: 1, duration: 0.75, delay: 1.8, x: '0' });

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 2.8 * 1000);
    })
  },
  5: () => {
    $('.arrows').removeClass('top');
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    
    $('.slide--5__block .circle').on('click', function() {
      $(this).addClass('active')

      gsap.to($(this).parent().find('.line'), { opacity: 1, duration: 0.5, delay: 0.75, scaleX: 1 });
      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.75, delay: 1.25, y: '0' });
      gsap.to($(this).parent().find('h3'), { opacity: 1, duration: 0.75, delay: 1.25, y: '0' });

      if ($('.slide--5__block .circle.active').length === 5) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.75 * 1000);
      }
    })
  },
  6: () => {
    $('.arrows').addClass('top');
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');

    gsap.from('.slide--6__content h2', { opacity: 0, duration: 0.75, delay: 1 });
    gsap.from('.slide--6__content .line', { opacity: 0, duration: 0.75, delay: 1.5, scaleY: 0 });
    typewriterEffect('.slide--6__content p', 5.25, 2.25)

    nextArrowDelay = 8;
  },
  7: () => {
    $('.arrows').removeClass('top');
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    
    $('.slide--7__block .circle').on('click', function() {
      $(this).addClass('active')

      gsap.to($(this).parent().find('.line'), { opacity: 1, duration: 0.5, delay: 0.75, scaleX: 1 });
      gsap.to($(this).parent().find('p'), { opacity: 1, duration: 0.75, delay: 1.25, x: '0' });

      if ($('.slide--7__block .circle.active').length === 3) {
        gsap.to('.slide--7__icon.first', { opacity: 1, duration: 0.65, delay: 2.25, y: '0' });
        gsap.to('.slide--7__icon.second', { opacity: 1, duration: 0.65, delay: 2.75, y: '0' });
        gsap.to('.slide--7__icon.third', { opacity: 1, duration: 0.65, delay: 3.25, y: '0' });
        
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 4.25 * 1000);
      }
    })
  },
  8: () => {
    $('.arrow--prev').removeClass('arrow--white');
    $('.arrow--next').removeClass('arrow--white');
    
    $('.slide--8__decorator .circle').on('click', function() {
      $(this).addClass('active');

      gsap.to($(this).parent().find('.line'), { opacity: 1, duration: 0.5, delay: 0.75, scaleX: 1 });
       gsap.to('.slide--8__bottom-block', { opacity: 1, duration: 0.5, delay: 1.25 });
      animateNumber(1.75, '.slide--8__bottom-block p span')

      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, 4.5 * 1000);
    })
  },
  9: () => {
    $('.arrow--prev').addClass('arrow--white');
    $('.arrow--next').addClass('arrow--white');
    
    $('.slide--9__block .plus').on('click', function() {
      $(this).addClass('active');

      $(this).fadeOut(500, function() {
        $(this).parent().find('p').fadeIn(500);
      })

      if ($('.slide--9__block .plus.active').length === 3) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 1.5 * 1000);
      }
    })
  },
  10: () => {
    clearTimeout(lastSlideActionTimeout);
    gsap.fromTo('.slide--10__content h3',
      { scale: 0 },
      {
        scale: 1.2, duration: 0.65, delay: 1, ease: "power2.out",
        onComplete() {
          gsap.to('.slide--10__content h3', { scale: 1, delay: 0.05, duration: 0.25, ease: "power2.in" });
        }
      }
    );
    gsap.from('.slide--10__content h2', { opacity: 0, duration: 0.75, delay: 1.95, y: '25%' });
    gsap.from('.slide--10__content h4', { opacity: 0, duration: 0.75, delay: 2.45 });
    gsap.from('.slide--10__content p', { opacity: 0, duration: 0.75, delay: 2.95 });
    nextArrowDelay = 3.95;
  },
  11: () => {
    $('.slide--11__bottle').on('click', function() {
      $(this).addClass('active');

      gsap.to($(this).find('img'), { filter: 'blur(0em) grayscale(0) opacity(1)', duration: 0.75, delay: 0.5, ease: 'power2.out' });
      gsap.to($(this).find('.circle'), { opacity: 1, duration: 0.25, delay: 1.15, scale: 1 });
      gsap.to($(this).find('.vertical'), { opacity: 1, duration: 0.25, delay: 1.4, scaleY: 1 });
      gsap.to($(this).find('.horizontal'), { opacity: 1, duration: 0.25, delay: 1.65, scaleX: 1 });
      gsap.to($(this).find('p'), { opacity: 1, duration: 0.5, delay: 1.9 });

      if ($('.slide--11__bottle.active').length === 9) {
        nextButtonTimeout = setTimeout(() => {
          $(nextSlideButton).removeClass(hiddenArrowClass);
          $(prevSlideButton).removeClass(hiddenArrowClass);
        }, 2.5 * 1000);

        lastSlideActionTimeout = setTimeout(() => {
          lastSlideAction();
        }, 7.5 * 1000);
      }
    })
  },
}
// function that add animation for element
function animateSlide(slideNum = 1) {
  gsap.from('.slide', { opacity: 0, duration: 0.75 });

  slideActions[slideNum]();
}
// function that detect oriental of device
function updateRotateBlockVisibility() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;

  $(rotateBlock).toggleClass('visible', isPortrait);
}
// function that load slide without reloading page
async function loadComponent(componentPathName, slideNum) {
  const response = await fetch(componentPathName);
  const data = await response.text();

  slideContainer.innerHTML = data;
  animateSlide(slideNum);
}
// function that update info about prev/next button
function updateNavigationButtons(currentSlide) {
  clearTimeout(nextButtonTimeout);
  clearTimeout(prevButtonTimeout);

  $(nextSlideButton).addClass(hiddenArrowClass);
  $(prevSlideButton).addClass(hiddenArrowClass);

  switch (currentSlide) {
    case 0:
      break;
    case 1:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
      break;
    case 2:
    case 3:
    case 4:
    case 5:
    case 7:
    case 8:
    case 9:
    case 11:
      break;
    case totalSlideAmount:
      $(prevSlideButton).removeClass(hiddenArrowClass);
      break;
    default:
      nextButtonTimeout = setTimeout(() => {
        $(nextSlideButton).removeClass(hiddenArrowClass);
        $(prevSlideButton).removeClass(hiddenArrowClass);
      }, nextArrowDelay * 1000);
  }
}
// function that change slide on the screen
async function changeSlide(direction) {
  const currentSlideNum = slideContainer.getAttribute('data-current-slide');

  let newSlideNum;

  if (direction === 'next') {
    newSlideNum = Number(currentSlideNum) + 1;
  } else if (direction === 'prev') {
    newSlideNum = Number(currentSlideNum) - 1;
  }

  const { pathName } = pathNames.find(pathNameInfo => pathNameInfo.count === +newSlideNum);

  await loadComponent(pathName, newSlideNum);

  slideContainer.setAttribute('data-current-slide', newSlideNum);
  updateNavigationButtons(newSlideNum);
}

//window and document listeners
$(document).ready(function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('resize', function () {
  setResponsiveFontSize();
  updateRotateBlockVisibility();
});
$(window).on('orientationchange', function () {
  updateRotateBlockVisibility();
});

// button listeners
$(agreementButton).on('click', () => {
  loadComponent(pathNames[0].pathName);
  slideContainer.setAttribute('data-current-slide', 1);
  updateNavigationButtons(1);
});
$(nextSlideButton).on('click', () => {
  changeSlide('next')
})
$(prevSlideButton).on('click', () => {
  changeSlide('prev')
});
