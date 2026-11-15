// Category filter chips on /blog/ and the home page. A chip's data-filter matches a card's
// category or its group (cyber/travel). Grids with data-limit show only the first N matches.
// On /blog/ the choice is kept in ?c=<filter> so posts can deep-link to a filtered view.
(function () {
  var chips = document.querySelectorAll('.chip');
  var grid = document.querySelector('[data-filter-grid]');
  if (!grid) return;
  var cards = grid.querySelectorAll('.post-card');
  var limit = parseInt(grid.dataset.limit, 10) || Infinity;
  var useUrl = !grid.dataset.limit;
  var none = document.getElementById('no-match');
  var more = document.querySelector('[data-filter-more]');
  function apply(f) {
    var shown = 0;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === f)); });
    cards.forEach(function (card) {
      var match = f === 'all' || card.dataset.category === f || card.dataset.group === f;
      card.hidden = !match || shown >= limit;
      if (!card.hidden) shown++;
    });
    if (none) none.hidden = shown > 0;
    if (more) more.href = more.dataset.base + (f === 'all' ? '' : '?c=' + f);
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      apply(c.dataset.filter);
      if (!useUrl) return;
      var url = new URL(location.href);
      if (c.dataset.filter === 'all') url.searchParams.delete('c'); else url.searchParams.set('c', c.dataset.filter);
      history.replaceState(null, '', url);
    });
  });
  var initial = useUrl && new URLSearchParams(location.search).get('c');
  apply(initial && document.querySelector('.chip[data-filter="' + initial + '"]') ? initial : 'all');
})();
