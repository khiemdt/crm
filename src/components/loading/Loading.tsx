import { FC } from "react";
import { useAppSelector } from "~/utils/hook/redux";

import "./Loading.scss";

const Loading = () => {
  const isLoading = useAppSelector((state) => state.systemReducer.isLoading);
  return (
    <div
      className={`loading-wrapper ${
        isLoading ? "ld-show" : "ld-hide"
      } ${"ld-dim-light"}`}
    >
      <div className="middle-sreen">
        <div className="loader" />
      </div>
    </div>
  );
};

export default Loading;
