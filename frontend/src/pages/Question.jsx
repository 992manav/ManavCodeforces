import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./css/question.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import SubmitButton from "./SubmitButton";
import AiHelperButton from "./AI";
const Question = ({ setInput }) => {
  // const { contest_id, index } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(`/api/question`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuestion(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const headerElement = document.querySelector(
        ".problem-statement .header"
      );
      headerElement.style.backgroundColor = "yellow";
      headerElement.style.borderRadius = "10px";

      const propertytitles = document.querySelectorAll(".property-title");
      for (let propertytitle of propertytitles) {
        let htmlpropertytitle = propertytitle.innerHTML;
        propertytitle.innerHTML = htmlpropertytitle + " -";
        propertytitle.style.color = "red";
      }

      let inputfile = document.querySelector(".input-file");
      inputfile.style.display = "none";

      let outputfile = document.querySelector(".output-file");
      outputfile.style.display = "none";

      let inputs = document.querySelectorAll(".input");
      for (let input of inputs) {
        input.style.backgroundColor = "black";
        input.style.color = "white";
        input.style.padding = "10px";
        input.style.borderRadius = "10px";
        input.style.marginBottom = "10px";
      }

      let copys = document.querySelectorAll(".input-output-copier");
      for (let copyButton of copys) {
        copyButton.style.cursor = "pointer";
        copyButton.addEventListener("click", (event) => {
          console.log("Copied!");
          // console.log(event.target);
          let clickedButton = event.target;
          // clickedButton.style.cursor = "pointer";

          let titleContainer = clickedButton.parentElement;
          // console.log(titleContainer);

          let inputContainer = titleContainer.parentElement;
          // console.log(inputContainer);
          // console.log(inputContainer.innerText);

          let copyText = inputContainer.innerText;
          let cleanedText = copyText.slice(11);
          console.log(cleanedText);
          setInput(cleanedText);
          navigator.clipboard
            .writeText(cleanedText)
            .then(() => {
              console.log("Text copied to clipboard");
              setMessage("Input is copied to clipboard");
              setIsError(false);
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
              setMessage("Failed to copy text: " + err.message);
              setIsError(true);
            });
        });
      }

      let outputs = document.querySelectorAll(".output");
      for (let output of outputs) {
        output.style.backgroundColor = "black";
        output.style.color = "white";
        output.style.padding = "10px";
        output.style.borderRadius = "10px";
        output.style.marginBottom = "10px";
      }
      // input.style.display = "none";

      let brElements = document.querySelectorAll(".input pre br");
      brElements.forEach((br) => {
        const hr = document.createElement("hr");
        br.parentNode.replaceChild(hr, br);
      });

      let brrElements = document.querySelectorAll(".output pre br");
      brrElements.forEach((br) => {
        const hr = document.createElement("hr");
        br.parentNode.replaceChild(hr, br);
      });
    }, 3000);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }

  // useEffect(() => {
  //   // if (question) {
  //   const headerElement = document.querySelector(".problem-statement .header");
  //   console.log(headerElement); // This will log null if the element is not found

  //   // if (headerElement) {
  //   // Perform operations on the header element
  //   headerElement.style.backgroundColor = "yellow";
  //   // } else {
  //   console.log("Header element not found!");
  //   // }
  // }, [question]);

  function handleyoutube() {
    let heading = document.querySelector(".header .title");
    let questioname = heading.innerText;
    console.log(questioname);

    let youtubeSearchURL = `https://www.youtube.com/results?search_query=${questioname}+codeforces`;

    window.open(youtubeSearchURL, "_blank");
  }

  return (
    <div className="question-container">
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "20px",
        }}
      >
        <button onClick={toggleDarkMode} style={{ padding: "5px" }}>
          Toggle Dark Mode
        </button>

        <button
          onClick={handleyoutube}
          style={{ backgroundColor: "aqua", padding: "5px" }}
        >
          Get Video Solution
        </button>

        <AiHelperButton
          questionData={question.problemStatement}
          // style={{ padding: "3px" }}
        />
      </div>

      {/* <h1>Problem Statement</h1> */}
      <div
        className="problem-statement"
        dangerouslySetInnerHTML={{
          __html:
            question?.problemStatement || "No problem statement available",
        }}
      />

      {/* <div
        className="sampletests"
        dangerouslySetInnerHTML={{
          __html: question?.sampletests || "No problem statement available",
        }}
      /> */}
      {/* 
      <h2>Examples</h2>
      <ul className="examples-list">
        {question?.examples && question.examples.length > 0 ? (
          question.examples.map((example, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: example }}></li>
          ))
        ) : (
          <li>No examples available</li>
        )}
      </ul> */}
    </div>
  );
};

export default Question;
