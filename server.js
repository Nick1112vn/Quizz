const express = require('express');

const app = express();
const PORT = 3000; // Bạn có thể thay đổi cổng nếu cần

// API để lấy thời gian hiện tại từ máy chủ
app.get('/time', (req, res) => {
    const now = new Date(); // Lấy thời gian hiện tại
    res.send(now.toISOString()); // Trả về thời gian hiện tại theo định dạng ISO 8601
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
