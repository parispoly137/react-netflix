import { Outlet } from "react-router-dom";
import Header from "./Components/Header";

function Root() {
  return (
    <>
      <Header />
      {/* -> Home.tsx / Search.tsx / Tv.tsx */}
      <Outlet />
    </>
  );
}

export default Root;
