import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
document.getElementById("loginBtn").onclick=async()=>{
 try{await signInWithEmailAndPassword(auth,email.value,password.value);location.href="dashboard.html";}
 catch(e){document.getElementById("error").textContent="เข้าสู่ระบบไม่สำเร็จ: "+e.message;}
};