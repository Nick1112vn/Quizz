let lastX, lastY, lastZ;
let shakeThreshold = 5; // Ngưỡng để xác định rung mạnh hay yếu
let shakeTimeout;
const sound = new Audio('./pistolShot.mp3');
sound.load();

// Hàm xử lý khi lắc điện thoại
function onShake() {
    //alert("shot")
  // Đây là nơi bạn có thể thực hiện hành động, ví dụ: bắn súng
  console.log("Phone shake detected!");
  socket.emit('shoot',getTime())

// Play the sound
//sound.play();
}
//alert(typeof DeviceMotionEvent !== 'undefined'&&typeof DeviceMotionEvent.requestPermission === 'function')
document.querySelector("#StudentsList").querySelector(".submit").addEventListener("click",function(){
  //alert(typeof DeviceMotionEvent.requestPermission === 'function')
if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
  // iOS 13+ yêu cầu quyền
 
      DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            //alert(permissionState)
              if (permissionState === 'granted') {
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
//alert(deltaX+" "+deltaY)
  // Kiểm tra xem sự thay đổi có vượt ngưỡng không
  if ((deltaX > shakeThreshold && deltaY > shakeThreshold) ||
      (deltaX > shakeThreshold && deltaZ > shakeThreshold) ||
      (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
      //document.querySelector('h1').innerText=deltaX+" "+deltaY+" "+deltaZ  
    // Ngăn việc lắc liên tục
    if (!shakeTimeout&&canShoot==true) {
      onShake(); // Gọi hàm khi phát hiện lắc
      shakeTimeout = setTimeout(() => shakeTimeout = null, 1000); // Đặt thời gian chờ 1 giây để tránh lặp
    }
  }

  // Cập nhật giá trị gia tốc cuối
  lastX = currentX;
  lastY = currentY;
  lastZ = currentZ;
});
} else {
  console.log('Permission denied');
}
})
.catch(console.error);

} else {
// Các trình duyệt khác hoặc iOS phiên bản cũ hơn
window.addEventListener('devicemotion', (event) => {
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
//alert(deltaX+" "+deltaY)
  // Kiểm tra xem sự thay đổi có vượt ngưỡng không
  if ((deltaX > shakeThreshold && deltaY > shakeThreshold) ||
      (deltaX > shakeThreshold && deltaZ > shakeThreshold) ||
      (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
      //document.querySelector('h1').innerText=deltaX+" "+deltaY+" "+deltaZ  
    // Ngăn việc lắc liên tục
    if (!shakeTimeout&&canShoot==true) {
      onShake(); // Gọi hàm khi phát hiện lắc
      shakeTimeout = setTimeout(() => shakeTimeout = null, 1000); // Đặt thời gian chờ 1 giây để tránh lặp
    }
  }

  // Cập nhật giá trị gia tốc cuối
  lastX = currentX;
  lastY = currentY;
  lastZ = currentZ;
});
}
})
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') { // Kiểm tra nếu phím nhấn là Space
      event.preventDefault(); // Ngăn chặn hành động mặc định của phím cách (cuộn trang)
      onShake() // Phát âm thanh
      console.log(getTime())
  }
});
