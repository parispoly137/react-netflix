import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import { useMatch, useNavigate } from "react-router-dom";

// styled-components
const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// props로 배경 이미지의 url을 받아온다. 타입 지정.
const Banner = styled.div<{ photo: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.photo}); // 배경 색상 gradient 설정
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ photo: string }>`
  background-color: white;
  height: 200px;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center center;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }

  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  margin: auto; // 화면 중앙 배치
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
// variants

const boxVariants = {
  normal: {
    scale: 1,
  },
  // Row의 movie에 마우스를 올렸을 경우 나오는 효과
  hover: {
    scale: 1.3, // 크기 커짐
    y: -80, // 위로 상승
    transition: {
      delay: 0.5, // 0.5초 이후에 진행
      duration: 0.3, // 0.3초 동안 진행
      type: "tween", // tween type
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1, // 안 보이다가 마우스 올리면 보임
    // box 와 동일한 hover 효과
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};
// variables
const offset = 6; // Row당 movie 의 개수

const NEXFLIX_LOGO_URL =
  "https://assets.brand.microsites.netflix.io/assets/2800a67c-4252-11ec-a9ce-066b49664af6_cm_800w.jpg?v=4"; // 대체 이미지

// Component
export default function Home() {
  // useQuery로 api 데이터와 로딩여부를 받는다. key 설정 및 fetch 함수 연결
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "now_playing"],
    getMovies
  );
  const [index, setIndex] = useState(0); // slider 를 위한 index state
  const [leaving, setLeaving] = useState(false); // slide가 완료된 이후에 다음 slide가 진행될 수 있도록 state 정의
  const width = useWindowDimensions(); // 스크린 너비 조정 hooks
  const navigate = useNavigate(); // url 이동 관련 hooks
  const bigMovieMatch = useMatch("/movies/:movieId"); // url이 일치하면 정보 리턴

  // index를 1씩 증가시켜주는 함수
  const increaseIndex = () => {
    // 데이터가 있는 경우
    if (data) {
      // 아직 slide 중이면 return
      if (leaving) return;

      toggleLeaving(); // leaving 토글
      const totalMovies = data.results.length - 1; // 전체 영화 수에서 -1 (배너)
      const maxIndex = Math.floor(totalMovies / offset) - 1; // offset으로 전체 수를 나눈 뒤 1 뺌. index 처리
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1)); // 마지막 페이지에서는 초기화, 아니면 1씩 증가
    }
  };

  // leaving 토글 함수
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (movieId: number) => navigate(`/movies/${movieId}`); // 해당 url로 이동

  const onOverlayClick = () => navigate("/"); // BigMovie 바깥쪽 클릭 시 홈으로 이동

  // movie를 클릭했을 때, 데이터에서 movie에 대한 정보를 확인하고 있으면 정보 할당
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);

  return (
    <Wrapper>
      {/* 로딩 중이면 Loader를, 로딩이 끝나면 내용을 보여준다. */}
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        // Fragment
        <>
          {/* data의 첫 번째 데이터만 보여준다.  */}
          {/* fallback 으로 빈 string을 넣어준다. */}
          <Banner
            onClick={increaseIndex}
            photo={makeImagePath(
              data?.results[0].backdrop_path || NEXFLIX_LOGO_URL
            )}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          {/* 이미지 슬라이더 컴포넌트 */}
          <Slider>
            {/* 컴포넌트가 rendering / unmount 될 때 애니메이션 실행 가능 */}
            {/* initial: 초기에는 애니메이션 적용 x */}
            {/* onExitComplete: 애니메이션 끝난 뒤에 실행 x */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                // gap을 고려하여 시작과 끝의 Row 위치 선정 ~ 애니메이션
                initial={{ x: width + 5 }}
                animate={{ x: 0 }}
                exit={{ x: -width - 5 }}
                transition={{ type: "tween", duration: 1 }}
                key={index} // index로 인해 컴포넌트가 슬라이더처럼 보여짐
              >
                {/* 첫 번째 영화를 제외한 나머지 영화들을 6개씩 디스플레이 */}
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * (index + 1))
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover='hover'
                      initial='normal'
                      variants={boxVariants} // variants 연결
                      transition={{ type: "tween" }} // transition 타입 지정
                      // 이미지 생성 함수에 format 을 추가
                      onClick={() => onBoxClicked(movie.id)} // 클릭하면 해당 box의 url로 이동
                      photo={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      {/* variants 연결. box의 variant 효과 상속*/}
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {/* box 클릭 시, url 매치 여부에 따라 BigMovie 디스플레이 */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                {/* BigMovie의 외부 */}
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMatch.params.movieId + ""} // url의 params 활용. string 형 변환
                >
                  {/* 클릭한 movie 정보가 있으면 렌더링 */}
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
