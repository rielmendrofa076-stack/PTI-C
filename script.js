/* CampusFest - script.js
   1) Proteksi halaman  2) Header & footer bersama  3) Login/Daftar  4) E-ticket di Home  5) Countdown di Schedule
   Catatan: ini simulasi front-end untuk tugas (data disimpan di localStorage browser), bukan keamanan sungguhan. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const PAGE = document.body.dataset.page, u = get('cf_session', null);
  const logout = () => { localStorage.removeItem('cf_session'); location.href = 'index.html'; };

  // 1) Selain halaman awal, wajib login dulu
  if (PAGE !== 'auth' && !u) return location.replace('index.html');

  // 2) Header: logo selalu kembali ke menu awal (index.html)
  const pages = [['home', 'Home'], ['about', 'About'], ['schedule', 'Schedule']];
  $('#hdr').innerHTML = `<nav class="navbar"><a class="logo" href="index.html">Campus<span>Fest</span></a>` + (u
    ? `<ul class="nav-links">${pages.map(([p, t]) => `<li><a href="${p}.html"${p === PAGE ? ' class="active"' : ''}>${t}</a></li>`).join('')}<li class="chip">👤 ${esc(u.name.split(' ')[0])}</li><li><a href="#" id="out" class="btn-nav">Keluar</a></li></ul>`
    : '') + `</nav>`;
  $('#out')?.addEventListener('click', e => { e.preventDefault(); logout(); });

  // Footer: kontak event + sosial media (GANTI nomor & link dengan yang asli)
  const ic = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    tiktok: '<path d="M16 3v10a4 4 0 1 1-4-4"/><path d="M16 3c.4 2.4 2.2 4 5 4.3"/>'
  };
  const url = { instagram: 'https://instagram.com/campusfest2026', facebook: 'https://facebook.com/campusfest2026', tiktok: 'https://tiktok.com/@campusfest2026' };
  $('#ftr').innerHTML = `<div class="f-grid">
    <div><div class="logo">Campus<span>Fest</span></div><p>Wadah ekspresi musik dan seni mahasiswa.<br>25 – 26 November 2026, Lapangan Utama Kampus.</p></div>
    <div><h3>Info event</h3><p>Tanya apa saja soal acara lewat WhatsApp:<br><a href="https://wa.me/6281234567890" target="_blank" rel="noopener"><strong>+62 812-3456-7890</strong></a></p></div>
    <div><h3>Ikuti kami</h3><div class="social">${Object.keys(ic).map(k => `<a href="${url[k]}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24">${ic[k]}</svg></a>`).join('')}</div></div>
  </div><p class="copy">&copy; 2026 Kelompok Tugas Rancang PTI - Campus Art &amp; Music Festival</p>`;

  // 3) Menu awal: Masuk / Daftar + pilih tiket
  if (PAGE === 'auth') {
    const box = $('#authBox');
    if (u) { // sudah login: tampilkan panel sambutan, bukan form
      box.innerHTML = `<h2>Halo, ${esc(u.name)}!</h2><p class="lead">Kamu sudah masuk dan tiket <b>${esc(u.ticket)}</b> sudah aman.</p><a class="btn" href="home.html">Masuk ke Home</a><button class="btn ghost" id="out2" type="button">Keluar</button>`;
      $('#out2').onclick = logout;
      return;
    }
    const users = () => get('cf_users', []);
    const msg = (t, ok) => { const m = $('#msg'); m.textContent = t; m.className = ok ? 'ok' : 'err'; };
    const tabs = $$('.tabs button'), forms = [$('#loginForm'), $('#regForm')];
    const show = n => { tabs.forEach((t, i) => t.classList.toggle('on', i === n)); forms.forEach((f, i) => f.hidden = i !== n); msg(''); };
    tabs.forEach((t, i) => t.onclick = () => show(i));

    forms[0].onsubmit = e => {
      e.preventDefault();
      const em = $('#loginEmail').value.trim().toLowerCase(), pw = $('#loginPassword').value;
      const acc = users().find(x => x.email === em && x.pw === pw);
      if (!acc) return msg('Email atau password belum cocok. Cek lagi, atau daftar dulu kalau belum punya akun.');
      set('cf_session', { name: acc.name, email: acc.email, ticket: acc.ticket, code: acc.code });
      location.href = 'home.html';
    };

    forms[1].onsubmit = e => {
      e.preventDefault();
      const f = new FormData(e.target), em = f.get('email').trim().toLowerCase(), pw = f.get('pw');
      if (pw.length < 6) return msg('Password minimal 6 karakter. Tambahkan beberapa karakter lagi.');
      if (pw !== f.get('pw2')) return msg('Konfirmasi password belum sama. Ketik ulang di kolom konfirmasi.');
      const all = users();
      if (all.some(x => x.email === em)) return msg('Email ini sudah terdaftar. Pindah ke tab Masuk untuk login.');
      all.push({ name: f.get('name').trim(), email: em, pw, ticket: f.get('ticket'), code: 'CF26-' + Math.random().toString(36).slice(2, 8).toUpperCase() });
      set('cf_users', all);
      e.target.reset(); show(0); $('#loginEmail').value = em;
      msg('Pendaftaran berhasil. Masuk untuk melihat e-ticket kamu.', true);
    };
  }

  // 4) Home: sapaan + e-ticket dari data akun
  if (PAGE === 'home') {
    $('#hi').textContent = `Halo, ${u.name.split(' ')[0]}! Tiketmu sudah aman.`;
    $('#tix').innerHTML = `<small>E-ticket Campus Music Fest 2026</small><h3>${esc(u.ticket)}</h3><p>${esc(u.name)}</p><p>25 – 26 November 2026, Lapangan Utama Kampus</p><hr><div class="bar"></div><p class="code">${esc(u.code)}</p>`;
  }

  // 5) Schedule: hitung mundur ke hari pertama (25 Nov 2026, 15.00 WIB)
  if (PAGE === 'schedule') {
    const T = new Date('2026-11-25T15:00:00+07:00');
    const tick = () => {
      let d = Math.max(0, T - Date.now()) / 1000;
      [['d', 86400], ['h', 3600], ['m', 60], ['s', 1]].forEach(([k, n]) => { $('#c' + k).textContent = String(Math.floor(d / n)).padStart(2, '0'); d %= n; });
    };
    tick(); setInterval(tick, 1000);
  }
})();
