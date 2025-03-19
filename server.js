const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Konfigurasi multer (untuk upload file)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

// API untuk mendapatkan daftar video
app.get("/videos", (req, res) => {
  fs.readFile("videos.json", (err, data) => {
    if (err) return res.status(500).send("Error membaca data video");
    res.json(JSON.parse(data));
  });
});

// API untuk upload video
app.post("/upload", upload.single("video"), (req, res) => {
  const { title } = req.body;
  const filePath = req.file.filename;

  // Simpan data video ke videos.json
  fs.readFile("videos.json", (err, data) => {
    let videos = err ? [] : JSON.parse(data);
    videos.push({ title, file: filePath });
    fs.writeFile("videos.json", JSON.stringify(videos, null, 2), (err) => {
      if (err) return res.status(500).send("Gagal menyimpan data video");
      res.json({ success: true, message: "Video berhasil diupload!" });
    });
  });
});

// Jalankan server
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));