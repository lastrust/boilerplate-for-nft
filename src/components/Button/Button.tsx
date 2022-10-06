import { Loading } from "components/Loading/Loading";
import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import "./Button.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "outline" | "solid";
  isLoading?: boolean;
};

const variants = {
  solid: "solid",
  outline: "outline",
};

export const Button: FC<Props> = ({
  children,
  variant = "solid",
  isLoading,
  ...props
}) => {
  return (
    <button
      className={`button ${variants[variant]}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loading color={variant === "solid" ? "white" : "black"} />
      ) : (
        children
      )}
    </button>
  );
};
