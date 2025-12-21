$(function () {
  /* =================================================
    ハンバーガーメニュー
    =================================================== */
  $('.hamburger').on('click', function() {
    $('header').toggleClass('open');
  });

  $('#mask, .header-menu a').on('click', function() {
    $('header').removeClass('open');
  });

  /* =================================================
    スムーススクロール
    =================================================== */
  $('a[href^="#"]').click(function () {
    let href = $(this).attr("href");
    if (href === "#" || href === "") return;
    let target = $(href);
    if (target.length) {
      let position = target.offset().top;
      $("html, body").animate({ scrollTop: position }, 600, "swing");
    }
    return false;
  });

  /* =================================================
    Slick（スライダー）
    =================================================== */
  if ($('.slide-items').length) {
    $('.slide-items').slick({
      centerMode: true,
      centerPadding: '0px',
      slidesToShow: 3,
      arrows: true,
      autoplay: true,
      autoplaySpeed: 4000,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            dots: true,
            centerMode: true,
            arrows: false
          }
        }
      ]
    });
  }

  /* =================================================
    トップに戻るボタン
    =================================================== */
  let pagetop = $("#to-top");
  if (pagetop.length) {
    pagetop.hide();
    $(window).scroll(function () {
      if ($(this).scrollTop() > 700) {
        pagetop.fadeIn();
      } else {
        pagetop.fadeOut();
      }
    });
    pagetop.click(function () {
      $("body,html").animate({ scrollTop: 0 }, 500);
      return false;
    });
  }

  /* =================================================
    ニュースページ（VIEW MORE）
    =================================================== */
  $('.news-btn').on('click', function (e) {
    e.preventDefault();
    $('.news-page dl dt:hidden, .news-page dl dd:hidden').fadeIn(600);
    $(this).fadeOut(300);
    return false;
  });
});

/* =================================================
  Intersection Observer（スクロールアニメーション）
  =================================================== */
// 犬のゆれ
const swayTargets = document.querySelectorAll('.js-sway');
if (swayTargets.length > 0) {
  const swayObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sway-once');
        swayObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  swayTargets.forEach(target => swayObserver.observe(target));
}

// 1. 【スマホ限定】VIEW MOREボタンの足跡
const pawTriggers = document.querySelectorAll('.js-paw-trigger');
if (pawTriggers.length > 0) {
  const pawObserver = new IntersectionObserver((entries) => {
    if (window.innerWidth >= 768) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      } else {
        entry.target.classList.remove('is-active');
      }
    });
  }, { threshold: 0.5 });
  pawTriggers.forEach(trigger => pawObserver.observe(trigger));
}

// 2. 【全共通】足跡の波 (js-pawwave-trigger)
const pawWaveTriggers = document.querySelectorAll('.js-pawwave-trigger');
if (pawWaveTriggers.length > 0) {
  const waveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      } else {
        entry.target.classList.remove('is-active');
      }
    });
  }, { threshold: 0.2 });
  pawWaveTriggers.forEach(trigger => waveObserver.observe(trigger));
}

/* =================================================
  モーダル制御（ワンちゃん用：矢印付き）
  =================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const dogModal = document.getElementById('dog-modal');
  
  if (dogModal) {
    const modalBody = document.getElementById('modal-body');
    const closeBtn = dogModal.querySelector('.modal-close');
    const prevBtn = dogModal.querySelector('.modal-arrow.prev');
    const nextBtn = dogModal.querySelector('.modal-arrow.next');

    let currentCards = [];
    let currentIndex = 0;

    const updateModalContent = (index) => {
      currentCards = Array.from(document.querySelectorAll('.dog-card'));
      const card = currentCards[index];
      if (!card) return;

      const name = card.dataset.name || "";
      const char = card.dataset.char || "";
      const time = card.dataset.time || "";
      const desc = card.dataset.desc || "";
      const modalImg = card.dataset.modalImg || card.querySelector('img').src;

      modalBody.innerHTML = `
        <img src="${modalImg}" alt="${name}">
        <div class="modal-text">
          <h3>${name}</h3>
          <p><strong>性格：</strong>${char}</p>
          <p><strong>出勤時間：</strong>${time}</p>
          <div class="dog-description">${desc}</div>
        </div>
      `;
      currentIndex = index;
    };

    // カードクリックで開く
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.dog-card');
      if (card) {
        currentCards = Array.from(document.querySelectorAll('.dog-card'));
        const index = currentCards.indexOf(card);
        updateModalContent(index);
        dogModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });

    // 矢印ボタンの制御
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let nextIndex = (currentIndex + 1) % currentCards.length;
        updateModalContent(nextIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let prevIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
        updateModalContent(prevIndex);
      });
    }

    const closeDogModal = () => {
      dogModal.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDogModal);
    dogModal.addEventListener('click', (e) => {
      if (e.target === dogModal) closeDogModal();
    });
  }

  /* -------------------------------------------------
    ニュースモーダル用
    ------------------------------------------------- */
  const newsModal = document.getElementById('news-modal');
  if (newsModal) {
    const newsTitle = document.getElementById('news-modal-title');
    const newsBody = document.getElementById('news-modal-body');
    const newsImg = document.getElementById('news-modal-img');
    const closeBtn = newsModal.querySelector('.modal-close');

    document.addEventListener('click', (e) => {
      const item = e.target.closest('.js-news-item');
      if (item) {
        newsTitle.textContent = item.dataset.title || "";
        newsBody.textContent = item.dataset.body || "";
        if (item.dataset.img) {
          newsImg.src = item.dataset.img;
          newsImg.style.display = 'block';
        } else {
          newsImg.style.display = 'none';
        }
        newsModal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      }
    });

    const closeNewsModal = () => {
      newsModal.classList.remove('is-active');
      document.body.style.overflow = '';
    };
    if (closeBtn) closeBtn.addEventListener('click', closeNewsModal);
    newsModal.addEventListener('click', (e) => {
      if (e.target === newsModal) closeNewsModal();
    });
  }
});