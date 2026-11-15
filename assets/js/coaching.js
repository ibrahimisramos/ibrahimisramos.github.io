// Coaching page: before/after slider, cycling hero words, scroll reveals, flip cards.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Before/after slider. Starts on "before", then slides across to "after" once, then follows the range input.
  var cmp = document.querySelector("[data-compare]");
  if (cmp) {
    var range = cmp.querySelector(".tx-range");
    var set = function (v) { cmp.style.setProperty("--split", v + "%"); };
    range.addEventListener("input", function () { cmp.classList.add("touched"); set(range.value); });
    if (!reduce) {
      var t0 = null;
      var sweep = function (ts) {
        if (cmp.classList.contains("touched")) return;
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / 1800, 1);
        var ease = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        var v = 94 - 88 * ease;
        set(v.toFixed(1)); range.value = v;
        if (p < 1) requestAnimationFrame(sweep);
      };
      setTimeout(function () { requestAnimationFrame(sweep); }, 1200);
    }
  }

  // Hero word pairs.
  var before = document.querySelector("[data-tx-before]");
  var after = document.querySelector("[data-tx-after]");
  var pairs = [["conflicted", "clear"], ["torn", "true"], ["expected", "chosen"], ["doubting", "proud"]];
  if (before && after && !reduce) {
    var i = 0;
    setInterval(function () {
      i = (i + 1) % pairs.length;
      before.classList.add("out"); after.classList.add("out");
      setTimeout(function () {
        before.textContent = pairs[i][0]; after.textContent = pairs[i][1];
        before.classList.remove("out"); after.classList.remove("out");
      }, 350);
    }, 2800);
  }

  // Reveal on scroll, and fill the story line as you go.
  var items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        // Also reveal anything already scrolled past, e.g. after a jump to an anchor.
        if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    items.forEach(function (el) { el.classList.add("pre"); io.observe(el); });
  }
  var story = document.querySelector("[data-story]");
  if (story) {
    var fill = function () {
      var r = story.getBoundingClientRect();
      var p = (window.innerHeight * 0.6 - r.top) / r.height;
      story.style.setProperty("--progress", Math.max(0, Math.min(1, p)).toFixed(3));
    };
    window.addEventListener("scroll", fill, { passive: true });
    fill();
  }

  // Flip cards.
  document.querySelectorAll(".flip").forEach(function (b) {
    b.addEventListener("click", function () {
      b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
    });
  });
})();
