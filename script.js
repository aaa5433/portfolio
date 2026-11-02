// 주파수별로 보여줄 메뉴와 주파수 값을 정합니다.
const destinations = [
  { id: 'about', station: 88.1 },
  { id: 'edit', station: 91.3 },
  { id: 'webapp', station: 96.7 },
  { id: 'contact', station: 101.9 }
];

const titles = {
  editorial: [
    '틈의 기록', '느린 계절', '도시 산책자', '작은 수집', '오늘의 문장',
    '사이의 풍경', '온기', '여백의 미학', '새로운 장면', '봄의 목록'
  ],
  digital: [
    'Morrow — 습관 기록', 'Local Table — 로컬 지도', 'Pace — 러닝 앱',
    'Onda — 웰니스', '모아 — 금융 서비스', 'Serein — 스킨케어',
    'Tide — 여행 가이드', 'Cultivate — 식물 관리',
    'Daily Form — 저널', 'Room 02 — 공간 예약'
  ]
};
const editorialLabels = [
  '틈', '느린 계절', '도시 산책자', '작은 수집', '오늘의 문장',
  '사이의 풍경', '온기', '여백의 미학', '새로운 장면', '봄의 목록'
];
// 작품별 이미지 경로입니다. 각 배열 안의 순서대로 좌우 넘김이 동작합니다.
const editorialImageSets = [
  ['img/editorial/01/01.jpg', 'img/editorial/01/02.jpg', 'img/editorial/01/03.jpg'], // 틈의 기록
  ['img/editorial/02/01.jpg', 'img/editorial/02/02.jpg'], // 느린 계절
  ['img/editorial/03/01.jpg'], // 도시 산책자
  ['img/editorial/04/01.jpg'], // 작은 수집
  ['img/editorial/05/01.jpg'], // 오늘의 문장
  ['img/editorial/06/01.jpg'], // 사이의 풍경
  ['img/editorial/07/01.jpg'], // 온기
  ['img/editorial/08/01.jpg'], // 여백의 미학
  ['img/editorial/09/01.jpg'], // 새로운 장면
  ['img/editorial/10/01.jpg']  // 봄의 목록
];

// 작품 목록을 HTML에 넣습니다.
document.querySelectorAll('.work-grid').forEach(grid => {
  const set = grid.dataset.set;

  titles[set].forEach((title, index) => {
    const card = document.createElement('article');
    card.className = 'work-card';

    const art = document.createElement('div');
    art.className = `work-art ${set}`;

    if (set === 'editorial') {
      card.dataset.workIndex = index;
      const coverTitle = ['틈', '느린\n계절', '산책', '수집', '문장'][index % 5];
      art.innerHTML = `
        <div class="cover">
          <i>FIELD NOTES　/　${String(index + 1).padStart(2, '0')}</i>
          <b>${coverTitle}</b>
          <i>SEOUL · 2025</i>
        </div>
      `;
    } else {
      art.innerHTML = '<div class="phone-mock"><i></i><i></i><i></i></div>';
    }

    const heading = document.createElement('h3');
    heading.className = 'work-title';
    heading.textContent = title;

    const type = document.createElement('div');
    type.className = 'work-type';
    type.textContent = set === 'editorial'
      ? `EDITORIAL · ${String(index + 1).padStart(2, '0')}`
      : `DIGITAL · ${String(index + 1).padStart(2, '0')}`;

    card.append(art, heading, type);

    // 편집 작품은 클릭하거나 Enter/Space를 눌러 크게 볼 수 있습니다.
    if (set === 'editorial') {
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
    }

    grid.append(card);
  });
});

// 작품 팝업을 열고 닫습니다.
const workModal = document.getElementById('work-modal');
const modalImage = document.getElementById('modal-image');
const modalFallback = document.getElementById('modal-fallback');
const modalTitle = document.getElementById('modal-title');
let lastFocusedCard = null;
let activeProjectIndex = 0;
let activeImageIndex = 0;

function openWork(card) {
  lastFocusedCard = card;
  activeProjectIndex = Number(card.dataset.workIndex);
  modalTitle.textContent = editorialLabels[activeProjectIndex];
  workModal.hidden = false;
  workModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  showWorkImage(0);
  workModal.focus();
}

function showWorkImage(index) {
  const imageSet = editorialImageSets[activeProjectIndex];
  activeImageIndex = Math.max(0, Math.min(imageSet.length - 1, index));
  const cards = document.querySelectorAll('.work-grid[data-set="editorial"] .work-card');
  const path = imageSet[activeImageIndex];

  modalImage.hidden = true;
  modalFallback.hidden = false;
  modalFallback.replaceChildren(cards[activeProjectIndex].querySelector('.work-art').cloneNode(true));
  modalImage.alt = `${titles.editorial[activeProjectIndex]} ${activeImageIndex + 1}`;
  modalImage.onload = () => {
    if (modalImage.getAttribute('src') !== path) return;
    modalImage.hidden = false;
    modalFallback.hidden = true;
  };
  modalImage.onerror = () => {
    if (modalImage.getAttribute('src') !== path) return;
    modalImage.hidden = true;
    modalFallback.hidden = false;
  };
  modalImage.src = path;
  workModal.querySelector('.modal-prev').disabled = activeImageIndex === 0;
  workModal.querySelector('.modal-next').disabled = activeImageIndex === imageSet.length - 1;
}

function closeWork() {
  if (workModal.hidden) return;

  workModal.hidden = true;
  workModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalImage.removeAttribute('src');
  modalImage.hidden = true;
  modalFallback.replaceChildren();
  modalFallback.hidden = true;
  lastFocusedCard?.focus();
}

workModal.querySelectorAll('[data-close-modal]').forEach(button => {
  button.addEventListener('click', closeWork);
});
workModal.querySelector('.modal-prev').addEventListener('click', () => showWorkImage(activeImageIndex - 1));
workModal.querySelector('.modal-next').addEventListener('click', () => showWorkImage(activeImageIndex + 1));

let modalSwipeStart = null;
workModal.addEventListener('touchstart', event => {
  if (workModal.hidden || event.target.closest('button')) return;
  const touch = event.touches[0];
  if (touch) modalSwipeStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });

workModal.addEventListener('touchend', event => {
  if (!modalSwipeStart) return;
  const touch = event.changedTouches[0];
  if (!touch) { modalSwipeStart = null; return; }

  const deltaX = touch.clientX - modalSwipeStart.x;
  const deltaY = touch.clientY - modalSwipeStart.y;
  modalSwipeStart = null;

  if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;
  showWorkImage(activeImageIndex + (deltaX < 0 ? 1 : -1));
}, { passive: true });

workModal.addEventListener('touchcancel', () => { modalSwipeStart = null; }, { passive: true });

window.addEventListener('keydown', event => {
  if (workModal.hidden) return;
  if (event.key === 'Escape') closeWork();
  if (event.key === 'ArrowLeft') showWorkImage(activeImageIndex - 1);
  if (event.key === 'ArrowRight') showWorkImage(activeImageIndex + 1);
});

// 주파수 다이얼과 메뉴 연결
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
    link.classList.toggle('selected', link.dataset.destination === item.id);
  });

  frequency.textContent = item.station.toFixed(1);
  pageIndex.textContent = `${String(current + 1).padStart(2, '0')} / 04`;

  const angle = minAngle + (current / (destinations.length - 1)) * (maxAngle - minAngle);
  dial.style.transform = `rotate(${angle}deg)`;
  dial.setAttribute('aria-valuenow', item.station.toFixed(1));

  if (updateHash) history.replaceState(null, '', `#${item.id}`);
}

function updateFromAngle(angle) {
  const bounded = Math.max(minAngle, Math.min(maxAngle, angle));
  const normalized = (bounded - minAngle) / (maxAngle - minAngle);
  const index = Math.round(normalized * (destinations.length - 1));
  current = index;

  panels.forEach(panel => {
    panel.classList.toggle('active', panel.id === destinations[index].id);
  });
  menuLinks.forEach(link => {
    link.classList.toggle('selected', link.dataset.destination === destinations[index].id);
  });

  frequency.textContent = (88.1 + normalized * (101.9 - 88.1)).toFixed(1);
  pageIndex.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
  dial.style.transform = `rotate(${bounded}deg)`;
  dial.setAttribute('aria-valuenow', frequency.textContent);
  history.replaceState(null, '', `#${destinations[index].id}`);
}

function pointerAngle(event) {
  const rect = dial.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  return Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI;
}

function angleDelta(next, previous) {
  return ((next - previous + 540) % 360) - 180;
}

dialShell.addEventListener('pointerdown', event => {
  dragging = true;
  moved = false;
  startPointerAngle = pointerAngle(event);
  startAngle = minAngle + (current / (destinations.length - 1)) * (maxAngle - minAngle);
  dialShell.setPointerCapture(event.pointerId);
});

dialShell.addEventListener('pointermove', event => {
  if (!dragging) return;

  const nextPointerAngle = pointerAngle(event);
  if (Math.abs(angleDelta(nextPointerAngle, startPointerAngle)) > 3) moved = true;
  if (moved) updateFromAngle(startAngle + angleDelta(nextPointerAngle, startPointerAngle));
});

dialShell.addEventListener('pointerup', () => { dragging = false; });
dialShell.addEventListener('pointercancel', () => { dragging = false; });

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

menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const index = destinations.findIndex(item => item.id === link.dataset.destination);
    show(index);
  });
});

window.addEventListener('keydown', event => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  if (event.key === 'ArrowDown') show(current + 1);
  if (event.key === 'ArrowUp') show(current - 1);
});

// 데스크톱 마우스 휠로 이전/다음 메뉴 이동
let wheelLocked = false;
window.addEventListener('wheel', event => {
  if (['INPUT', 'TEXTAREA'].includes(event.target.tagName) || wheelLocked || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

  event.preventDefault();
  show(current + (event.deltaY > 0 ? 1 : -1));
  wheelLocked = true;
  window.setTimeout(() => { wheelLocked = false; }, 420);
}, { passive: false });

// 스마트폰에서 좌우 스와이프로 이전/다음 메뉴 이동
let swipeStart = null;
let touchSwipeLocked = false;

document.addEventListener('touchstart', event => {
  const touch = event.touches[0];
  const isControl = event.target.closest('a, button, input, textarea, select');
  if (!touch || !event.target.closest('.canvas') || isControl) return;
  swipeStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });

document.addEventListener('touchend', event => {
  if (!swipeStart || touchSwipeLocked) return;
  const touch = event.changedTouches[0];
  if (!touch) { swipeStart = null; return; }

  const deltaX = touch.clientX - swipeStart.x;
  const deltaY = touch.clientY - swipeStart.y;
  swipeStart = null;

  if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;
  show(current + (deltaX < 0 ? 1 : -1));
  touchSwipeLocked = true;
  window.setTimeout(() => { touchSwipeLocked = false; }, 420);
}, { passive: true });

document.addEventListener('touchcancel', () => { swipeStart = null; }, { passive: true });

const initialIndex = destinations.findIndex(item => `#${item.id}` === location.hash);
show(initialIndex < 0 ? 0 : initialIndex, false);

// Contact 폼은 기본 메일 앱을 엽니다.
document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`포트폴리오 문의 — ${data.get('name')}`);
  const body = encodeURIComponent(`보낸 사람: ${data.get('name')} (${data.get('email')})\n\n${data.get('message')}`);
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
  document.getElementById('form-note').textContent = '기본 메일 앱을 열었습니다. 공개 전 hello@example.com을 본인 주소로 바꿔주세요.';
});
