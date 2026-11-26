document.getElementById("form-login")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const valid = document.getElementById("username").value.trim() === "admin"
    && document.getElementById("password").value === "admin123";
  document.getElementById("pesan-login").textContent = valid ? "" : "Login gagal! Username atau kata sandi salah.";
  if (valid) location.href = "pages/home.html";
});