# React - Netflix

## Project Flow

---

1. Structuring

- 파일 및 폴더 구조

---

2. Routing Settings

- React Router ~ createBrowserRouter

---

3. Header Part

- 헤더, 로고, 메뉴(리스트), 검색 아이콘 배치

- 로고, 메뉴, 검색 아이콘에 애니메이션 적용

  ... framer-motion ~ variants, whileHover

  ... useMatch()

  ... useState() ~ 아이콘 클릭 여부

  ... useAnimationControls() ~ 애니메이션 직접 지정

  ... start() ~ 애니메이션 실행

  ... useScroll() ~ 스크롤 관련 정보 리턴

  ... scrollTo() ~ 특정 위치로 스크롤 이동 ~ + window

  ... variants, animate, initial, whileHover

  ... animation

  ... Link

  ... ternary operator

  ... layoutId

  ... transition, transform ~ keyframes, fillOpacity, repeat, duration, scaleX, x

---

4. Home Part

- API 호출

  ... tanstack/react-query
  ... QueryClient ~ setting
  ... useQuery()
  ... fetch() ~ promise chaining
