import React, { useState, useEffect } from "react";
import "./css/problemset.css";
import Loading from "./loading";

const Problemset = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingInput, setRatingInput] = useState("");
  const [contestIdInput, setContestIdInput] = useState(""); 
  const [questionIndexInput, setQuestionIndexInput] = useState(""); 

  const problemsPerPage = 10;
  const minRating = 800;

  useEffect(() => {
    fetch("/api/problems")
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.filter((problem) => problem.rating >= minRating);
        setProblems(filtered);
        setFilteredProblems(filtered.slice(0, problemsPerPage));
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleNext = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * problemsPerPage;
    const endIndex = startIndex + problemsPerPage;
    setFilteredProblems(problems.slice(startIndex, endIndex));
    setCurrentPage(nextPage);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = problems.filter(
      (problem) =>
        problem.name.toLowerCase().includes(query) ||
        `${problem.contestId}`.includes(query) ||
        `${problem.index}`.toLowerCase().includes(query)
    );

    setFilteredProblems(filtered.slice(0, problemsPerPage));
    setCurrentPage(0); 
  };

  const handleRatingInputChange = (e) => {
    setRatingInput(e.target.value);
  };

  const handleContestIdInputChange = (e) => {
    setContestIdInput(e.target.value);
  };

  const handleQuestionIndexInputChange = (e) => {
    setQuestionIndexInput(e.target.value);
  };

  const getRandomQuestion = () => {
    const maxRating = parseInt(ratingInput, 10);
    if (isNaN(maxRating)) return;

    const filteredByRating = problems.filter(
      (problem) => problem.rating <= maxRating
    );

    if (filteredByRating.length > 0) {
      const randomProblem =
        filteredByRating[Math.floor(Math.random() * filteredByRating.length)];
      setFilteredProblems([randomProblem]);
      setCurrentPage(0); 
    } else {
      alert("No problems found with the given rating.");
    }
  };

  const handleSearchByContestIdAndIndex = () => {
    let SearchURL = `/api/${contestIdInput}/${questionIndexInput}`;

    window.open(SearchURL, "_blank");
  };

  if (loading) return <Loading />;
  if (error) return <div>Error fetching problems: {error.message}</div>;

  return (
    <div className="problems">
      <h1>Codeforces Problems</h1>
      <input
        type="text"
        placeholder="Search Question by Name / (Contest-ID or Q-Index)"
        value={searchQuery}
        onChange={handleSearch}
        className="search-bar"
        style={{
          marginBottom: "20px",
          padding: "10px",
          border: "3px solid black",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "600px",
          boxSizing: "border-box",
          fontSize: "17px",
          color: "black",
          outline: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            textAlign: "center",
            margin: "10px",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "10px",
            fontSize: "17px",
            color: "white",
            width: "20%",
            backgroundColor: "orange",
            boxShadow: "0 5px 20px black",
          }}
        >
          <h3>Enter Max Rating </h3>
          <input
            type="number"
            placeholder="Enter maximum rating"
            value={ratingInput}
            onChange={handleRatingInputChange}
            className="rating-input"
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "3px solid black",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "250px",
              boxSizing: "border-box",
              fontSize: "17px",
              color: "black",
              outline: "none",
            }}
          />
          <button
            onClick={getRandomQuestion}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "green",
              color: "white",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            Get Random Question by Rating
          </button>
        </div>

        <div
          style={{
            textAlign: "center",
            margin: "10px",
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "10px",
            fontSize: "17px",
            color: "white",
            width: "20%",
            backgroundColor: "#333",
            boxShadow: "0 5px 20px black",
          }}
        >
          <h3>Search New Contest Question by Contest ID & Index</h3>
          <input
            type="text"
            placeholder="Enter Contest ID"
            value={contestIdInput}
            onChange={handleContestIdInputChange}
            className="contest-id-input"
            style={{
              marginTop: "20px",
              padding: "10px",
              border: "3px solid black",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "250px",
              boxSizing: "border-box",
              fontSize: "17px",
              color: "black",
              outline: "none",
            }}
          />
          <input
            type="text"
            placeholder="Enter Question Index"
            value={questionIndexInput}
            onChange={handleQuestionIndexInputChange}
            className="question-index-input"
            style={{
              marginTop: "10px",
              padding: "10px",
              border: "3px solid black",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "250px",
              boxSizing: "border-box",
              fontSize: "17px",
              color: "black",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearchByContestIdAndIndex}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#2196f3",
              color: "white",
              fontSize: "17px",
              cursor: "pointer",
            }}
          >
            Get Question Which is not Present here
          </button>
        </div>
      </div>
      <table className="problem-table">
        <thead>
          <tr>
            <th>Contest ID</th>
            <th>Index</th>
            <th>Name</th>
            <th>Rating</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((problem) => (
            <tr key={`${problem.contestId}-${problem.index}`}>
              <td>
                <a
                  href={`http://localhost:5173/api/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.contestId || "N/A"}
                </a>
              </td>
              <td>
                <a
                  href={`http://localhost:5173/api/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.index || "N/A"}
                </a>
              </td>
              <td>
                <a
                  href={`http://localhost:5173/api/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.name || "N/A"}
                </a>
              </td>
              <td>
                <a
                  href={`http://localhost:5173/api/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.rating || "N/A"}
                </a>
              </td>
              <td>
                <a
                  href={`http://localhost:5173/api/${problem.contestId}/${problem.index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.tags ? problem.tags.join(", ") : "N/A"}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredProblems.length > 0 && (
        <button
          onClick={handleNext}
          disabled={(currentPage + 1) * problemsPerPage >= problems.length}
        >
          Get New Random Questions
        </button>
      )}
    </div>
  );
};

export default Problemset;
