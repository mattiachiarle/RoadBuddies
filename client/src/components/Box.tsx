import { CSSProperties, ReactNode } from "react";
import { box } from "../style/styles";

interface BoxProps {
  children: ReactNode;
  style?: CSSProperties;
}

const Box = ({ children, style }: BoxProps) => {

  const responsiveBoxStyle: CSSProperties = {
    ...box,
  };

  return (
    <div style={{ ...responsiveBoxStyle, ...style }}>
      {children}
    </div>
  );
}

export default Box;