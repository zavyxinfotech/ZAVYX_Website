/* =========================================================
   ZAVYX INFOTECH — shared front-end behaviour
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Lucide Icons Initialization ---------- */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ---------- navbar text character split for sequential hover rotation ---------- */
  function initNavCharRotation() {
    document.querySelectorAll('.nav-links > li > a').forEach(function(link) {
      if (link.querySelector('.nav-char')) return;
      var nodes = Array.from(link.childNodes);
      link.innerHTML = '';
      var textWrapper = document.createElement('span');
      textWrapper.className = 'nav-text-wrapper';
      var charIndex = 0;
      nodes.forEach(function(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          var text = node.textContent.trim();
          for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch === ' ') {
              textWrapper.appendChild(document.createTextNode('\u00A0'));
            } else {
              var span = document.createElement('span');
              span.className = 'nav-char';
              span.textContent = ch;
              span.style.animationDelay = (charIndex * 0.04) + 's';
              textWrapper.appendChild(span);
              charIndex++;
            }
          }
        } else {
          link.appendChild(node);
        }
      });
      link.insertBefore(textWrapper, link.firstChild);
    });
  }
  initNavCharRotation();

  /* ---------- mobile nav toggle & sidebar close ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle && navToggle.children.length === 0) {
    navToggle.innerHTML = '<span></span><span></span><span></span>';
  }
  var navLinks = document.querySelector('.nav-links');
  var navClose = document.querySelector('.nav-close');

  if (navLinks && !document.querySelector('.mobile-call-now')) {
    var callLi = document.createElement('li');
    callLi.className = 'mobile-call-now';
    callLi.innerHTML = '<a href="tel:+916382721178" class="mobile-call-now-btn"><i data-lucide="phone" style="width: 18px; margin-right: 6px;"></i> Call Now</a>';
    navLinks.appendChild(callLi);
  }

  function closeMobileNav() {
    if (navLinks) navLinks.classList.remove('open');
    var navServices = document.querySelector('.nav-services');
    if (navServices) navServices.classList.remove('open');
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
  }

  if (navClose) {
    navClose.addEventListener('click', function (e) {
      e.stopPropagation();
      closeMobileNav();
    });
  }

  // Close nav on clicking outside
  document.addEventListener('click', function (e) {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!navLinks.contains(e.target) && (!navToggle || !navToggle.contains(e.target))) {
        closeMobileNav();
      }
    }
  });

  // Close sidebar on clicking link items
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (link.classList.contains('nav-services-btn') && (navLinks.classList.contains('open') || window.innerWidth <= 960)) {
          return; // Let Services toggle handler work
        }
        closeMobileNav();
      });
    });
  }

  // tap "Services" to expand mega menu in mobile drawer or mobile screen
  var navServices = document.querySelector('.nav-services');
  if (navServices) {
    var svcLink = navServices.querySelector('.nav-services-btn');
    if (svcLink) {
      svcLink.addEventListener('click', function (e) {
        if ((navLinks && navLinks.classList.contains('open')) || window.innerWidth <= 960) {
          e.preventDefault();
          navServices.classList.toggle('open');
        }
      });
    }
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, section');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        } else {
          // Remove the class when leaving the viewport to animate elements out
          entry.target.classList.remove('in');
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- laptop showcase observer ---------- */
  var laptopShowcase = document.getElementById('laptopShowcase');
  if (laptopShowcase && 'IntersectionObserver' in window) {
    var laptopObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, { threshold: 0.25 });
    laptopObserver.observe(laptopShowcase);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      item.closest('.faq-list') && item.closest('.faq-list').querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- floating action stack & chatbot trigger ---------- */
  var fabStack = document.querySelector('.fab-stack');
  var fabMain = document.querySelector('.fab-main');
  var fabBotTrigger = document.querySelector('.fab-bot-trigger');
  var chatPanel = document.querySelector('.chat-panel');
  var chatClose = document.querySelector('.chat-close');

  function toggleChat() {
    if (chatPanel) {
      if (chatPanel.classList.contains('open')) {
        chatPanel.classList.remove('open');
        if (fabStack) fabStack.classList.remove('chat-open');
      } else {
        chatPanel.classList.add('open');
        if (fabStack) fabStack.classList.add('chat-open');
      }
    }
  }

  function closeChat() {
    if (fabStack) fabStack.classList.remove('chat-open');
    if (chatPanel) chatPanel.classList.remove('open');
  }

  if (fabBotTrigger) {
    fabBotTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      toggleChat();
    });
  }

  if (fabMain) {
    fabMain.addEventListener('click', function (e) {
      e.preventDefault();
      toggleChat();
    });
  }
  if (chatClose) chatClose.addEventListener('click', closeChat);

  /* ---------- chatbot auto-reply (Zedex AI Assistant & WhatsApp Integration) ---------- */
  var chatBody = document.querySelector('.chat-body');
  var chatInput = document.querySelector('.chat-foot input');
  var chatSend = document.querySelector('.chat-foot button');
  var quickReplyWrap = document.querySelector('.quick-replies');

  var KB = [
    {
      match: ['service', 'services', 'what do you do', 'offer'],
      reply: 'We build Websites & Web Apps, E-commerce Stores, CRM & ERP Systems, WhatsApp API & Bots, AI & Automation, Mobile Apps, Digital Marketing & SEO, Branding & Creative, and Cloud & Infrastructure.'
    },
    {
      match: ['contact', 'phone', 'number', 'call', 'reach'],
      reply: 'You can call or WhatsApp us directly at <b>+91 63827 21178</b>, or email <b>hello@zavyx.in</b>. Our team responds promptly!'
    },
    {
      match: ['location', 'address', 'where', 'office'],
      reply: 'Our headquarters are located at #2155, Fortune City, Global Market – Texvalley, NH 544 Bengaluru–Cochin National Highway, Chithode, Erode – 638102, Tamil Nadu, India.'
    },
    {
      match: ['hour', 'timing', 'open', 'time'],
      reply: 'Our office hours are Monday–Friday, 9:30 AM – 6:00 PM IST. WhatsApp messages are monitored 24/7!'
    },
    {
      match: ['quote', 'price', 'cost', 'pricing', 'budget'],
      reply: 'We customize estimates based on your exact project requirements. Click below to message our team on WhatsApp for an instant quote!'
    },
    {
      match: ['whatsapp'],
      reply: 'Connect directly with us on WhatsApp at <b>+91 63827 21178</b> or click the WhatsApp button below.'
    },
    {
      match: ['hi', 'hello', 'hey', 'zedex'],
      reply: 'Hi! 👋 I\'m <b>Zedex</b>, your ZAVYX AI assistant. How can I help you today? Type your query below or connect directly on WhatsApp!'
    }
  ];

  function botReply(text) {
    var lower = text.toLowerCase();
    var found = KB.find(function (k) {
      return k.match.some(function (m) { return lower.indexOf(m) !== -1; });
    });
    return found ? found.reply : 'Thanks for reaching out! For instant support and detailed project pricing, click below to chat with our team on WhatsApp.';
  }

  function addMsg(text, who, userQueryForWa) {
    if (!chatBody) return;
    var div = document.createElement('div');
    div.className = 'msg ' + who;
    div.innerHTML = text;

    if (who === 'bot' && userQueryForWa) {
      var waUrl = 'https://wa.me/916382721178?text=' + encodeURIComponent('Hello Zedex & ZAVYX Team, ' + userQueryForWa);
      var waBtn = document.createElement('div');
      waBtn.style.marginTop = '8px';
      waBtn.innerHTML = '<a href="' + waUrl + '" target="_blank" rel="noopener" class="msg-wa-btn"><i data-lucide="message-square" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"></i> Chat on WhatsApp</a>';
      div.appendChild(waBtn);
    }

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function handleUserText(text) {
    if (!text || !text.trim()) return;
    var queryText = text.trim();
    addMsg(queryText, 'user');
    if (chatInput) chatInput.value = '';

    // Show typing animation
    var typingDiv = document.createElement('div');
    typingDiv.className = 'msg bot typing-indicator';
    typingDiv.innerHTML = '<span style="opacity:0.75;font-style:italic;font-size:0.82rem;">Zedex is typing...</span>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(function () {
      if (typingDiv.parentNode) typingDiv.parentNode.removeChild(typingDiv);
      var replyText = botReply(queryText);
      addMsg(replyText, 'bot', queryText);
    }, 450);
  }

  if (chatSend && chatInput) {
    chatSend.addEventListener('click', function () { handleUserText(chatInput.value); });
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleUserText(chatInput.value);
    });
  }

  if (quickReplyWrap) {
    quickReplyWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.qr-btn');
      if (!btn) return;
      handleUserText(btn.textContent);
    });
  }

  /* ---------- contact form (demo only — no backend) ---------- */
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type=submit]');
      var original = btn.textContent;
      btn.textContent = 'Sending...';
      setTimeout(function () {
        btn.textContent = 'Message sent ✓';
        contactForm.reset();
        setTimeout(function () { btn.textContent = original; }, 2500);
      }, 900);
    });
  }

  /* ---------- page transitions & preloader ---------- */
  var preloader = document.getElementById('zvx-preloader');
  
  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('preload-fade-out');
      preloader.classList.remove('preload-fade-in');
      document.body.classList.remove('preload-active');
    }
  }

  // Hide preloader when window has fully loaded
  window.addEventListener('load', hidePreloader);

  // Safety fallback in case loading event is delayed
  setTimeout(hidePreloader, 2500);

  // Intercept internal link click transitions
  document.querySelectorAll('a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    var isExternal = href.indexOf('http') === 0 && href.indexOf(window.location.origin) !== 0;
    var isAnchor = href.startsWith('#');
    var isSpecial = href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:');
    var isNewTab = link.getAttribute('target') === '_blank';

    if (isExternal || isAnchor || isSpecial || isNewTab) return;
    
    // Ignore dropdown services toggles on mobile
    if (link.classList.contains('nav-services-btn') && window.innerWidth <= 960) return;

    link.addEventListener('click', function (e) {
      var targetUrl = link.href;

      // Handle anchor links on the current page smoothly without preloader
      if (link.pathname === window.location.pathname && link.hash) {
        var targetEl = document.querySelector(link.hash);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, null, link.hash);
          return;
        }
      }

      // Skip if clicking exact same page URL
      if (targetUrl === window.location.href || targetUrl === window.location.href + '#') return;
      
      e.preventDefault();

      if (preloader) {
        document.body.classList.add('preload-active');
        preloader.classList.remove('preload-fade-out');
        preloader.classList.add('preload-fade-in');
        
        setTimeout(function () {
          window.location.href = targetUrl;
        }, 400); 
      } else {
        window.location.href = targetUrl;
      }
    });
  });

  /* ---------- sticky scrolled navbar handler ---------- */
  var navbar = document.querySelector('.navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ---------- pinned 3d what we do scroll animation ---------- */
  function initPinnedWhatWeDo() {
    var track = document.getElementById('wwdTrack');
    var stageTitle = document.getElementById('wwdStageTitle');
    var stage3D = document.getElementById('wwdStage3D');
    var stageCards = document.getElementById('wwdStageCards');
    var cardItems = document.querySelectorAll('.wwd-card-item');
    var currentStepEl = document.getElementById('wwdCurrentStep');
    var progressFill = document.getElementById('wwdProgressFill');
    var dotsNav = document.getElementById('wwdDotsNav');

    if (!track || !stageTitle || !stage3D || !stageCards || !cardItems.length) return;

    // Generate Dots Navigation
    if (dotsNav && !dotsNav.children.length) {
      cardItems.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'wwd-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to service ' + (i + 1));
        dot.addEventListener('click', function () {
          var trackTop = track.getBoundingClientRect().top + window.scrollY;
          var trackHeight = track.offsetHeight - window.innerHeight;
          var stepProgress = 0.26 + (i / 9) * 0.70;
          window.scrollTo({ top: trackTop + stepProgress * trackHeight, behavior: 'smooth' });
        });
        dotsNav.appendChild(dot);
      });
    }

    function onScroll() {
      var rect = track.getBoundingClientRect();
      var trackHeight = track.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      var progress = -rect.top / trackHeight;
      progress = Math.max(0, Math.min(1, progress));

      // Phase 1: Large Title
      if (progress < 0.20) {
        var titleOpacity = progress < 0.12 ? 1 : 1 - ((progress - 0.12) / 0.08);
        var titleScale = 1 - (progress / 0.20) * 0.15;
        stageTitle.style.opacity = Math.max(0, titleOpacity);
        stageTitle.style.transform = 'translate(-50%, -50%) scale(' + Math.max(0.85, titleScale) + ')';
        stageTitle.style.pointerEvents = progress < 0.14 ? 'auto' : 'none';
      } else {
        stageTitle.style.opacity = 0;
        stageTitle.style.pointerEvents = 'none';
      }

      // Phase 2: 3D Laptop Centerpiece -> Position on LEFT side (desktop) or TOP row (mobile)
      if (progress >= 0.12) {
        var laptopOpacity = Math.min(1, (progress - 0.12) / 0.08);
        stage3D.style.opacity = laptopOpacity;

        if (progress >= 0.24) {
          if (window.innerWidth > 960) {
            stage3D.style.transform = 'translateX(-260px) translateY(0) scale(0.85)';
          } else {
            stage3D.style.transform = 'translateY(165px) scale(0.72)';
          }
        } else {
          // Laptop in Center position for initial reveal
          stage3D.style.transform = 'translateX(0) translateY(0) scale(1)';
        }
      } else {
        stage3D.style.opacity = 0;
      }

      // Phase 3: Service Cards Showcase One By One on the RIGHT Side
      if (progress >= 0.24) {
        stageCards.classList.add('active');

        var cardProgress = (progress - 0.24) / 0.72;
        cardProgress = Math.max(0, Math.min(0.99, cardProgress));
        var cardIndex = Math.floor(cardProgress * 9);
        cardIndex = Math.min(8, Math.max(0, cardIndex));

        cardItems.forEach(function (card, i) {
          if (i === cardIndex) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });

        if (dotsNav) {
          var dots = dotsNav.querySelectorAll('.wwd-dot');
          dots.forEach(function (d, i) {
            d.classList.toggle('active', i === cardIndex);
          });
        }

        if (currentStepEl) {
          currentStepEl.textContent = (cardIndex + 1 < 10 ? '0' : '') + (cardIndex + 1);
        }
        if (progressFill) {
          progressFill.style.width = Math.round(((cardIndex + 1) / 9) * 100) + '%';
        }
      } else {
        stageCards.classList.remove('active');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  initPinnedWhatWeDo();

  /* ---------- Pinned Process Timeline Scroll Handler ---------- */
  function initPinnedProcessSection() {
    var processTracks = document.querySelectorAll('.process-pinned-track');
    if (!processTracks.length) return;

    function onScroll() {
      processTracks.forEach(function (track) {
        var rect = track.getBoundingClientRect();
        var trackHeight = track.offsetHeight - window.innerHeight;
        if (trackHeight <= 0) return;

        var progress = -rect.top / trackHeight;
        progress = Math.max(0, Math.min(1, progress));

        var steps = track.querySelectorAll('.process-wave-step');
        var totalSteps = steps.length || 5;
        var activeIndex = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));
        var lineActive = track.querySelector('.process-line-active');
        var fillBar = track.querySelector('.indicator-fill');
        var stepNumEl = track.querySelector('.current-step-num');

        steps.forEach(function (step, i) {
          if (i <= activeIndex) {
            step.classList.add('step-active');
          } else {
            step.classList.remove('step-active');
          }
        });

        var linePct = totalSteps > 1 ? (activeIndex / (totalSteps - 1)) * 100 : 100;
        if (lineActive) {
          if (window.innerWidth <= 992) {
            lineActive.style.height = linePct + '%';
            lineActive.style.width = '4px';
          } else {
            lineActive.style.width = linePct + '%';
            lineActive.style.height = '6px';
          }
        }

        if (fillBar) {
          fillBar.style.width = Math.min(100, Math.max(10, Math.round(((activeIndex + 1) / totalSteps) * 100))) + '%';
        }

        if (stepNumEl) {
          stepNumEl.textContent = (activeIndex + 1 < 10 ? '0' : '') + (activeIndex + 1);
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  initPinnedProcessSection();
});

