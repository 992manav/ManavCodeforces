import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Link, useParams } from "react-router-dom";
import "./css/submissions.css";
import Loading from "./loading";
const Submissions = () => {
  const { handle } = useParams();
  const Originalhandle = handle;
  const [submissions, setSubmissions] = useState([]);
  const [friendHandle, setFriendHandle] = useState("");
  const [friendSubmissions, setFriendSubmissions] = useState([]);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState([]);
  const [showUnattempted, setShowUnattempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.status?handle=${handle}`
        );
        const data = await response.json();

        if (data.status === "OK") {
          setSubmissions(data.result);
        } else {
          setError(`Error fetching user Submissions: ${data.comment}`);
        }
      } catch (error) {
        setError(`Error fetching submissions: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (handle) {
      fetchSubmissions();
    }
  }, [handle]);

  const handleFriendHandleChange = (e) => {
    setFriendHandle(e.target.value);
  };

  const fetchFriendSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://codeforces.com/api/user.status?handle=${friendHandle}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        setFriendSubmissions(data.result);
        findUnattemptedQuestions(data.result);
        setShowUnattempted(true);
      } else {
        setError(`Error fetching Friend's Submissions: ${data.comment}`);
      }
    } catch (error) {
      setError(`Error fetching Friend's Submissions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const findUnattemptedQuestions = (friendSubmissions) => {
    const friendProblemIds = new Set(
      friendSubmissions.map(
        (sub) => `${sub.problem.contestId}-${sub.problem.index}`
      )
    );
    const userProblemIds = new Set(
      submissions.map((sub) => `${sub.problem.contestId}-${sub.problem.index}`)
    );

    const unattemptedIds = Array.from(friendProblemIds).filter(
      (id) => !userProblemIds.has(id)
    );

    setUnattemptedQuestions(unattemptedIds);
  };

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <div className="submissions-container">
      <Link to={`/home/${Originalhandle}`} className="nav-link">
        Back to Home
      </Link>
      <br></br>
      <Link to={`/problemset`} className="nav-link">
        Go to Problemset
      </Link>
      <h1 className="submissions-title">Submissions</h1>
      <div
      // style={{
      //   textAlign: "center",
      //   backgroundColor: "blue",
      //   width: "fit-content",
      //   height: "150px",
      //   display: "flex",
      //   //   flexDirection: "column",
      //   justifyContent: "center",
      //   alignItems: "baseline",
      //   margin: "20px 35%",
      // }}
      >
        <div className="friend-input-container">
          <h1>Now Compare Questions With Your Friends</h1>
          <h2>And Get Questions that you haven't solved</h2>
          <input
            type="text"
            placeholder="Enter friend's Codeforces ID"
            value={friendHandle}
            onChange={handleFriendHandleChange}
          />
          <button onClick={fetchFriendSubmissions}>Get Questions</button>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <Paper elevation={3} className="submissions-details">
          {showUnattempted ? (
            <div>
              <h2>
                Questions your friend {friendHandle} has solved but you haven't:
              </h2>
              <ul className="unattempted-questions-list">
                {unattemptedQuestions.length > 0 ? (
                  unattemptedQuestions.map((id, index) => (
                    <li key={index}>
                      <a
                        href={`/api/${id.split("-")[0]}/${id.split("-")[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Problem ID: {id}
                      </a>
                    </li>
                  ))
                ) : (
                  <p>No unattempted questions found.</p>
                )}
              </ul>
            </div>
          ) : (
            submissions.length > 0 && (
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>Submission ID</th>
                    <th>Problem</th>
                    <th>Language</th>
                    <th>Status</th>
                    <th>Submission Time</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.id}</td>
                      <td>{submission.problem.name}</td>
                      <td>{submission.programmingLanguage}</td>
                      <td>{submission.verdict}</td>
                      <td>
                        {new Date(
                          submission.creationTimeSeconds * 1000
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Paper>
      )}
    </div>
  );
};

export default Submissions;
