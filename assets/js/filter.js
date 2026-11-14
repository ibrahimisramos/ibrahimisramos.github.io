// Category filter chips on /blog/. Reads ?c=<category> so posts can deep-link to a filtered view.
(function () {
  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('#posts .post-card');
  var none = document.getElementById('no-match');
  function apply(cat) {
    var shown = 0;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === cat)); });
    cards.forEach(function (card) {
      var match = cat === 'all' || card.dataset.category === cat;
      card.hidden = !match;
      if (match) shown++;
    });
    if (none) none.hidden = shown > 0;
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      apply(c.dataset.filter);
      var url = new URL(location.href);
      if (c.dataset.filter === 'all') url.searchParams.delete('c'); else url.searchParams.set('c', c.dataset.filter);
      history.replaceState(null, '', url);
    });
  });
  var initial = new URLSearchParams(location.search).get('c');
  if (initial && document.querySelector('.chip[data-filter="' + initial + '"]')) apply(initial);
})();
