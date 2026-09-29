const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(`public`));

app.get(`/`, (req, res) => {
  res.sendFile(__dirname + `/signup.html`);
});

app.post(`/`, async (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = `https://us9.api.mailchimp.com/3.0/lists/${process.env.MC_LIST_ID}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from("anystring:" + process.env.MC_API_KEY).toString("base64"),
      },
      body: jsonData,
    });
    const result = await response.json();
    console.log(result);
    if (response.ok && result.error_count === 0) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  } catch (err) {
    console.error(err);
    res.sendFile(__dirname + "/failure.html");
  }
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

// app.listen(process.env.PORT || 3000, () => {
//   console.log(`server is running on port 3000`);
// });
