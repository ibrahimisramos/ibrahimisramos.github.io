// Home hero: type out roles like the old site, and crossfade to the photo whose data-role matches
// the role being typed. A role without its own slide falls back to the first slide.
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var slides = document.querySelectorAll('.hero-slides .slide');
  function show(role) {
    var match = slides[0];
    slides.forEach(function (s) { if (s.dataset.role === role) match = s; });
    if (!match) return;
    slides.forEach(function (s) { s.classList.toggle('is-active', s === match); });
  }

  var el = document.querySelector('.typed');
  if (!el || reduce) return;
  var items = el.dataset.items.split(','), word = 0, pos = items[0].length, deleting = true;
  show(items[0]);
  function tick() {
    var text = items[word];
    pos += deleting ? -1 : 1;
    el.textContent = text.slice(0, pos);
    var delay = deleting ? 40 : 90;
    if (deleting && pos === 0) { deleting = false; word = (word + 1) % items.length; show(items[word]); delay = 300; }
    else if (!deleting && pos === items[word].length) { deleting = true; delay = 1800; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1800);
})();
