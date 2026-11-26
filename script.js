
const formLogin = document.getElementById("loginForm");
const formDaftar = document.getElementById("regForm");
const pesan = document.getElementById("msg");

if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const users = JSON.parse(localStorage.getItem("cf_users")) || [];

    const akun = users.find(user => user.email === email && user.pw === password);

    if (akun) {
      localStorage.setItem("cf_session", JSON.stringify(akun));
      window.location.href = "home.html";
    } else {
      pesan.textContent = "Email atau password salah!";
    }
  });
}

if (formDaftar) {
  formDaftar.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = formDaftar.elements["name"].value;
    const email = formDaftar.elements["email"].value;
    const password = formDaftar.elements["pw"].value;
    const konfirmasi = formDaftar.elements["pw2"].value;
    const users = JSON.parse(localStorage.getItem("cf_users")) || [];

    if (password.length < 6) {
      pesan.textContent = "Password minimal 6 karakter!";
    } else if (password !== konfirmasi) {
      pesan.textContent = "Konfirmasi password tidak sama!";
    } else if (users.some(user => user.email === email)) {
      pesan.textContent = "Email sudah terdaftar!";
    } else {
      users.push({
        name: nama,
        email: email,
        pw: password,
        ticket: formDaftar.elements["ticket"].value,
        code: "CF26-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        date: new Date().toLocaleDateString("id-ID")
      });

      localStorage.setItem("cf_users", JSON.stringify(users));
      pesan.textContent = "Pendaftaran berhasil! Silakan masuk.";
    }
  });
}
