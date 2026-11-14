// Launchpad CTF: checks flags against SHA-256 hashes in the page, so no plaintext
// flags ship in the checker. Progress lives in localStorage (best effort).
(function () {
  var KEY = 'launchpad-solved';

  function loadSolved() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function saveSolved(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private mode etc. */ }
  }
  function sha256(text) {
    var bytes = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', bytes).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    });
  }

  var solved = loadSolved();

  // Challenge page
  var form = document.querySelector('[data-ctf-flag]');
  if (form) {
    var result = document.querySelector('[data-ctf-result]');
    var debrief = document.querySelector('.debrief');
    var slug = form.dataset.slug;
    function showSolved() {
      if (debrief) debrief.hidden = false;
      result.className = 'flag-result ok';
      result.textContent = '✓ Correct! Challenge solved.';
    }
    if (solved.indexOf(slug) !== -1) showSolved();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var guess = form.flag.value.trim().toLowerCase();
      if (!window.crypto || !crypto.subtle) {
        result.className = 'flag-result bad';
        result.textContent = 'Flag checking needs https:// or localhost.';
        return;
      }
      sha256(guess).then(function (hex) {
        if (hex === form.dataset.hash) {
          if (solved.indexOf(slug) === -1) { solved.push(slug); saveSolved(solved); }
          showSolved();
          debrief.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          result.className = 'flag-result bad';
          result.textContent = guess.indexOf('ibr{') === 0
            ? '✗ Not quite. Check for typos, or open a hint.'
            : '✗ Flags look like IBR{something_here}.';
        }
      });
    });
  }

  // Portal index
  var marks = document.querySelectorAll('[data-solved-mark]');
  if (marks.length) {
    var count = 0;
    marks.forEach(function (m) {
      if (solved.indexOf(m.dataset.solvedMark) !== -1) { m.textContent = '✓ solved'; count++; }
    });
    var p = document.getElementById('ctf-progress');
    if (p) p.textContent = count + ' / ' + marks.length + ' solved';
  }
})();
