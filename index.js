import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 ชี้ไปที่ Render Disk
const MUSIC_DIR = "/data/music";

// เสิร์ฟไฟล์เพลง
app.use("/music", express.static(MUSIC_DIR));

app.get("/", (req, res) => {
  res.send("🎵 Music server is running");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
