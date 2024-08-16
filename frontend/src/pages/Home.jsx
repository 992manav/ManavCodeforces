import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import "./css/home.css";

function Home() {
  const { codeforcesId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log(codeforcesId);
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `https://codeforces.com/api/user.info?handles=${codeforcesId}`
        );
        const data = await response.json();

        if (data.status === "OK" && data.result.length > 0) {
          setProfile(data.result[0]);
          // console.log(data);
          // console.log(codeforcesId);
        } else {
          console.error("Error fetching user profile:", data.comment);
          setError("Error fetching user profile: " + data.comment);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Error fetching user profile: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [codeforcesId]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }
  return (
    <div className="profile-container">
      <video autoPlay muted loop className="background-video">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <nav className="nav-bar">
        {profile && (
          <>
            <Link to={`/submissions/${codeforcesId}`} className="nav-link">
              View Submissions
            </Link>
            <br />
            <br />
            <Link to="/problemset" className="nav-link">
              Click Here - Go To Problem Set - {profile.handle}
            </Link>
          </>
        )}
      </nav>
      <div className="profile-content">
        {profile ? (
          <div className="profile-details-wrapper">
            <div className="profile-header">
              <Avatar
                alt="avatar"
                src={profile.avatar}
                sx={{ width: 120, height: 120 }}
                className="profile-avatar"
              />
              <h1 className="profile-username">Welcome, {profile.handle}</h1>
            </div>
            <Paper elevation={3} className="profile-details">
              <table className="profile-table">
                <tbody>
                  <tr>
                    <td className="profile-label">
                      <strong>Handle:</strong>
                    </td>
                    <td>{profile.handle}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Rating:</strong>
                    </td>
                    <td>{profile.rating}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Max Rating:</strong>
                    </td>
                    <td>{profile.maxRating}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Rank:</strong>
                    </td>
                    <td>{profile.rank}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Max Rank:</strong>
                    </td>
                    <td>{profile.maxRank}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Contribution:</strong>
                    </td>
                    <td>{profile.contribution}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Friend Count:</strong>
                    </td>
                    <td>{profile.friendOfCount}</td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Last Online:</strong>
                    </td>
                    <td>
                      {new Date(
                        profile.lastOnlineTimeSeconds * 1000
                      ).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="profile-label">
                      <strong>Registration Time:</strong>
                    </td>
                    <td>
                      {new Date(
                        profile.registrationTimeSeconds * 1000
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Paper>
          </div>
        ) : (
          <p className="no-profile">No profile data available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
