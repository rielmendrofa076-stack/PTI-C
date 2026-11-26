const pesan = document.getElementById("msg");
const formMasuk = document.getElementById("loginForm");
const formDaftar = document.getElementById("regForm");
const tombol = document.querySelectorAll(".tabs button");

function tampilkan(masuk) {
  formMasuk.hidden = !masuk;
  formDaftar.hidden = masuk;
  tombol[0].classList.toggle("on", masuk);
  tombol[1].classList.toggle("on", !masuk);
  pesan.textContent = "";
}

tombol[0].onclick = function () { tampilkan(true); };
tombol[1].onclick = function () { tampilkan(false); };

formDaftar.onsubmit = function (event) {
  event.preventDefault();

  if (formDaftar.rPw.value !== formDaftar.rPw2.value) {
    pesan.textContent = "Konfirmasi password tidak sama.";
    return;
  }

  localStorage.setItem("nama", formDaftar.rName.value);
  localStorage.setItem("email", formDaftar.rEmail.value);
  localStorage.setItem("password", formDaftar.rPw.value);
  localStorage.setItem("tiket", formDaftar.ticket.value);

  formDaftar.reset();
  tampilkan(true);
  pesan.textContent = "Daftar berhasil, silakan masuk.";
};

formMasuk.onsubmit = function (event) {
  event.preventDefault();

  if (formMasuk.loginEmail.value === localStorage.getItem("email") &&
      formMasuk.loginPassword.value === localStorage.getItem("password")) {
    window.location.href = "home.html";
    return;
  }

  pesan.textContent = "Login gagal! Email atau password salah.";
};