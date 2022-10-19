import { FC } from "react";
import "./NumberInput.css";
import Minus from "assets/svgs/minus.svg";
import Plus from "assets/svgs/plus.svg";

type Props = {
  onChange: (value: number) => void;
  value: number;
  min?: number;
  max?: number;
};

export const NumberInput: FC<Props> = ({ onChange, value, min, max }) => {
  return (
    <div className="number-input">
      <button
        className="icon-button"
        onClick={() => {
          if (min === undefined || value > min) {
            onChange(value - 1);
          }
        }}
      >
        <img src={Minus} />
      </button>

      <input
        className="number-input-box"
        value={value}
        type="number"
        onWheelCapture={(e) => {
          e.currentTarget.blur();
        }}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (
            (min === undefined || value >= min) &&
            (max === undefined || value <= max)
          ) {
            onChange(value);
          }
        }}
      />

      <button
        className="icon-button"
        onClick={() => {
          if (max === undefined || value < max) {
            onChange(value + 1);
          }
        }}
      >
        <img src={Plus} />
      </button>
    </div>
  );
};
