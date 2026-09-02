import { auth,db } from "./firebase.js";
import { onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection,onSnapshot,query,orderBy,doc,updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const filters=["all","new","cooking","ready","served","cancelled"];let filter="all",orders=[];
const labels={all:"ทั้งหมด",new:"ออเดอร์ใหม่",cooking:"กำลังทำ",ready:"พร้อมเสิร์ฟ",served:"เสิร์ฟแล้ว",cancelled:"ยกเลิก"};
onAuthStateChanged(auth,u=>{if(!u)location.href="login.html";});
document.getElementById("logoutBtn").onclick=()=>signOut(auth);
document.getElementById("filters").innerHTML=filters.map(x=>`<button data-f="${x}" class="${x==="all"?"active":""}">${labels[x]}</button>`).join("");
document.getElementById("filters").onclick=e=>{if(e.target.dataset.f){filter=e.target.dataset.f;document.querySelectorAll("#filters button").forEach(b=>b.classList.toggle("active",b.dataset.f===filter));render();}};
onSnapshot(query(collection(db,"orders"),orderBy("createdAt","desc")),snap=>{orders=snap.docs.map(d=>({id:d.id,...d.data()}));render();});
function render(){
 const show=filter==="all"?orders:orders.filter(o=>o.status===filter);
 document.getElementById("newCount").textContent=orders.filter(o=>o.status==="new").length;
 document.getElementById("cookingCount").textContent=orders.filter(o=>o.status==="cooking").length;
 document.getElementById("readyCount").textContent=orders.filter(o=>o.status==="ready").length;
 document.getElementById("orders").innerHTML=show.map(o=>`<article class="order-card"><div class="order-top"><b>โต๊ะ ${o.table}</b><span class="status ${o.status}">${labels[o.status]||o.status}</span></div><small>#${o.id.slice(-6)} • ฿${o.total}</small><div class="order-list">${o.items.map(i=>`<div>${i.name} × ${i.qty}${i.note?`<small>(${i.note})</small>`:""}</div>`).join("")}</div><div class="actions"><button data-id="${o.id}" data-s="new">รับ</button><button data-id="${o.id}" data-s="cooking">ทำ</button><button data-id="${o.id}" data-s="ready">พร้อม</button><button data-id="${o.id}" data-s="served">เสิร์ฟแล้ว</button></div></article>`).join("")||"<p class='muted'>ยังไม่มีออเดอร์</p>";
 document.querySelectorAll(".actions button").forEach(b=>b.onclick=()=>updateDoc(doc(db,"orders",b.dataset.id),{status:b.dataset.s}));
}
document.getElementById("refreshBtn").onclick=()=>location.reload();