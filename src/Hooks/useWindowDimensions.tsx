import { useEffect, useState } from "react";

function getWindowDimensions() {
  // 현재 창의 너비 리턴
  const { innerWidth: width } = window;

  return width;
}

export default function useWindowDimensions() {
  // 창 크기 관련 state
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    // 현재 창 너비를 계속 state 업데이트
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    // window 의 resize 이벤트 listening
    window.addEventListener("resize", handleResize);

    // 언마운트 때 리스너 해제
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}
