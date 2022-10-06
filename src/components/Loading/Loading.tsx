import { FC } from "react";
import "./Loading.css";

type Props = {
  color?: "black" | "white";
};

export const Loading: FC<Props> = ({ color = "black" }) => {
  return (
    <div className="lds-ripple" data-color={color}>
      <div></div>
      <div></div>
    </div>
  );
};
