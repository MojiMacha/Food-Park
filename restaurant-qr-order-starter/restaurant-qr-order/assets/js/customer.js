import { menu } from "./menu-data.js";
import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const table = new URLSearchParams(location.search).get("table") || "ทดลอง";
const cartKey = `restaurant_cart_${table}`;
let cart = JSON.parse(localStorage.getItem(cartKey) || "[]");
let selected = null;
let category = "ทั้งหมด";

document.getElementById("tableBadge").textContent = `โต๊ะ ${table}`;
const tabs = ["ทั้งหมด", ...new Set(menu.map(x=>x.cat))];
document.getElementById("tabs").innerHTML = tabs.map(x=>`<button class="${x===category?"active":""}" data-cat="${x}">${x}</button>`).join("");
document.getElementById("tabs").onclick=e=>{ if(e.target.dataset.cat){category=e.target.dataset.cat; render(); document.querySelectorAll("#tabs button").forEach(b=>b.classList.toggle("active",b.dataset.cat===category));}};
function money(n){return "฿"+n.toLocaleString();}
function render(){
 const list=category==="ทั้งหมด"?menu:menu.filter(x=>x.cat===category);
 document.getElementById("menuGrid").innerHTML=list.map(x=>`<article class="food-card"><img src="${x.img}" alt="${x.name}"><div class="food-info"><span class="food-cat">${x.cat}</span><h3>${x.name}</h3><div class="food-bottom"><b>${money(x.price)}</b><button data-id="${x.id}" class="add">+</button></div></div></article>`).join("");
 document.querySelectorAll(".add").forEach(b=>b.onclick=()=>openNote(menu.find(x=>x.id===b.dataset.id)));
 updateCart();
}
function openNote(item){selected=item; document.getElementById("noteTitle").textContent=item.name; document.getElementById("itemNote").value=""; document.getElementById("noteModal").classList.remove("hidden");}
document.getElementById("cancelNote").onclick=()=>document.getElementById("noteModal").classList.add("hidden");
document.getElementById("saveNote").onclick=()=>{
 const note=document.getElementById("itemNote").value.trim();
 const same=cart.find(x=>x.id===selected.id&&x.note===note);
 if(same)same.qty++; else cart.push({...selected,note,qty:1});
 save(); document.getElementById("noteModal").classList.add("hidden");
};
function save(){localStorage.setItem(cartKey,JSON.stringify(cart)); updateCart(); renderCart();}
function updateCart(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);}
function renderCart(){
 const box=document.getElementById("cartItems");
 box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><div><b>${x.name}</b><small>${x.note||""}</small><span>${money(x.price)} × ${x.qty}</span></div><div class="qty"><button data-a="minus" data-i="${i}">−</button><b>${x.qty}</b><button data-a="plus" data-i="${i}">+</button></div></div>`).join(""):"<p class='muted'>ยังไม่มีสินค้าในตะกร้า</p>";
 document.getElementById("totalPrice").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
 box.querySelectorAll("button").forEach(b=>b.onclick=()=>{let x=cart[+b.dataset.i]; if(b.dataset.a==="plus")x.qty++;else if(--x.qty<=0)cart.splice(+b.dataset.i,1);save();});
}
document.getElementById("cartBtn").onclick=()=>{document.getElementById("drawer").classList.remove("hidden");renderCart();}
document.getElementById("closeCart").onclick=()=>document.getElementById("drawer").classList.add("hidden");
document.getElementById("checkoutBtn").onclick=async()=>{
 if(!cart.length)return alert("กรุณาเลือกอาหารก่อน");
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 const doc=await addDoc(collection(db,"orders"),{table:String(table),items:cart,total,status:"new",createdAt:serverTimestamp(),paymentStatus:"unpaid"});
 localStorage.removeItem(cartKey);
 location.href=`order.html?id=${doc.id}`;
};
render();