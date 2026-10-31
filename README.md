# Radio 88.1 Portfolio

반응형 개인 포트폴리오 웹사이트입니다. 정적 미리보기는 `index.html`을 브라우저에서 열면 됩니다. Streamlit Community Cloud용 `streamlit_app.py`도 포함되어 있습니다.

## 구성

- `index.html` — 화면 구조와 연락 폼
- `styles.css` — 반응형 레이아웃과 라디오 다이얼 스타일
- `script.js` — 주파수/메뉴 이동, 작품 카드 생성, 메일 앱 연결
- `streamlit_app.py` — Streamlit 페이지 진입 파일
- `requirements.txt` — Streamlit 의존성

## 공개 전 바꿀 내용

1. `index.html`의 소개 문구와 `script.js`의 작품 제목을 본인 정보로 교체하세요.
2. `index.html`에서 전화번호 안내 문구와 `tel:` 링크를 실제 번호로 바꾸세요.
3. `script.js` 마지막 부분의 `hello@example.com`을 받을 이메일 주소로 바꾸세요.
4. 작품 카드의 샘플 그래픽을 실제 작업 이미지로 교체하세요.

작품은 각 페이지에 10개씩 준비되어 있습니다. 데스크톱에서는 5열 × 2행, 좁은 화면에서는 열 수가 줄어듭니다. 마우스 휠을 위아래로 굴려 이전/다음 페이지로 이동할 수 있습니다. 다이얼을 마우스나 터치로 원을 그리듯 드래그하면 드래그 중에도 주파수와 메뉴가 실시간으로 바뀝니다. 키보드 화살표로도 조작할 수 있습니다.

## Streamlit Community Cloud 배포

1. 이 폴더의 파일을 GitHub 저장소에 올립니다.
2. Streamlit Community Cloud에서 **Create app**을 선택합니다.
3. 저장소와 브랜치를 고르고 진입 파일로 `streamlit_app.py`를 선택해 배포합니다.
4. 만들어진 `*.streamlit.app` 주소를 폰에서 열면 됩니다.

Streamlit Community Cloud는 GitHub 저장소에서 앱을 가져와 배포합니다. 공개 포트폴리오로 게시하기 전에 저장소와 앱의 공개 범위를 확인하세요.
