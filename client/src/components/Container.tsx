import { CSSProperties, ReactNode } from "react";
import { useMediaQuery } from 'react-responsive';
import { container } from "../style/styles";

interface ContainerProps {
  children: ReactNode;
  style?: CSSProperties;
}

const Container = ({ children, style }: ContainerProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const responsiveContainerStyle: CSSProperties = {
    ...container,
    gridTemplateColumns: isMobile ? "1fr" : container.gridTemplateColumns,
  };

  return (
    <div style={{ ...responsiveContainerStyle, ...style }}>
      {children}
    </div>
  );
}

export default Container;