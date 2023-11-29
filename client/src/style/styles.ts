import { CSSProperties } from "react";

export const container: CSSProperties = {
    minHeight: '100vh',
    margin: "auto",
    textAlign: "center",
    width: "100%",
    display:"grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 200px ))",
    gridAutoRows: "200px",
    columnGap: "2rem",
    rowGap: "2rem",
    padding: "2rem",
};
export const box: CSSProperties = {
    minHeight: '100vh',
    margin: "auto",
    width: "100%",
    padding: "2rem",
}