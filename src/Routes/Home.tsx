import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// props로 배경 이미지의 url을 받아온다. 타입 지정.
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto}); // 배경 색상 gradient 설정
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

export default function Home() {
  // useQuery로 api 데이터와 로딩여부를 받는다. key 설정 및 fetch 함수 연결
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "now_playing"],
    getMovies
  );

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
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}
