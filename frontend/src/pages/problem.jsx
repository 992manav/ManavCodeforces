import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";
import SelectVariants from "./languageSelector";
import InputComponent from "./input";
import OutputComponent from "./output";
import SaveButton from "./Savebutton";
import SubmitButton from "./SubmitButton";
import Question from "./Question";
import SplitPane from "react-split-pane";
import "./css/problem.css";
import { useParams } from "react-router-dom";
import AiHelperButton from "./AI";
const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
const helloWorldCode = {
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  python: `print("Hello, World!")`,
};

const Problem = () => {
  const { contest_id, index } = useParams();

  const [code, setCode] = useState(helloWorldCode.cpp);
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState();
  const [output, setOutput] = useState("Output");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(helloWorldCode[newLanguage]);
  };

  console.log(code);
  console.log(language);
  console.log(input);

  const languageCodeMap = {
    cpp: 54,
    python: 92,
    c: 50,
  };

  async function getSubmission(tokenId) {
    const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      console.log(result.stdout, result.status);
      return result;
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  const handleRunClick = () => {
    const url = "https://judge0-ce.p.rapidapi.com/submissions?fields=*";
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": rapidApiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageCodeMap[language],
        source_code: code,
        stdin: input,
      }),
    };

    async function callApi() {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`API response error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result);

        let tokenId = result.token;
        let statusCode = 2;
        setOutput("Ruko Thoda Sabar Karo");

        while (statusCode === 2 || statusCode === 1) {
          try {
            let result = await getSubmission(tokenId);
            statusCode = result.status_id;

            if (statusCode === 6) {
              setOutput(result.status.description);
            } else {
              console.log(atob(result.stdout));
              if (result.stdout == null) {
                setOutput("Galat hai");
              } else {
                setOutput(atob(result.stdout));
              }
            }
          } catch (submissionError) {
            console.error("Error fetching submission status:", submissionError);
            setError(
              "Bhaii Aaj ki limit khatam hogayi run karne ki  shaayad thodi der baad try karna Failed to fetch submission status. Please try again later."
            );

            break;
          }
        }
      } catch (apiError) {
        console.error("Error calling API:", apiError);
        // setError(
        //   "Bhaii Aaj ki limit khatam hogayi run karne ki ab sidha 24hours baad run kar paayega Failed to fetch submission status. Please try again later."
        // );
        alert(
          "Bhaii Aaj ki limit khatam hogayi run karne ki  shaayad thodi der baad try karna Failed to fetch submission status. Please try again later."
        );
        alert(
          "Bhaii iske liye tera code clipbard pe copy kiya hai aur jaa programiz pe bhej raha hun tujhe udhar run kara le"
        );
        const handleCopy = async (code) => {
          try {
            await navigator.clipboard.writeText(code);
            setMessage("Your code is copied to clipboard");
            setIsError(false);
          } catch (err) {
            setMessage("Failed to copy text: " + err.message);
            setIsError(true);
          }
        };
        handleCopy(code);
        window.open(
          `https://www.programiz.com/${language}-programming/online-compiler/`,
          "_blank"
        );
      }
    }

    callApi();
  };

  function download(text, filenam) {
    let element = document.createElement("a");

    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    );

    element.setAttribute("download", filenam);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function handleSaveclick(event) {
    let save_button = event.target;

    if (language === "python") {
      let filename = `code.py`;
      download(code, filename);
    } else {
      let filename = `code.${language}`;
      download(code, filename);
    }
  }

  const handleBeforeUnload = (event) => {
    event.preventDefault();

    const confirmationMessage =
      "Your code will be deleted. Click Cancel to save your code.";

    event.returnValue = confirmationMessage;

    const userChoice = window.confirm(confirmationMessage);

    if (userChoice) {
    } else {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <SplitPane split="vertical" minSize={200} defaultSize="50%">
      <div style={{ height: "100%", overflow: "auto", width: "130%" }}>
        <a href={`/api/${contest_id}/${index}`}>
          Click Here if Question is not Properly Loaded
        </a>
        <Question setInput={setInput} />
      </div>

      <div style={styles.editorContainer}>
        <div style={styles.toolbar}>
          <SelectVariants
            language={language}
            setLanguage={handleLanguageChange}
          />
          <div style={styles.buttonsContainer}>
            <SubmitButton code={code} contest_id={contest_id} />
            <SaveButton onClick={handleSaveclick} />

            {/* <AiHelperButton /> */}
          </div>
        </div>

        <div style={styles.editorWrapper}>
          {message && (
            <div
              style={{
                color: isError ? "red" : "green",
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {message}
            </div>
          )}

          <Editor
            width="99%"
            language={language}
            value={code}
            onChange={handleEditorChange}
            theme="vs-dark"
          />
        </div>
        <hr />
        <button style={styles.runButton} onClick={handleRunClick}>
          Run
        </button>
        <InputComponent input={input} setInput={setInput} />

        <hr />
        <OutputComponent output={output} />
      </div>
    </SplitPane>
  );
};

const styles = {
  editorContainer: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    backgroundColor: "#f5f5f5",
    height: "100vh",
    backgroundColor: "#121212",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: "10px",
  },
  buttonsContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start",
  },
  editorWrapper: {
    // flexGrow: 1,
    minHeight: "400px",
  },
  runButton: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: "10px",
    width: "99%",
  },
};

export default Problem;
