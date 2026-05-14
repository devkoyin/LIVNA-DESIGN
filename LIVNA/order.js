/* ============================================================
   LIVNA — Commission Form JavaScript
   Multi-step form, validation, email confirmation via EmailJS
   ============================================================ */

/* ─── EMAILJS CONFIGURATION ─────────────────────────────────
   EmailJS allows client-side email sending without a backend.
   Integration steps:
   1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
   2. Create a service (Gmail, Outlook, etc.)
   3. Create an email template using the variables listed below
   4. Replace the placeholder values below with your actual IDs

   Template variables available:
   {{to_email}}     — customer's email address
   {{customer_name}} — customer's full name
   {{order_ref}}    — auto-generated reference number
   {{occasion}}     — event type
   {{garment_type}} — type of garment requested
   {{style}}        — style direction selected
   {{materials}}    — comma-separated material preferences
   {{color_brief}}  — colour description
   {{bust}}, {{waist}}, {{hips}}, {{height}}, {{shoulder}}
   {{inseam}}       — length preference
   {{size_notes}}   — fit notes
   {{design_vision}} — full design description
   {{deadline}}     — desired completion date
   {{budget}}       — budget range
   {{submission_date}} — timestamp of submission

   Recommended template subject:
   "Your Livna Commission Brief — Ref: {{order_ref}}"

   For production: move to a server-side function (Node.js/Vercel)
   to protect your EmailJS credentials.
   ─────────────────────────────────────────────────────────── */
const EMAILJS_CONFIG = {
  serviceId:  'YOUR_SERVICE_ID',   // e.g. 'service_abc123'
  templateId: 'YOUR_TEMPLATE_ID',  // e.g. 'template_xyz789'
  publicKey:  'YOUR_PUBLIC_KEY'    // e.g. 'AbCdEfGh1234567'
};

/* ─── STEP NAVIGATION ───────────────────────────────────────── */
let currentStep = 1;
const totalSteps = 4;

function nextStep(step) {
  if (!validateStep(currentStep)) return;
  goToStep(step);
}

function prevStep(step) {
  goToStep(step);
}

function goToStep(step) {
  // Hide current panel
  const currentPanel = document.getElementById(`step-${currentStep}-panel`);
  if (currentPanel) {
    currentPanel.classList.remove('active');
    currentPanel.hidden = true;
  }

  // Show new panel
  const nextPanel = document.getElementById(`step-${step}-panel`);
  if (nextPanel) {
    nextPanel.classList.add('active');
    nextPanel.hidden = false;
  }

  // Update step indicators
  document.querySelectorAll('.form-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'complete');
    if (s === step) el.classList.add('active');
    if (s < step)   el.classList.add('complete');
  });

  // Update progress bar
  const progress = (step / totalSteps) * 100;
  document.getElementById('progress-bar').style.width = progress + '%';

  // Update label
  const labels = {
    1: 'Step 1 of 4 — About You',
    2: 'Step 2 of 4 — Design Vision',
    3: 'Step 3 of 4 — Your Sizing',
    4: 'Step 4 of 4 — Final Details'
  };
  document.getElementById('step-label').textContent = labels[step] || '';

  // Scroll to form top
  document.querySelector('.commission-form-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  currentStep = step;
}

/* ─── VALIDATION ────────────────────────────────────────────── */
function validateStep(step) {
  let valid = true;

  if (step === 1) {
    valid &= validateField('first-name',  v => v.trim().length > 0,    'Please enter your first name.');
    valid &= validateField('last-name',   v => v.trim().length > 0,    'Please enter your last name.');
    valid &= validateField('email',       v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address.');
    valid &= validateField('occasion',    v => v !== '',                'Please select an occasion.');
  }

  if (step === 2) {
    valid &= validateField('garment-type', v => v !== '', 'Please select a garment type.');
    const styleSelected = document.querySelector('input[name="style"]:checked');
    if (!styleSelected) {
      showToast('Please select a style direction.');
      valid = false;
    }
  }

  if (step === 4) {
    valid &= validateField('design-vision', v => v.trim().length >= 20, 'Please describe your vision (at least 20 characters).');
    const consent = document.getElementById('consent');
    if (consent && !consent.checked) {
      document.getElementById('consent-error').textContent = 'Please tick the box to continue.';
      valid = false;
    } else if (consent) {
      document.getElementById('consent-error').textContent = '';
    }
  }

  return Boolean(valid);
}

function validateField(id, rule, message) {
  const el = document.getElementById(id);
  if (!el) return true;
  const errEl = document.getElementById(id + '-error');
  if (rule(el.value)) {
    el.classList.remove('error');
    if (errEl) errEl.textContent = '';
    return true;
  } else {
    el.classList.add('error');
    if (errEl) errEl.textContent = message;
    return false;
  }
}

// Live validation on blur
document.querySelectorAll('input[required], select[required], textarea[required]').forEach(el => {
  el.addEventListener('blur', () => {
    el.classList.remove('error');
    const errEl = document.getElementById(el.id + '-error');
    if (errEl) errEl.textContent = '';
  });
});

/* ─── FORM SUBMISSION ───────────────────────────────────────── */
document.getElementById('commission-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateStep(4)) return;

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  const orderRef = 'LVN-' + Date.now().toString(36).toUpperCase().slice(-6);

  // Gather all form data
  const formData = {
    order_ref:      orderRef,
    customer_name:  `${getValue('first-name')} ${getValue('last-name')}`,
    to_email:       getValue('email'),
    phone:          getValue('phone') || 'Not provided',
    location:       getValue('location') || 'Not provided',
    occasion:       getOptionText('occasion'),
    garment_type:   getOptionText('garment-type'),
    style:          document.querySelector('input[name="style"]:checked')?.value || 'Not selected',
    materials:      [...document.querySelectorAll('input[name="material"]:checked')].map(i => i.value).join(', ') || 'Not specified',
    color_brief:    getValue('color-brief') || 'Not specified',
    bust:           getValue('size-bust') || '—',
    waist:          getValue('size-waist') || '—',
    hips:           getValue('size-hips') || '—',
    height:         getValue('size-height') || '—',
    shoulder:       getValue('size-shoulder') || '—',
    inseam:         getOptionText('size-inseam') || 'Not specified',
    size_notes:     getValue('size-notes') || 'None',
    design_vision:  getValue('design-vision'),
    deadline:       getValue('deadline') || 'Not specified',
    budget:         getOptionText('budget') || 'Not specified',
    referral:       getOptionText('referral') || 'Not specified',
    submission_date: new Date().toLocaleDateString('en-GB', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  };

  /* ── Attempt EmailJS send ───────────────────────────────── */
  let emailSent = false;

  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID') {
    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        formData,
        EMAILJS_CONFIG.publicKey
      );
      emailSent = true;
    } catch (err) {
      console.warn('EmailJS send failed:', err);
    }
  }

  /* ── Show success regardless (email is best-effort in demo) */
  document.getElementById('order-ref').textContent = orderRef;
  document.querySelector('.order-hero').style.display = 'none';
  const success = document.getElementById('order-success');
  success.style.display = 'flex';
  success.scrollIntoView({ behavior: 'smooth' });

  const msg = emailSent
    ? `Commission submitted! Reference: ${orderRef}. Check your email for confirmation.`
    : `Commission received. Reference: ${orderRef}. We'll be in touch within 48 hours.`;

  showToast(msg, 6000);

  /* ── Log brief to console for development visibility ─── */
  console.table(formData);
});

/* ─── HELPERS ───────────────────────────────────────────────── */
function getValue(id) {
  return document.getElementById(id)?.value.trim() || '';
}

function getOptionText(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  return el.options?.[el.selectedIndex]?.text || el.value;
}
