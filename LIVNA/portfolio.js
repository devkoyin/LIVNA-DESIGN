/* ============================================================
   LIVNA — Portfolio JavaScript
   Filtering, sorting, and detail modal
   ============================================================ */

/* ─── PIECE DATA ────────────────────────────────────────────── */
const pieces = {
  eclat: {
    title: 'The Éclat Gown',
    category: 'Evening Wear',
    bg: '#EDE9DF',
    description: 'Commissioned for a private charity gala in Lagos, the Éclat Gown was born from a client\'s desire to move through a room like light. Hand-draped ivory silk falls from an asymmetric shoulder in a single, uninterrupted gesture. There are no seams where they would interrupt the drape — each fold is anchored by a single internal stitch, invisible yet precise.',
    specs: [
      { label: 'Material', value: 'Silk Charmeuse' },
      { label: 'Category', value: 'Evening Wear' },
      { label: 'Season', value: 'SS 2025' },
      { label: 'Origin', value: 'Lagos Atelier' },
      { label: 'Duration', value: '6 weeks' }
    ]
  },
  obsidian: {
    title: 'The Obsidian Suit',
    category: 'Tailoring',
    bg: '#1A1A17',
    description: 'A sculpted two-piece in midnight-black wool crepe, commissioned by an executive who required a suit that felt like armour and moved like air. The jacket\'s shoulder is structured with a single horsehair canvas interlining — a technique from Savile Row adapted for the Livna atelier. The trouser breaks exactly at the ankle, not a millimetre more.',
    specs: [
      { label: 'Material', value: 'Double-weave Wool Crepe' },
      { label: 'Category', value: 'Tailoring' },
      { label: 'Season', value: 'AW 2025' },
      { label: 'Origin', value: 'Lagos Atelier' },
      { label: 'Duration', value: '4 weeks' }
    ]
  },
  douceur: {
    title: 'The Douceur Gown',
    category: 'Bridal',
    bg: '#F7F0E6',
    description: 'The Douceur Gown was made for a traditional Yoruba ceremony in Lagos. The bride requested softness — not softness as weakness, but as the kind of strength that doesn\'t need to announce itself. The bodice is structured with boning hidden beneath layers of duchess satin, and the train extends to cathedral length, hand-sewn with freshwater pearl edging.',
    specs: [
      { label: 'Material', value: 'Duchess Satin, Freshwater Pearl' },
      { label: 'Category', value: 'Bridal' },
      { label: 'Season', value: 'SS 2025' },
      { label: 'Origin', value: 'Lagos Atelier' },
      { label: 'Duration', value: '10 weeks' }
    ]
  },
  asa: {
    title: 'Àṣà Ensemble',
    category: 'Cultural Couture',
    bg: '#2D1810',
    description: 'Àṣà (meaning culture or tradition in Yoruba) is Livna\'s exploration of what happens when ancestral weaving techniques meet contemporary silhouette. The aso-oke fabric was sourced from a weaver in Iseyin, Oyo State, then reimagined as a floor-length overskirt and structured top. The hand-loomed stripwork runs at a calculated diagonal — heritage given motion.',
    specs: [
      { label: 'Material', value: 'Aso-Oke (Iseyin weave)' },
      { label: 'Category', value: 'Cultural Couture' },
      { label: 'Season', value: 'AW 2024' },
      { label: 'Origin', value: 'Lagos Atelier' },
      { label: 'Duration', value: '5 weeks' }
    ]
  },
  nuit: {
    title: 'The Nuit Cape',
    category: 'Evening Wear',
    bg: '#151525',
    description: 'Midnight indigo velvet, floor-length, structured at the shoulders and unstructured everywhere else. The Nuit Cape was made for an awards evening and designed to be worn over a column dress. The closure is a single matte button at the throat — the only moment of restraint in a garment that is otherwise pure drama.',
    specs: [
      { label: 'Material', value: 'Silk-backed Velvet' },
      { label: 'Category', value: 'Evening Wear' },
      { label: 'Season', value: 'AW 2024' },
      { label: 'Origin', value: 'Lagos Atelier' },
      { label: 'Duration', value: '3 weeks' }
    ]
  },
  soleil: {
    title: 'The Soleil Set',
    category: 'Casual Couture',
    bg: '#F2EAD8',
    description: 'A two-piece resort set in handwashed Belgian linen, made for a Lagos summer. The Soleil collection marks Livna\'s entry into everyday couture — garments that are bespoke in their fit and finish but practical in their spirit. The linen was pre-washed three times to achieve a softness that no unworn fabric can replicate. Every seam is double-stitched.',
    specs: [
      { label: 'Material', value: 'Belgian Linen (stonewashed)' },
      { label: 'Category', value: 'Casual Couture' },
      { label: 'Season', value: 'SS 2024' },
      { label: 'Origin', value: 'Lagos Atelier' },
      { label: 'Duration', value: '2 weeks' }
    ]
  }
};

/* ─── FILTERING ─────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const items      = document.querySelectorAll('.portfolio__item');
const emptyState = document.getElementById('portfolio-empty');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

function applyFilter(filter) {
  let visible = 0;
  items.forEach(item => {
    const match = filter === 'all' || item.dataset.category === filter;
    if (match) {
      item.classList.remove('hidden');
      item.classList.add('filtering');
      setTimeout(() => item.classList.remove('filtering'), 400);
      visible++;
    } else {
      item.classList.add('hidden');
    }
  });
  if (emptyState) {
    emptyState.style.display = visible === 0 ? 'block' : 'none';
  }
}

function resetFilters() {
  filterBtns.forEach(b => b.classList.remove('active'));
  filterBtns[0].classList.add('active');
  applyFilter('all');
}

/* ─── SORTING ───────────────────────────────────────────────── */
const sortSelect = document.getElementById('sort-select');
const grid       = document.getElementById('portfolio-grid');

if (sortSelect && grid) {
  sortSelect.addEventListener('change', () => {
    const val     = sortSelect.value;
    const itemArr = [...grid.querySelectorAll('.portfolio__item')];

    itemArr.sort((a, b) => {
      if (val === 'newest') return parseInt(b.dataset.date) - parseInt(a.dataset.date);
      if (val === 'oldest') return parseInt(a.dataset.date) - parseInt(b.dataset.date);
      if (val === 'material') return (a.dataset.material || '').localeCompare(b.dataset.material || '');
      return 0;
    });

    itemArr.forEach(item => grid.appendChild(item));
  });
}

/* ─── MODAL ─────────────────────────────────────────────────── */
function openModal(key) {
  const data    = pieces[key];
  if (!data) return;

  const modal   = document.getElementById('portfolio-modal');
  const content = document.getElementById('modal-content');

  const specsHTML = data.specs.map(s => `
    <div class="modal-spec">
      <span class="modal-spec-label">${s.label}</span>
      <span class="modal-spec-value">${s.value}</span>
    </div>
  `).join('');

  content.innerHTML = `
    <div class="modal-piece-image" style="background: ${data.bg};">
      ${document.querySelector('[aria-label*="${data.title}"] .portfolio__image')?.innerHTML || ''}
    </div>
    <p class="eyebrow modal-eyebrow">${data.category}</p>
    <h2 class="modal-title">${data.title}</h2>
    <div class="modal-divider"></div>
    <p class="modal-desc">${data.description}</p>
    <div class="modal-specs">${specsHTML}</div>
    <div class="modal-cta">
      <a href="order.html" class="btn btn-primary">
        Commission Something Similar <span class="btn-icon" aria-hidden="true"></span>
      </a>
      <button class="btn btn-outline" onclick="closeModal()">
        Continue Browsing
      </button>
    </div>
  `;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  modal.querySelector('.portfolio-modal__panel').focus();
}

function closeModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Enter to open for keyboard users
items.forEach(item => {
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const btn = item.querySelector('.portfolio__view-btn');
      if (btn) btn.click();
    }
  });
});
