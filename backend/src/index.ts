import express from "express";

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at http://127.0.0.1:${PORT}`);
});
