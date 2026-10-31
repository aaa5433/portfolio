const destinations = [
  { id: 'about', station: 88.1 },
  { id: 'edit', station: 91.3 },
  { id: 'webapp', station: 96.7 },
  { id: 'contact', station: 101.9 }
];
const titles = {
  editorial: ['틈의 기록','느린 계절','도시 산책자','작은 수집','오늘의 문장','사이의 풍경','온기','여백의 미학','새로운 장면','봄의 목록'],
  digital: ['Morrow — 습관 기록','Local Table — 로컬 지도','Pace — 러닝 앱','Onda — 웰니스','모아 — 금융 서비스','Serein — 스킨케어','Tide — 여행 가이드','Cultivate — 식물 관리','Daily Form — 저널','Room 02 — 공간 예약']
};
document.querySelectorAll('.work-grid').forEach(grid => {
  const set = grid.dataset.set;
  titles[set].forEach((title, i) => {
    const card = document.createElement('article');
    card.className = 'work-card';
    const art = document.createElement('div'); art.className = `work-art ${set}`;
    if (set === 'editorial') art.innerHTML = `<div class="cover"><i>FIELD NOTES　/　${String(i+1).padStart(2,'0')}</i><b>${['틈','느린\n계절','산책','수집','문장'][i%5]}</b><i>SEOUL · 2025</i></div>`;
    else art.innerHTML = '<div class="phone-mock"><i></i><i></i><i></i></div>';
    const h = document.createElement('h3'); h.className = 'work-title'; h.textContent = title;
    const type = document.createElement('div'); type.className = 'work-type'; type.textContent = set === 'editorial' ? `EDITORIAL · ${String(i+1).padStart(2,'0')}` : `DIGITAL · ${String(i+1).padStart(2,'0')}`;
    card.append(art,h,type); grid.append(card);
  });
});
const dial = document.getElementById('dial');
const frequency = document.getElementById('frequency');
const panels = [...document.querySelectorAll('.panel')];
const menuLinks = [...document.querySelectorAll('[data-destination]')];
const pageIndex = document.getElementById('page-index');
const minAngle = -135, maxAngle = 135;
let current = 0, dragging = false, moved = false, startPointerAngle = 0, previousPointerAngle = 0, startAngle = minAngle;
function show(index, updateHash = true) {
  current = Math.max(0, Math.min(destinations.length - 1, index));
  const item = destinations[current];
  panels.forEach(p => p.classList.toggle('active', p.id === item.id));
  menuLinks.forEach(link => link.classList.toggle('selected', link.dataset.destination === item.id));
  frequency.textContent = item.station.toFixed(1);
  pageIndex.textContent = `${String(current+1).padStart(2,'0')} / 04`;
  dial.style.transform = `rotate(${minAngle + (current/(destinations.length-1))*(maxAngle-minAngle)}deg)`;
  dial.setAttribute('aria-valuenow', item.station.toFixed(1));
  if (updateHash) history.replaceState(null, '', `#${item.id}`);
}
function updateFromAngle(angle) {
  const bounded = Math.max(minAngle, Math.min(maxAngle, angle));
  const normalized = (bounded - minAngle)/(maxAngle-minAngle);
  const index = Math.round(normalized * (destinations.length - 1));
  current = index;
  panels.forEach(p => p.classList.toggle('active', p.id === destinations[index].id));
  menuLinks.forEach(link => link.classList.toggle('selected', link.dataset.destination === destinations[index].id));
  frequency.textContent = (88.1 + normalized * (101.9 - 88.1)).toFixed(1);
  pageIndex.textContent = `${String(index+1).padStart(2,'0')} / 04`;
  dial.style.transform = `rotate(${bounded}deg)`;
  dial.setAttribute('aria-valuenow', frequency.textContent);
  history.replaceState(null, '', `#${destinations[index].id}`);
}
function pointerAngle(event) {
  const rect = dial.getBoundingClientRect();
  return Math.atan2(event.clientY - (rect.top + rect.height/2), event.clientX - (rect.left + rect.width/2)) * 180/Math.PI;
}
function angleDelta(next, previous) {
  return ((next - previous + 540) % 360) - 180;
}
document.querySelector('.dial-shell').addEventListener('pointerdown', e => {
  dragging = true; moved = false; startPointerAngle = previousPointerAngle = pointerAngle(e); startAngle = minAngle + (current/(destinations.length-1))*(maxAngle-minAngle);
  e.currentTarget.setPointerCapture(e.pointerId);
});
document.querySelector('.dial-shell').addEventListener('pointermove', e => {
  if (!dragging) return;
  const nextPointerAngle = pointerAngle(e);
  if (Math.abs(angleDelta(nextPointerAngle, startPointerAngle)) > 3) moved = true;
  previousPointerAngle = nextPointerAngle;
  if (moved) updateFromAngle(startAngle + angleDelta(nextPointerAngle, startPointerAngle));
});
document.querySelector('.dial-shell').addEventListener('pointerup', () => { dragging = false; });
document.querySelector('.dial-shell').addEventListener('pointercancel', () => { dragging = false; });
dial.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); show(current+1); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); show(current-1); }
});
menuLinks.forEach(link => link.addEventListener('click', e => { e.preventDefault(); show(destinations.findIndex(d => d.id === link.dataset.destination)); }));
window.addEventListener('keydown', e => { if (e.key === 'ArrowDown' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) show(current+1); if (e.key === 'ArrowUp' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) show(current-1); });
let wheelLocked = false;
window.addEventListener('wheel', e => {
  if (['INPUT','TEXTAREA'].includes(e.target.tagName) || wheelLocked || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
  e.preventDefault();
  show(current + (e.deltaY > 0 ? 1 : -1));
  wheelLocked = true;
  window.setTimeout(() => { wheelLocked = false; }, 420);
}, { passive: false });
const initial = destinations.findIndex(d => `#${d.id}` === location.hash); show(initial < 0 ? 0 : initial, false);
document.getElementById('contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const subject = encodeURIComponent(`포트폴리오 문의 — ${data.get('name')}`);
  const body = encodeURIComponent(`보낸 사람: ${data.get('name')} (${data.get('email')})\n\n${data.get('message')}`);
  // Replace this address with the portfolio owner's email before publishing.
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
  document.getElementById('form-note').textContent = '기본 메일 앱을 열었습니다. 공개 전 hello@example.com을 본인 주소로 바꿔주세요.';
});
