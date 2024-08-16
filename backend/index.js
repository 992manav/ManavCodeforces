const express = require("express");
const path = require("path");
const app = express();
// const fetch = require("node-fetch");
const { Builder, By } = require("selenium-webdriver");
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));
const Problem = require("./models/problems.js");
require("dotenv").config();
const mongodbUri =
  "mongodb+srv://dmanavpianist:VpJHcGupzscTfhnk@cluster0.ms2sy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongodbUri);
}

function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

// async function getUserProfile(handles) {
//   try {
//     const url = new URL("https://codeforces.com/api/user.info");
//     url.searchParams.append("handles", handles);

//     const response = await fetch(url.toString());
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     console.log(data);

//     if (data.status === "OK") {
//       return data.result;
//     } else {
//       throw new Error("Error fetching user profile");
//     }
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     return null;
//   }
// }

// app.post("/login", async (req, res) => {
//   console.log("Received login request");
//   const codeforcesId = req.body.codeforcesId;

//   try {
//     const profile = await getUserProfile(codeforcesId);
//     console.log("User Profile:", profile);

//     res.json({ success: true, profile });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, error: "Failed to fetch user profile" });
//   }
// });

app.get(
  "/problems",
  wrapAsync(async (req, res) => {
    try {
      const problems = await Problem.find().sort({ rating: 1 }); // Sorting by rating in ascending order
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Error fetching problems" });
    }
  })
);

let question = {};
app.get(
  "/:contest_id/:index",
  wrapAsync(async (req, res) => {
    console.log(req.params);
    let { contest_id, index } = req.params;

    async function getProblemDetails() {
      let driver = await new Builder().forBrowser("chrome").build();

      try {
        await driver.get(
          `https://codeforces.com/problemset/problem/${contest_id}/${index}`
        );

        const { until } = require("selenium-webdriver");
        await driver.wait(until.elementLocated(By.css("pre")), 10000);

        const problemStatement = await driver
          .findElement(By.css(".problem-statement"))
          .getAttribute("innerHTML");

        const sampletests = await driver
          .findElement(By.css(".sample-tests"))
          .getAttribute("innerHTML");
        // console.log("Problem Statement:", problemStatement);

        // const header = await driver
        //   .findElement(By.css(".header"))
        //   .getAttribute("innerHTML");
        // console.log("Header:", header);

        // const textspan = await driver
        //   .findElement(By.css(".text-span"))
        //   .getAttribute("innerHTML");
        // console.log("text-span:", textspan);

        // Extract and log input format as raw HTML

        // const inputFormat = await driver.findElements(
        //   By.css(".test-example-line")
        // );

        // console.log("Input Format:", inputFormat);

        // Extract and log output format as raw HTML
        // const outputFormat = await driver
        //   .findElement(By.css(".output"))
        //   .getAttribute("innerText");
        // console.log("Output Format:", outputFormat);

        // Extract and log example inputs and outputs as raw HTML
        const examples = await driver.findElements(By.css(".example"));
        let exampleTexts = [];
        for (let i = 0; i < examples.length; i++) {
          let exampleText = await examples[i].getAttribute("innerHTML");
          exampleTexts.push(exampleText);
          console.log(`Example ${i + 1}:`, exampleText);
        }

        question = {
          problemStatement,
          // texts,
          // outputFormat,
          // sampletests,
          examples: exampleTexts,
          // header,
          // textspan,
        };
        return question;
      } finally {
        await driver.quit();
      }
    }

    await getProblemDetails();
    res.redirect(`/question/${contest_id}/${index}`);
  })
);

app.get(
  "/question",
  wrapAsync((req, res) => {
    res.json(question);
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Error handling middleware
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    error: {
      message: "Something went wrong on our end. Please try again later.",
      details: err.message,
      support: "For more assistance, contact MANAV",
    },
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
