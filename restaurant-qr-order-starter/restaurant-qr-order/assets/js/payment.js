import { db } from "./firebase.js";
import { doc,getDoc,updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const id=new URLSearchParams(location.search).get("id");
const snap=await getDoc(doc(db,"orders",id)); if(!snap.exists())location.href="index.html";
const o=snap.data(); document.getElementById("amount").textContent="฿"+o.total;
document.getElementById("backLink").href=`order.html?id=${id}`;
// DEMO QR: เปลี่ยนข้อความนี้เป็น payload PromptPay/Payment Gateway จริงก่อนใช้งานจริง
new QRCode(document.getElementById("qr"),{text:`RESTAURANT-DEMO|ORDER:${id}|AMOUNT:${o.total}|EXPIRES:${Date.now()+600000}`,width:220,height:220});
let left=600;
const timer=document.getElementById("timer");
const tick=setInterval(()=>{left--;timer.textContent=`${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`;if(left<=0){clearInterval(tick);document.getElementById("paidBtn").disabled=true;timer.textContent="หมดอายุ";}},1000);
document.getElementById("paidBtn").onclick=async()=>{await updateDoc(doc(db,"orders",id),{paymentStatus:"customer_claimed"});alert("ส่งคำขอยืนยันการชำระเงินแล้ว กรุณารอพนักงานตรวจสอบ");location.href=`order.html?id=${id}`};