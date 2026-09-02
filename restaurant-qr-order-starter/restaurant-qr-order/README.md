# Restaurant QR Order System
ระบบสั่งอาหารผ่าน QR Code + Firebase + GitHub Pages

## เริ่มต้น
1. สร้าง Firebase project
2. เปิด Authentication > Email/Password
3. เปิด Firestore Database
4. เปิด Hosting ไม่จำเป็น หากใช้ GitHub Pages
5. นำ Firebase config ไปใส่ใน assets/js/firebase-config.js
6. Push โฟลเดอร์ขึ้น GitHub แล้วเปิด GitHub Pages

## QR โต๊ะ
สร้าง QR ให้ชี้ไปที่:
customer.html?table=1
customer.html?table=2

## โครงสร้างข้อมูล Firestore
orders/{orderId}
menus/{menuId} (สำหรับอนาคต)
