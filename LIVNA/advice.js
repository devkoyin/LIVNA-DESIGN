/* ============================================================
   LIVNA — Advice / Journal Page JavaScript
   Style quiz, article drawer, filters, material accordions
   ============================================================ */

/* ─── JOURNAL FILTER ────────────────────────────────────────── */
const journalFilters = document.querySelectorAll('.journal-filter');
const journalCards   = document.querySelectorAll('.journal__card');

journalFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    journalFilters.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    const cat = btn.dataset.cat;
    journalCards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hidden', !match);
      if (match) {
        card.style.animation = 'fadeUp 0.35s ease forwards';
        setTimeout(() => card.style.animation = '', 400);
      }
    });
  });
});

/* ─── LOAD MORE ─────────────────────────────────────────────── */
let loadMoreCount = 0;
const extraArticles = [
  {
    cat: 'craft',
    bg: '#EDE9DF',
    date: 'Jan 2025',
    title: 'Hand-Finishing: The Detail That Separates Couture from Everything Else',
    excerpt: 'A hand-sewn hem takes six times longer than a machine-sewn one. Here\'s why it matters — and why you can feel the difference.',
    id: 'hand-finishing'
  },
  {
    cat: 'trends',
    bg: '#0E1A10',
    date: 'Jan 2025',
    title: 'The Return of Occasion Dressing — and What It Means for the Bespoke Wardrobe',
    excerpt: 'After years of casual creep, clients are rediscovering the pleasure of dressing deliberately for specific moments.',
    id: 'occasion-dressing'
  },
  {
    cat: 'culture',
    bg: '#1A1030',
    date: 'Dec 2024',
    title: 'Lagos Fashion Week and the Atelier Tradition: A Different Kind of Luxury',
    excerpt: 'Why the most exciting fashion happening in Africa isn\'t on a runway — it\'s in the ateliers.',
    id: 'lagos-fashion'
  }
];

function loadMoreArticles() {
  if (loadMoreCount >= extraArticles.length) {
    showToast('All articles have been loaded.');
    document.getElementById('load-more-btn').style.display = 'none';
    return;
  }

  const grid = document.getElementById('journal-grid');
  const data = extraArticles[loadMoreCount];
  const card = document.createElement('article');
  card.className = 'journal__card';
  card.dataset.cat = data.cat;
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <div class="journal__card-img" style="background: ${data.bg};" aria-hidden="true">
      <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="240" fill="${data.bg}"/>
        <text x="200" y="130" text-anchor="middle" fill="#C9A96E" font-family="Georgia, serif" font-size="10" font-style="italic" letter-spacing="3" opacity="0.6">Livna</text>
      </svg>
    </div>
    <div class="journal__card-body">
      <div class="journal__card-meta">
        <span class="journal__cat-tag">${data.cat.charAt(0).toUpperCase() + data.cat.slice(1)}</span>
        <span class="advice-date">${data.date}</span>
      </div>
      <h3 class="journal__card-title">${data.title}</h3>
      <p class="journal__card-excerpt">${data.excerpt}</p>
      <button class="journal__read-link" onclick="openArticle('${data.id}')" aria-label="Read ${data.title}">
        Read <span aria-hidden="true">→</span>
      </button>
    </div>
  `;
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  grid.appendChild(card);

  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });

  loadMoreCount++;
  if (loadMoreCount >= extraArticles.length) {
    document.getElementById('load-more-btn').textContent = 'All Articles Loaded';
    setTimeout(() => { document.getElementById('load-more-btn').style.display = 'none'; }, 2000);
  }
}

/* ─── MATERIAL ACCORDION ────────────────────────────────────── */
function toggleMaterial(card) {
  const isOpen = card.getAttribute('aria-expanded') === 'true';
  const body = card.querySelector('.material-card__body');

  // Close all others
  document.querySelectorAll('.material-card').forEach(c => {
    c.setAttribute('aria-expanded', 'false');
    const b = c.querySelector('.material-card__body');
    if (b) b.hidden = true;
  });

  // Toggle clicked
  if (!isOpen) {
    card.setAttribute('aria-expanded', 'true');
    if (body) body.hidden = false;
  }
}

// Keyboard support for material cards
document.querySelectorAll('.material-card').forEach(card => {
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMaterial(card);
    }
  });
});

/* ─── ARTICLE DRAWER ────────────────────────────────────────── */
const articles = {
  'fabric-weight': {
    category: 'Material Guide',
    date: 'May 2025',
    title: 'The Weight of Fabric: A Sensory Guide to Material Selection',
    content: `
      <p>There is a test every experienced designer applies before making a final material selection: they hold the fabric in their hand and close their eyes. They're not looking for colour or pattern. They're listening to what the fabric says about itself — how it falls, how it resists, how it breathes.</p>

      <h3>Why material comes first</h3>
      <p>Most clients arrive with a silhouette in mind. A certain imagined shape — gathered or tailored, structured or fluid. This is natural. But the best designers know that silhouette is largely determined by material, not the other way around. A fluid silk cannot hold a structured shoulder. A stiff duchess satin cannot drape with the liquid grace of charmeuse.</p>

      <blockquote>"The fabric is already telling you what it wants to become. Your job is to listen well enough to agree with it."</blockquote>

      <p>This is why our consultation process always begins with material, even when the client arrives with a sketch. The sketch is a hypothesis. The material is the constraint that makes it real.</p>

      <h3>The sensory hierarchy</h3>
      <p>We evaluate fabrics in a specific order: weight first, then hand (how it feels against the palm), then drape (how it falls from a vertical), then sheen (how it interacts with light), and finally structure (how it holds its shape).</p>

      <p>Weight determines silhouette. A heavy fabric — wool crepe, duchess satin, heavy linen — will naturally create defined shapes, clean lines, clear geometric forms. A light fabric — silk georgette, chiffon, fine cotton voile — will always move toward the body, revealing and draping rather than sculpting.</p>

      <h3>What clients should know before commissioning</h3>
      <p>You don't need to know the technical names. What you need is to know how you want to feel wearing the piece. Do you want to feel held — supported, structured, contained? Or do you want to feel free — light, moving, barely-there? Those two sensory preferences will take you directly to the right material family, and from there, the choice becomes obvious.</p>

      <p>The most common commissioning error is choosing a fabric based on how it looks in photographs rather than how it feels to wear. Photography flatters almost everything. The body tells you the truth. Request samples. Drape them over your arm. Hold them against your skin. The right fabric announces itself.</p>
    `
  },
  'proportion': {
    category: 'Styling Guide',
    date: 'April 2025',
    title: 'Proportion as Language: Why Fit Communicates Before You Speak',
    content: `
      <p>Before a word is spoken, before eye contact is made, a room has already received information about you. That information was transmitted by your clothing — not by its label, not by its price, but by how it fits your body.</p>

      <h3>The grammar of silhouette</h3>
      <p>Proportion in clothing operates like grammar in language: when it's right, it disappears. When it's wrong, it's all anyone notices. A jacket whose shoulders are a centimetre too wide reads as borrowed. A trouser whose hem grazes the floor creates an unbroken line from waist to ground — elongating, dignifying, completing.</p>

      <blockquote>"The goal of perfect fit is invisibility. The garment should be the first thing people notice and the last thing they can describe."</blockquote>

      <h3>The three proportional relationships</h3>
      <p>In any outfit, there are three proportional relationships that matter most: the relationship between the garment and the body (fit), the relationship between different garments in an ensemble (balance), and the relationship between the garment and the occasion (scale).</p>

      <p>Bespoke commissioning addresses all three simultaneously. The piece is made to your exact measurements, designed for a specific occasion, and considered as a complete composition rather than an isolated garment.</p>
    `
  },
  'aso-oke': {
    category: 'Culture',
    date: 'April 2025',
    title: 'Aso-Oke Reimagined: Heritage Weaving in the Contemporary Wardrobe',
    content: `
      <p>The master weaver sits at a narrow-band loom in Iseyin, Oyo State, and does what his father did, and his grandfather before that: he interlaces cotton and silk threads at a pace that produces approximately half a metre of fabric per working day. The strip is twenty centimetres wide. Dozens of such strips will be sewn together to form a complete cloth.</p>

      <h3>The tradition</h3>
      <p>Aso-Oke — àṣọ oke, meaning "top cloth" — has been woven in Yorubaland for centuries. It is a ceremonial fabric: worn for naming ceremonies, engagements, weddings, chieftaincy installations. To wear aso-oke is to participate in a visual language older than photography, older than the colonial disruption of West African dress culture.</p>

      <blockquote>"Aso-oke is not decorative. It is declarative. It says: I am from somewhere, and I know it."</blockquote>

      <h3>The reinvention</h3>
      <p>At Livna, we have been working with weavers in Iseyin to commission aso-oke in non-traditional colourways and adapted weights — fabrics that carry the structure and heritage of the traditional cloth while responding to contemporary silhouettes. The result is garments that are neither costume nor pastiche. They are something more honest: clothing that knows where it comes from and chooses to move forward without apology.</p>
    `
  },
  'invisible-work': {
    category: 'Craft',
    date: 'March 2025',
    title: 'The Invisible Work: What Happens Between Sketch and Seam',
    content: `
      <p>The design sketch is the part everyone sees. It lives on mood boards, gets photographed and shared, circulates as proof that something extraordinary is coming. What no one sees is the three days of pattern-making that follows — and whether it's good or not will determine whether the sketch ever becomes what was promised.</p>

      <h3>Pattern-making as translation</h3>
      <p>A sketch exists in two dimensions. A body exists in three. Pattern-making is the discipline of translation between these states — and it is far more mathematical than it appears, and far more intuitive than mathematics alone can capture.</p>

      <p>The pattern-maker works from measurements, but measurements alone cannot produce a good-fitting garment. They must account for ease (the space built in for movement and comfort), grain (how the fabric aligns with the body's lines), and intention (how the designer wants the garment to behave when worn).</p>

      <blockquote>"A pattern is a theory. The toile is the test. The final garment is the conclusion — but only if you were honest with the first two."</blockquote>

      <h3>The toile and why it matters</h3>
      <p>Before a single length of the actual fabric is cut, Livna makes a toile: a test version of the garment in inexpensive calico or cotton muslin. The client tries it on. We mark, pin, redraw, rip apart, and remake until the fit is correct in every dimension. Only then does the real fabric come out.</p>

      <p>This process adds days to a commission. Some ateliers skip it for simpler pieces. We rarely do — because the toile is where problems are cheap and where the difference between approximate and extraordinary is discovered.</p>
    `
  },
  'trend-resistance': {
    category: 'Trends',
    date: 'March 2025',
    title: 'What Endures: On Trend-Resistance and Building a Lasting Wardrobe',
    content: `
      <p>The fashion calendar now runs at a pace designed to produce anxiety. Where once there were two seasons, now there are six, eight, fifty-two. Fast fashion has reduced the concept of a season to a week. Microtrends are born and buried on social media in days.</p>

      <h3>The argument against trends</h3>
      <p>This essay is not an argument against change or novelty. It is an argument against dressing reactively — against building a wardrobe that is permanently chasing something rather than being something. The most beautifully dressed people you have ever met were not the most trend-aware. They were the most self-aware.</p>

      <blockquote>"A trend tells you what the market wants you to wear. A bespoke commission tells you what you actually want to wear. These are rarely the same thing."</blockquote>

      <h3>What bespoke commissioning actually does</h3>
      <p>When you commission a piece, you are making an explicit decision about what you want to exist in the world. That decision is based on your life — your occasions, your body, your preferences — not on what a brand needs to shift this quarter. The result is a garment that has no expiry date, because it was never oriented toward a calendar to begin with.</p>

      <p>The clients who build the most beautiful bespoke wardrobes are not the ones who come to us most frequently. They are the ones who come most intentionally — once or twice a year, with clarity about what they need and why.</p>
    `
  },
  'colour-contrast': {
    category: 'Styling',
    date: 'February 2025',
    title: 'Colour and Contrast: The Atelier\'s Theory of the Tonal Palette',
    content: `
      <p>There is a misconception that monochromatic or tonal dressing is the safe choice — the retreat of those who lack the courage for colour. We hold the opposite view. Tonal dressing is the most sophisticated choice you can make, and the most difficult to execute well.</p>

      <h3>Why tone works</h3>
      <p>When an outfit operates within a single colour family, the eye stops reading the clothing and starts reading the person inside it. Posture becomes more visible. Movement becomes more noticeable. The face takes precedence. This is why tonal dressing photographs so exceptionally — there is nothing competing with the subject.</p>

      <blockquote>"Colour is attention. Tonal dressing is presence. You choose one or the other."</blockquote>

      <h3>Contrast as punctuation</h3>
      <p>Within a tonal palette, contrast becomes punctuation rather than declaration. A slightly darker belt. A shoe in the same family but three shades richer. The only visible seam in ivory-on-ivory. These micro-contrasts reward close attention — they are the language of someone who dresses for the pleasure of it, not the performance.</p>

      <p>Our advice: build your commissioned wardrobe first in one colour family. Ivory, obsidian, or the warm neutrals between them. Once that foundation is established, anything you add to it will work — because the tonal base does not compete.</p>
    `
  }
};

function openArticle(id) {
  const data = articles[id];
  if (!data) return;

  const drawer  = document.getElementById('article-drawer');
  const content = document.getElementById('article-content');

  content.innerHTML = `
    <div class="article-body">
      <div class="journal__card-meta" style="margin-bottom:12px;">
        <span class="journal__cat-tag">${data.category}</span>
        <span class="advice-date">${data.date}</span>
      </div>
      <h2 id="article-title">${data.title}</h2>
      <div class="divider divider-left" style="margin: 20px 0 28px;"></div>
      ${data.content}
      <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid var(--ash-xlt);">
        <p class="eyebrow" style="margin-bottom: 12px;">Inspired by what you've read?</p>
        <a href="order.html" class="btn btn-primary" style="display:inline-flex;">
          Commission a Piece <span class="btn-icon" aria-hidden="true"></span>
        </a>
      </div>
    </div>
  `;

  drawer.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  document.getElementById('article-drawer').style.display = 'none';
  document.body.style.overflow = '';
}

/* ─── STYLE QUIZ ────────────────────────────────────────────── */
const quizQuestions = [
  {
    q: 'When you walk into a room, you want people to feel...',
    options: [
      { letter: 'A', text: 'Drawn toward you — an effortless magnetism' },
      { letter: 'B', text: 'A little unsettled — in the best way' },
      { letter: 'C', text: 'Immediately at ease, as if you belong everywhere' },
      { letter: 'D', text: 'Respectful — that you are a person of substance' }
    ]
  },
  {
    q: 'Your ideal evening begins...',
    options: [
      { letter: 'A', text: 'At a private dinner where the conversation is the event' },
      { letter: 'B', text: 'At an opening — art, music, theatre, anything alive' },
      { letter: 'C', text: 'Anywhere outside, warm, with people you love' },
      { letter: 'D', text: 'At a formal event that requires you to rise to it' }
    ]
  },
  {
    q: 'The fabric you reach for first is...',
    options: [
      { letter: 'A', text: 'Silk — for the way it moves when you do' },
      { letter: 'B', text: 'Velvet — for its depth and drama' },
      { letter: 'C', text: 'Linen — for its honest simplicity' },
      { letter: 'D', text: 'Wool — for its quiet authority' }
    ]
  },
  {
    q: 'Your palette is...',
    options: [
      { letter: 'A', text: 'Ivory, champagne, cream — warm and luminous' },
      { letter: 'B', text: 'Midnight, deep wine, indigo — nothing pale' },
      { letter: 'C', text: 'Earth tones, sand, terracotta — rooted' },
      { letter: 'D', text: 'Black, navy, slate — precise and considered' }
    ]
  },
  {
    q: 'A silhouette you return to is...',
    options: [
      { letter: 'A', text: 'Draped and fluid — fabric that moves with you' },
      { letter: 'B', text: 'Architectural — something that holds its own shape' },
      { letter: 'C', text: 'Relaxed and generous — ease without shapelessness' },
      { letter: 'D', text: 'Tailored and exact — not one centimetre wasted' }
    ]
  }
];

const quizResults = {
  A: {
    label: 'The Luminous',
    title: 'Fluid Elegance',
    desc: 'You dress with a quiet conviction that needs no announcement. Your aesthetic gravitates toward light-catching fabrics, fluid silhouettes, and a palette built from warmth. You understand that the most powerful presence is the one that seems entirely effortless.',
    materials: ['Silk Charmeuse', 'Silk Chiffon', 'Duchess Satin', 'Fine Lace']
  },
  B: {
    label: 'The Dramatic',
    title: 'Dark Couture',
    desc: 'You are drawn to fashion as theatre. Your aesthetic is bold, dimensional, and unapologetic. Deep colours, tactile fabrics, strong silhouettes — you dress as a statement, not a question.',
    materials: ['Velvet', 'Wool Crepe', 'Heavy Silk', 'Structured Linen']
  },
  C: {
    label: 'The Artisan',
    title: 'Considered Casual',
    desc: 'Your aesthetic is rooted in honesty. Fabrics that show their nature, silhouettes that allow movement, colours drawn from the earth. You dress with warmth — and the people around you feel it.',
    materials: ['Belgian Linen', 'Organic Cotton', 'Aso-Oke', 'Washed Silk']
  },
  D: {
    label: 'The Architect',
    title: 'Structural Authority',
    desc: 'Your clothing is precise. Every detail is considered, nothing is accidental. You gravitate toward clean lines, structured silhouettes, and materials that hold their form. You dress as if you know exactly what you're doing — because you do.',
    materials: ['Wool Crepe', 'Double-weave Wool', 'Heavy Cotton', 'Crisp Linen']
  }
};

let quizStep    = 0;
let quizAnswers = [];

function launchQuiz() {
  quizStep    = 0;
  quizAnswers = [];
  const modal = document.getElementById('quiz-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  renderQuizStep();
}

function renderQuizStep() {
  const content = document.getElementById('quiz-content');
  if (quizStep >= quizQuestions.length) {
    renderQuizResult();
    return;
  }

  const q = quizQuestions[quizStep];
  const optionsHTML = q.options.map(o => `
    <button class="quiz-option" onclick="selectQuizOption('${o.letter}', this)" aria-label="Option ${o.letter}: ${o.text}">
      <span class="quiz-option-letter">${o.letter}</span>
      <span class="quiz-option-text">${o.text}</span>
    </button>
  `).join('');

  content.innerHTML = `
    <div class="quiz-question">
      <p class="quiz-q-num">Question ${quizStep + 1} of ${quizQuestions.length}</p>
      <p class="quiz-q-text">${q.q}</p>
    </div>
    <div class="quiz-options" role="group" aria-label="Quiz options">
      ${optionsHTML}
    </div>
    <div class="quiz-nav">
      <span class="quiz-progress-text">${quizStep + 1} / ${quizQuestions.length}</span>
      <button class="btn btn-outline" id="quiz-next" onclick="advanceQuiz()" disabled style="opacity:0.4;">
        Next <span class="btn-icon" aria-hidden="true"></span>
      </button>
    </div>
  `;
}

function selectQuizOption(letter, el) {
  document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  quizAnswers[quizStep] = letter;
  const nextBtn = document.getElementById('quiz-next');
  if (nextBtn) { nextBtn.disabled = false; nextBtn.style.opacity = '1'; }
}

function advanceQuiz() {
  if (quizAnswers[quizStep] === undefined) return;
  quizStep++;
  renderQuizStep();
}

function renderQuizResult() {
  // Count most frequent answer
  const tally = {};
  quizAnswers.forEach(a => { tally[a] = (tally[a] || 0) + 1; });
  const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
  const result = quizResults[winner] || quizResults['A'];

  const content = document.getElementById('quiz-content');
  const tagsHTML = result.materials.map(m => `<span class="quiz-result__mat-tag">${m}</span>`).join('');

  content.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result__badge">${result.label}</div>
      <p class="quiz-result__title">${result.title}</p>
      <div class="divider" style="margin: 16px auto;"></div>
      <p class="quiz-result__desc">${result.desc}</p>
      <div class="quiz-result__materials">
        <p class="eyebrow">Recommended materials</p>
        <div class="quiz-result__mat-tags">${tagsHTML}</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:12px;">
        <a href="order.html" class="btn btn-primary" style="justify-content:center;" onclick="closeQuiz()">
          Commission with this direction <span class="btn-icon" aria-hidden="true"></span>
        </a>
        <button class="btn btn-outline" onclick="launchQuiz()" style="justify-content:center;">
          Retake Quiz
        </button>
      </div>
    </div>
  `;
}

function closeQuiz() {
  document.getElementById('quiz-modal').style.display = 'none';
  document.body.style.overflow = '';
}

// Close modals on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeQuiz();
    closeArticle();
  }
});
