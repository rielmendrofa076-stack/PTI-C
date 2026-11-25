/* CampusFest - script.js
   JavaScript HANYA dipakai di halaman login/awal (index.html): Masuk, Daftar, panel profil akun, Keluar.
   Halaman lain murni HTML + CSS. Data disimpan di localStorage browser (simulasi untuk tugas, bukan keamanan sungguhan). */
(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const price = { Presale: 'Rp 35.000', Regular: 'Rp 50.000', 'VIP Pass': 'Rp 85.000' };
  const logout = () => { localStorage.removeItem('cf_session'); top.location.href = 'index.html'; };
  const u = get('cf_session', null), box = $('#authBox');

  // index.html#profil = tampilan mini yang dibuka di popup "Akun" pada halaman lain
  const embed = location.hash === '#profil';
  document.body.classList.toggle('embed', embed);

  // Sudah login: tampilkan profil + info akun
  if (u) {
    const row = (k, v) => `<dt>${k}</dt><dd>${v}</dd>`;
    box.innerHTML = `<div class="who"><div class="av">${esc(u.name[0].toUpperCase())}</div><div><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div></div>
      <dl>${row('Tiket', esc(u.ticket) + ' (' + (price[u.ticket] || '-') + ')')}${row('Kode', '<span class="code">' + esc(u.code) + '</span>')}${row('Status', 'Terdaftar, tiket aktif')}${row('Berlaku', '25 – 26 Nov 2026, Lapangan Utama Kampus')}${row('Daftar sejak', esc(u.date || '-'))}</dl>
      <div class="bar"></div>
      <div class="row"><a class="btn" href="home.html" target="_top">Ke Home</a><button class="btn ghost" id="out" type="button">Keluar</button></div>`;
    $('#out').onclick = logout;
    return;
  }
  // Belum login di popup: arahkan ke menu awal
  if (embed) {
    box.innerHTML = '<h2>Belum masuk</h2><p class="lead">Masuk atau daftar dulu untuk melihat profil dan e-ticket kamu.</p><a class="btn" href="index.html" target="_top">Ke menu awal</a>';
    return;
  }

  // Masuk / Daftar
  const users = () => get('cf_users', []);
  const msg = (t, ok) => { const m = $('#msg'); m.textContent = t; m.className = ok ? 'ok' : 'err'; };
  const tabs = [...document.querySelectorAll('.tabs button')], forms = [$('#loginForm'), $('#regForm')];
  const show = n => { tabs.forEach((t, i) => t.classList.toggle('on', i === n)); forms.forEach((f, i) => f.hidden = i !== n); msg(''); };
  tabs.forEach((t, i) => t.onclick = () => show(i));

  forms[0].onsubmit = e => {
    e.preventDefault();
    const em = $('#loginEmail').value.trim().toLowerCase(), pw = $('#loginPassword').value;
    const acc = users().find(x => x.email === em && x.pw === pw);
    if (!acc) return msg('Email atau password belum cocok. Cek lagi, atau daftar dulu kalau belum punya akun.');
    set('cf_session', { name: acc.name, email: acc.email, ticket: acc.ticket, code: acc.code, date: acc.date });
    location.href = 'home.html';
  };

  forms[1].onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target), em = f.get('email').trim().toLowerCase(), pw = f.get('pw');
    if (pw.length < 6) return msg('Password minimal 6 karakter. Tambahkan beberapa karakter lagi.');
    if (pw !== f.get('pw2')) return msg('Konfirmasi password belum sama. Ketik ulang di kolom konfirmasi.');
    const all = users();
    if (all.some(x => x.email === em)) return msg('Email ini sudah terdaftar. Pindah ke tab Masuk untuk login.');
    all.push({ name: f.get('name').trim(), email: em, pw, ticket: f.get('ticket'), code: 'CF26-' + Math.random().toString(36).slice(2, 8).toUpperCase(), date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) });
    set('cf_users', all);
    e.target.reset(); show(0); $('#loginEmail').value = em;
    msg('Pendaftaran berhasil. Masuk untuk melihat e-ticket kamu.', true);
  };
})();
