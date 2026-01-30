import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/music/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "public/music", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Disposition", "inline");

  if (range) {
    // 🔥 รองรับ seek / streaming
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Content-Length": chunkSize,
    });

    file.pipe(res);
  } else {
    // โหลดครั้งแรก
    res.writeHead(200, {
      "Content-Length": fileSize,
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

app.get("/", (_, res) => res.send("🎵 Music server ready"));

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
