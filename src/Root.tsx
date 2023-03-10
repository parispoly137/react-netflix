import { Outlet } from "react-router-dom";
import Header from "./Components/Header";

function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Root;
