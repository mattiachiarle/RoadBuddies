import { useEffect, useState } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("DESCRIPTION.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <>
      <ReactMarkdown children={content} />
    </>
  );
}

export default App;
