
// ========================================
// 1. 메뉴 및 주파수 설정
// ========================================

const destinations = [
  { id: 'about', station: 88.1 },
  { id: 'edit', station: 91.3 },
  { id: 'webapp', station: 96.7 },
  { id: 'contact', station: 101.9 }
];

const titles = {
  editorial: [
    '인천공항 브로슈어',
    '영창피아노',
    '나의 라임 오렌지 나무 책 표지',
    '그린컴퓨터아트학원',
    '명함',
    '패키지디자인',
    'VOGUE',
    '아라동 주민센터',
  ],
  digital: [
    '메모',
    '맵',
    '러닝',
    '금융'
  ]
};

// 각 작품 폴더의 이미지 개수
const editorialImageCounts = [3, 2, 1, 2, 2, 2, 4, 2, 0, 0];
const digitalImageCounts = [3, 3, 3, 3];


// ========================================
// 2. 이미지 경로 생성
// ========================================

function makeImageSets(folder, imageCounts) {
  return imageCounts.map((count, projectIndex) => {
    const paths = [];

    for (let i = 1; i <= count; i++) {
      const folderNumber = String(projectIndex + 1).padStart(2, '0');
      const fileNumber = String(i).padStart(2, '0');

      paths.push(`img/${folder}/${folderNumber}/${fileNumber}.jpg`);
    }

    return paths;
  });
}

const imageSets = {
  editorial: makeImageSets('editorial', editorialImageCounts),
  digital: makeImageSets('digital', digitalImageCounts)
};


// ========================================
// 3. 썸네일 및 대체 이미지
// ========================================

function makeFallback(set, index) {
  if (set === 'digital') {
    const phone = document.createElement('div');
    phone.className = 'phone-mock';
    phone.innerHTML = '<i></i><i></i><i></i>';
    return phone;
  }

  const coverTitles = [
    '인천공항',
    '영창피아노',
    '나의 라임 오렌지 나무 책 표지',
    '그린컴퓨터아트학원',
    '명함',
    '패키지디자인',
    'VOGUE',
    '아라동 주민센터',
    '여백',
    '장면'
  ];

  const cover = document.createElement('div');
  cover.className = 'cover';

  const top = document.createElement('i');
  top.textContent = `FIELD NOTES / ${String(index + 1).padStart(2, '0')}`;

  const title = document.createElement('b');
  title.textContent = coverTitles[index] || 'DESIGN';

  const bottom = document.createElement('i');
  bottom.textContent = 'SEOUL · 2025';

  cover.append(top, title, bottom);
  return cover;
}

function setThumbnail(art, imagePath, altText, fallback) {
  if (!imagePath) {
    art.replaceChildren(fallback);
    return;
  }

  const thumbnail = document.createElement('img');
  thumbnail.className = 'work-thumb';
  thumbnail.alt = altText;

  thumbnail.onerror = () => {
    art.replaceChildren(fallback);
  };

  thumbnail.src = imagePath;
  art.replaceChildren(thumbnail);
}


// ========================================
// 4. 작품 카드 생성
// ========================================

document.querySelectorAll('.work-grid').forEach(grid => {
  const set = grid.dataset.set;

  titles[set].forEach((title, index) => {
    const card = document.createElement('article');
    card.className = 'work-card';

    card.dataset.workSet = set;
    card.dataset.workIndex = index;

    const art = document.createElement('div');
    art.className = `work-art ${set}`;

    const fallback = makeFallback(set, index);
    const firstImage = imageSets[set][index]?.[0];

    setThumbnail(
      art,
      firstImage,
      `${title} 미리보기`,
      fallback
    );

    const heading = document.createElement('h3');
    heading.className = 'work-title';
    heading.textContent = title;

    const type = document.createElement('div');
    type.className = 'work-type';

    type.textContent =
      `${set === 'editorial' ? 'EDITORIAL' : 'DIGITAL'} · ${String(index + 1).padStart(2, '0')}`;

    card.append(art, heading, type);

    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `작품 크게 보기: ${title}`);

    card.addEventListener('click', () => openWork(card));

    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openWork(card);
      }
    });

    grid.append(card);
  });
});


// ========================================
// 5. 전체 작품 갤러리 팝업
// ========================================

const workModal = document.getElementById('work-modal');
const modalImage = document.getElementById('modal-image');
const modalFallback = document.getElementById('modal-fallback');
const modalTitle = document.getElementById('modal-title');

let lastFocusedCard = null;

// 현재 갤러리 종류
let activeSet = 'editorial';

// 전체 이미지 목록
let galleryImages = [];

// 현재 보고 있는 이미지 번호
let galleryIndex = 0;

// 현재 작품 번호
let activeProjectIndex = 0;


// 작품 클릭 시 갤러리 열기
function openWork(card) {
  lastFocusedCard = card;

  activeSet = card.dataset.workSet;
  activeProjectIndex = Number(card.dataset.workIndex);

  // 해당 카테고리 전체 이미지를 하나로 합침
  galleryImages = imageSets[activeSet].flat();

  // 클릭한 작품의 첫 이미지 위치 계산
  galleryIndex = imageSets[activeSet]
    .slice(0, activeProjectIndex)
    .reduce((total, images) => total + images.length, 0);

  // 이미지가 없는 작품이면 가까운 첫 이미지 또는 대체 화면 표시
  if (galleryImages.length === 0) {
    modalTitle.textContent = titles[activeSet][activeProjectIndex];
    
  }
  

  workModal.hidden = false;
  workModal.setAttribute('aria-hidden', 'false');

  document.body.classList.add('modal-open');

  showGalleryImage();

  workModal.focus();
}


// 현재 이미지가 속한 작품 찾기
function findProjectIndex(imageIndex) {
  let count = 0;

  for (let i = 0; i < imageSets[activeSet].length; i++) {
    count += imageSets[activeSet][i].length;

    if (imageIndex < count) {
      return i;
    }
  }

  return 0;
}


// 이미지 표시
function showGalleryImage() {
  if (galleryImages.length === 0) return;

  const path = galleryImages[galleryIndex];

  activeProjectIndex = findProjectIndex(galleryIndex);

  modalTitle.textContent = titles[activeSet][activeProjectIndex];

  modalImage.onload = () => {
    modalImage.hidden = false;
  };

  modalImage.onerror = () => {
    modalImage.hidden = true;
  };

  modalImage.src = path;

  workModal.querySelector('.modal-prev').disabled =
    galleryIndex === 0;

  workModal.querySelector('.modal-next').disabled =
    galleryIndex === galleryImages.length - 1;
}


// 이전 이미지
function previousImage() {
  if (galleryIndex <= 0) return;

  galleryIndex--;
  showGalleryImage();
}


// 다음 이미지
function nextImage() {
  if (galleryIndex >= galleryImages.length - 1) return;

  galleryIndex++;
  showGalleryImage();
}


// 팝업 닫기
function closeWork() {
  if (workModal.hidden) return;

  workModal.hidden = true;
  workModal.setAttribute('aria-hidden', 'true');

  document.body.classList.remove('modal-open');

  modalImage.removeAttribute('src');
  modalImage.hidden = true;

  modalFallback.replaceChildren();
  modalFallback.hidden = true;

  galleryImages = [];

  lastFocusedCard?.focus();
}


// 팝업 버튼 이벤트
workModal.querySelectorAll('[data-close-modal]').forEach(button => {
  button.addEventListener('click', closeWork);
});

workModal.querySelector('.modal-prev').addEventListener('click', previousImage);
workModal.querySelector('.modal-next').addEventListener('click', nextImage);


// ========================================
// 6. 팝업 키보드 및 모바일 스와이프
// ========================================

window.addEventListener('keydown', event => {
  if (workModal.hidden) return;

  if (event.key === 'Escape') closeWork();
  if (event.key === 'ArrowLeft') previousImage();
  if (event.key === 'ArrowRight') nextImage();
});

let modalSwipeStart = null;

workModal.addEventListener('touchstart', event => {
  if (workModal.hidden || event.target.closest('button')) return;

  const touch = event.touches[0];

  if (touch) {
    modalSwipeStart = {
      x: touch.clientX,
      y: touch.clientY
    };
  }
}, { passive: true });

workModal.addEventListener('touchend', event => {
  if (!modalSwipeStart) return;

  const touch = event.changedTouches[0];

  if (!touch) {
    modalSwipeStart = null;
    return;
  }

  const deltaX = touch.clientX - modalSwipeStart.x;
  const deltaY = touch.clientY - modalSwipeStart.y;

  modalSwipeStart = null;

  if (
    Math.abs(deltaX) < 45 ||
    Math.abs(deltaX) < Math.abs(deltaY) * 1.15
  ) return;

  if (deltaX < 0) nextImage();
  else previousImage();

}, { passive: true });

workModal.addEventListener('touchcancel', () => {
  modalSwipeStart = null;
}, { passive: true });


// ========================================
// 7. 주파수 다이얼과 메뉴 연결
// ========================================

const dial = document.getElementById('dial');
const dialShell = document.querySelector('.dial-shell');
const frequency = document.getElementById('frequency');
const panels = [...document.querySelectorAll('.panel')];
const menuLinks = [...document.querySelectorAll('[data-destination]')];
const pageIndex = document.getElementById('page-index');

const minAngle = -135;
const maxAngle = 135;

let current = 0;
let dragging = false;
let moved = false;
let startPointerAngle = 0;
let startAngle = minAngle;


function show(index, updateHash = true) {
  current = Math.max(0, Math.min(destinations.length - 1, index));

  const item = destinations[current];

  panels.forEach(panel => {
    panel.classList.toggle('active', panel.id === item.id);
  });

  menuLinks.forEach(link => {
    link.classList.toggle(
      'selected',
      link.dataset.destination === item.id
    );
  });

  frequency.textContent = item.station.toFixed(1);

  pageIndex.textContent =
    `${String(current + 1).padStart(2, '0')} / 04`;

  const angle =
    minAngle +
    (current / (destinations.length - 1)) *
    (maxAngle - minAngle);

  dial.style.transform = `rotate(${angle}deg)`;

  dial.setAttribute('aria-valuenow', item.station.toFixed(1));

  if (updateHash) {
    history.replaceState(null, '', `#${item.id}`);
  }
}


function updateFromAngle(angle) {
  const bounded = Math.max(minAngle, Math.min(maxAngle, angle));

  const normalized =
    (bounded - minAngle) / (maxAngle - minAngle);

  const index = Math.round(
    normalized * (destinations.length - 1)
  );

  current = index;

  panels.forEach(panel => {
    panel.classList.toggle(
      'active',
      panel.id === destinations[index].id
    );
  });

  menuLinks.forEach(link => {
    link.classList.toggle(
      'selected',
      link.dataset.destination === destinations[index].id
    );
  });

  frequency.textContent =
    (88.1 + normalized * (101.9 - 88.1)).toFixed(1);

  pageIndex.textContent =
    `${String(index + 1).padStart(2, '0')} / 04`;

  dial.style.transform = `rotate(${bounded}deg)`;

  dial.setAttribute('aria-valuenow', frequency.textContent);

  history.replaceState(null, '', `#${destinations[index].id}`);
}


function pointerAngle(event) {
  const rect = dial.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  return Math.atan2(
    event.clientY - centerY,
    event.clientX - centerX
  ) * 180 / Math.PI;
}


function angleDelta(next, previous) {
  return ((next - previous + 540) % 360) - 180;
}


// 다이얼 드래그
dialShell.addEventListener('pointerdown', event => {
  dragging = true;
  moved = false;

  startPointerAngle = pointerAngle(event);

  startAngle =
    minAngle +
    (current / (destinations.length - 1)) *
    (maxAngle - minAngle);

  dialShell.setPointerCapture(event.pointerId);
});


dialShell.addEventListener('pointermove', event => {
  if (!dragging) return;

  const nextPointerAngle = pointerAngle(event);

  if (
    Math.abs(angleDelta(nextPointerAngle, startPointerAngle)) > 3
  ) {
    moved = true;
  }

  if (moved) {
    updateFromAngle(
      startAngle +
      angleDelta(nextPointerAngle, startPointerAngle)
    );
  }
});


dialShell.addEventListener('pointerup', () => {
  dragging = false;
});

dialShell.addEventListener('pointercancel', () => {
  dragging = false;
});


// 키보드 다이얼 조작
dial.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault();
    show(current + 1);
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault();
    show(current - 1);
  }
});


// 메뉴 클릭
menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();

    const index = destinations.findIndex(
      item => item.id === link.dataset.destination
    );

    show(index);
  });
});


// 키보드 메뉴 이동
window.addEventListener('keydown', event => {
  if (!workModal.hidden) return;

  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    return;
  }

  if (event.key === 'ArrowDown') show(current + 1);
  if (event.key === 'ArrowUp') show(current - 1);
});


// ========================================
// 8. 마우스 휠 메뉴 이동
// ========================================

let wheelLocked = false;

window.addEventListener('wheel', event => {
  if (
    !event.target.closest('.canvas') ||
    ['INPUT', 'TEXTAREA'].includes(event.target.tagName) ||
    wheelLocked ||
    Math.abs(event.deltaY) < Math.abs(event.deltaX)
  ) return;

  event.preventDefault();

  show(current + (event.deltaY > 0 ? 1 : -1));

  wheelLocked = true;

  window.setTimeout(() => {
    wheelLocked = false;
  }, 420);

}, { passive: false });


// ========================================
// 9. 모바일 좌우 스와이프 메뉴 이동
// ========================================

let swipeStart = null;
let touchSwipeLocked = false;

document.addEventListener('touchstart', event => {
  const touch = event.touches[0];

  const isControl = event.target.closest(
    'a, button, input, textarea, select'
  );

  if (
    !touch ||
    !event.target.closest('.canvas') ||
    isControl ||
    !workModal.hidden
  ) return;

  swipeStart = {
    x: touch.clientX,
    y: touch.clientY
  };

}, { passive: true });


document.addEventListener('touchend', event => {
  if (!swipeStart || touchSwipeLocked) return;

  const touch = event.changedTouches[0];

  if (!touch) {
    swipeStart = null;
    return;
  }

  const deltaX = touch.clientX - swipeStart.x;
  const deltaY = touch.clientY - swipeStart.y;

  swipeStart = null;

  if (
    Math.abs(deltaX) < 55 ||
    Math.abs(deltaX) < Math.abs(deltaY) * 1.15
  ) return;

  show(current + (deltaX < 0 ? 1 : -1));

  touchSwipeLocked = true;

  window.setTimeout(() => {
    touchSwipeLocked = false;
  }, 420);

}, { passive: true });


document.addEventListener('touchcancel', () => {
  swipeStart = null;
}, { passive: true });


// ========================================
// 10. 처음 화면 설정
// ========================================

const initialIndex = destinations.findIndex(
  item => `#${item.id}` === location.hash
);

show(initialIndex < 0 ? 0 : initialIndex, false);


// ========================================
// 11. Contact 이메일 폼
// ========================================

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();

  const data = new FormData(event.currentTarget);

  const subject = encodeURIComponent(
    `포트폴리오 문의 — ${data.get('name')}`
  );

  const body = encodeURIComponent(
    `보낸 사람: ${data.get('name')} (${data.get('email')})\n\n${data.get('message')}`
  );

  window.location.href =
    `mailto:hello@example.com?subject=${subject}&body=${body}`;

  document.getElementById('form-note').textContent =
    '기본 메일 앱을 열었습니다. 공개 전 hello@example.com을 본인 주소로 바꿔주세요.';
});
