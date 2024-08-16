import React, { useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
import HelpIcon from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";

const formatResponse = (text) => {
  const formattedText = text.replace(/\*([^*]+)\*/g, (match, p1) => {
    return `${p1}<hr>`;
  });

  return { __html: formattedText };
};

const AiHelperButton = ({ questionData }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  console.log("Gemini API Key:", geminiApiKey);
  const apiKey = geminiApiKey;
  console.log(apiKey);
  const handleaiclick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Summarize this question in a simplified way in simple english and don't give me any code and explain me one easy test case that is not explained in question: ${questionData}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const explanation =
        data.candidates[0].content.parts[0].text || "No explanation available";
      setResponse(explanation);
      setShowResponse(true);
    } catch (error) {
      setError(error.message);
      setShowResponse(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowResponse(false);
    setResponse(null);
    setError(null);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<HelpIcon />}
        onClick={handleaiclick}
        sx={{
          position: "relative",
          borderRadius: "10px",
          padding: 2,
          boxShadow: 3,
          backgroundColor: "#00bcd4",
          color: "black",
        }}
      >
        Question ko Samjho
      </Button>
      {loading && (
        <CircularProgress
          sx={{
            display: "block",
            margin: "20px auto",
            color: "#00bcd4",
          }}
        />
      )}
      {showResponse && response && (
        <Card
          sx={{
            padding: 2,
            backgroundColor: "#e3f2fd",
            borderRadius: 2,
            boxShadow: 3,
            margin: 2,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "black",
            }}
          >
            <CloseIcon />
          </IconButton>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              Explanation
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              component="div"
              dangerouslySetInnerHTML={formatResponse(response)}
              sx={{
                whiteSpace: "pre-line",
                fontSize: "16px",
                color: "black",
              }}
            />
          </CardContent>
        </Card>
      )}
      {showResponse && error && (
        <Card
          sx={{
            marginTop: 2,
            padding: 2,
            backgroundColor: "#fdd",
            borderRadius: 2,
            boxShadow: 3,
            position: "relative",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "black",
              // padding: "2px !important",
            }}
          >
            <CloseIcon />
          </IconButton>
          <CardContent>
            <Typography variant="h6" component="div" color="error">
              Error
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AiHelperButton;
