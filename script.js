(() => {
  const $ = (id) => document.getElementById(id);
  const msg = $("msg"), forms = [$("loginForm"), $("regForm")];
  const tampil = (i) => {
    forms.forEach((f, n) => (f.hidden = n !== i));
    document.querySelectorAll(".tabs button").forEach((b, n) => b.classList.toggle("on", n === i));
    msg.textContent = "";
  };
  document.querySelectorAll(".tabs button").forEach((b, n) => (b.onclick = () => tampil(n)));

  $("regForm").onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    if (d.pw.length < 6) return (msg.textContent = "Password minimal 6 karakter.");
    if (d.pw !== d.pw2) return (msg.textContent = "Konfirmasi password tidak sama.");
    localStorage.setItem("akun", JSON.stringify({ name: d.name, email: d.email, pw: d.pw, ticket: d.ticket }));
    e.target.reset();
    tampil(0);
    msg.textContent = "Daftar berhasil, silakan masuk.";
  };

  $("loginForm").onsubmit = (e) => {
    e.preventDefault();
    const a = JSON.parse(localStorage.getItem("akun") || "null");
    if (a && a.email === $("loginEmail").value.trim() && a.pw === $("loginPassword").value) location.href = "home.html";
    else msg.textContent = "Login gagal! Email atau password salah.";
  };
})();