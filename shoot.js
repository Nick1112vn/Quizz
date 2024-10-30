let lastX, lastY, lastZ;
let shakeThreshold = 1; // Ngưỡng để xác định rung mạnh hay yếu
let shakeTimeout;
alert("shot")
// Hàm xử lý khi lắc điện thoại
function onShake() {
    //alert("shot")
  // Đây là nơi bạn có thể thực hiện hành động, ví dụ: bắn súng
  console.log("Phone shake detected!");
  const sound = new Audio('./pistolShot.mp3');

// Play the sound
sound.play();
}

// Lắng nghe sự kiện chuyển động của thiết bị
window.addEventListener("devicemotion", event => {
  let acceleration = event.accelerationIncludingGravity;

  if (!acceleration) return;

  let currentX = acceleration.x;
  let currentY = acceleration.y;
  let currentZ = acceleration.z;

  if (typeof lastX === "undefined") {
    // Khởi tạo giá trị ban đầu
    lastX = currentX;
    lastY = currentY;
    lastZ = currentZ;
    return;
  }

  // Tính toán thay đổi gia tốc
  let deltaX = Math.abs(currentX - lastX);
  let deltaY = Math.abs(currentY - lastY);
  let deltaZ = Math.abs(currentZ - lastZ);
alert(deltaX+" "+deltaY)
  // Kiểm tra xem sự thay đổi có vượt ngưỡng không
  if ((deltaX > shakeThreshold && deltaY > shakeThreshold) ||
      (deltaX > shakeThreshold && deltaZ > shakeThreshold) ||
      (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
        
    // Ngăn việc lắc liên tục
    if (!shakeTimeout) {
      onShake(); // Gọi hàm khi phát hiện lắc
      shakeTimeout = setTimeout(() => shakeTimeout = null, 1000); // Đặt thời gian chờ 1 giây để tránh lặp
    }
  }

  // Cập nhật giá trị gia tốc cuối
  lastX = currentX;
  lastY = currentY;
  lastZ = currentZ;
});
