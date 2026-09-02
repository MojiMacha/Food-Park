import { db } from "./firebase.js";
import { doc,onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const id=new URLSearchParams(location.search).get("id"); if(!id) location.href="index.html";
const map={new:["🟡","รอรับออเดอร์"],cooking:["👨‍🍳","กำลังทำอาหาร"],ready:["🟣","พร้อมเสิร์ฟ"],served:["🟢","เสิร์ฟแล้ว"],cancelled:["🔴","ยกเลิก"]};
onSnapshot(doc(db,"orders",id),snap=>{
 if(!snap.exists())return;
 const o=snap.data(), m=map[o.status]||map.new;
 document.getElementById("statusIcon").textContent=m[0];document.getElementById("statusText").textContent=m[1];
 document.getElementById("orderMeta").textContent=`Order #${id.slice(-6)} • โต๊ะ ${o.table}`;
 document.getElementById("orderItems").innerHTML=o.items.map(x=>`<div class="line-item"><span>${x.name} × ${x.qty}${x.note?`<small>${x.note}</small>`:""}</span><b>฿${x.price*x.qty}</b></div>`).join("");
 document.getElementById("orderTotal").textContent="฿"+o.total;
 document.getElementById("payBtn").onclick=()=>location.href=`payment.html?id=${id}`;
});