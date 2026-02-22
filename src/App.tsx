import { useRef, useState } from "react";
import style from "./App.module.css";

function flatten(text: string) {
  return text.replace(/\r?\n+/g, " ").replace(/[ \t]{2,}/g, " ").trim();
}

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text");
    if (!pasted.trim()) {
      return;
    }

    const out = flatten(pasted);

    if (!out) {
      return;
    }

    setOutput(out);
    setInput("");

    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const copyOutput = async () => {
    if (!output) {
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
    } catch {
    }
  };

  return (
    <div className={style.container}>
      <h1>Flatten dictionary paste</h1>
      <p>
        Paste text with line breaks — get one line instantly.
      </p>

      <div className={style.inputsContainer}>
        <div className={style.inputContainer}>
          <div>
            <strong>Input</strong>
          </div>

          <textarea
            ref={inputRef}
            className={style.noScrollbars}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPaste={handlePaste}
            placeholder="Paste here..."
            rows={16}
          />

          <div className={style.buttonsContainer}>
            <button
              className={style.button}
              onClick={() => {
                setInput("");
                requestAnimationFrame(() => inputRef.current?.focus());
              }}
              disabled={!input}
            >
              Clear input
            </button>
          </div>
        </div>

        <div className={style.inputContainer}>
          <strong>Output</strong>
          <textarea
            className={style.noScrollbars}
            value={output}
            readOnly
            rows={16}
            placeholder="Result appears here..."
          />

          <div className={style.buttonsContainer}>
            <button onClick={copyOutput} disabled={!output} className={style.button}>
              Copy output
            </button>
            <button
              onClick={() => {
                setOutput("");
              }}
              disabled={!output}
              className={style.button}
            >
              Clear output
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}