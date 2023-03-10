const API_KEY = "27df4d6a25cf0432fde7a1c946aa2b6c";
const BASE_URL = "https://api.themoviedb.org/3";

// IGetMoviesResult ~ results 의 타입 선언
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

// getMovies(now playing) 의 타입 선언
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// api 호출 ~ now playing
export const getMovies = () =>
  fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US`).then(
    (res) => res.json()
  );
