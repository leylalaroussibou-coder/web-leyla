    // === LÓGICA DE SPA Y SCROLLING ===
    const app = {
      views: ['view-home', 'view-annur', 'view-arriduan', 'view-madrasa', 'view-interesados', 'view-noticias', 'view-contacto'],
      
      showView: function(viewId, anchorId = null) {
        // Ocultar todas las vistas
        this.views.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.classList.remove('is-active');
            if (id === 'view-home') el.classList.add('is-hidden');
          }
        });
        
        // Mostrar la vista solicitada
        const activeView = document.getElementById(viewId);
        if (activeView) {
          activeView.classList.add('is-active');
          if (viewId === 'view-home') activeView.classList.remove('is-hidden');
        }

        // Si salimos de Arriduan, reiniciar el vídeo para detener audio
        if (viewId !== 'view-arriduan') {
          this.resetTributeVideo();
        }
        
        // Cerrar menú móvil si está abierto
        const nav = document.getElementById('site-nav');
        const toggle = document.querySelector('.nav-toggle');
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
        }
        if (toggle) {
          toggle.classList.remove('is-active');
          toggle.setAttribute('aria-expanded', 'false');
        }

        // Lógica de Scroll (con retraso sutil para permitir que el DOM se dibuje)
        setTimeout(() => {
          if (anchorId) {
            const targetEl = document.getElementById(anchorId);
            if (targetEl) {
              // Offset por la cabecera fija
              const y = targetEl.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          this.refreshScrollReveal();
        }, 50);
      },
      showHome: function() {
        this.showView('view-home');
      },
      playTributeVideo: function() {
        const container = document.getElementById('tribute-video-container');
        if (!container) return;

        // Al abrir la web como archivo local (file://), YouTube bloquea los vídeos incrustados (Error 153).
        // Si estamos en file://, abrimos el vídeo en YouTube y mostramos una tarjeta informativa.
        if (window.location.protocol === 'file:') {
          window.open('https://www.youtube.com/watch?v=1Kh6tzEc15o&t=63s', '_blank');
          container.innerHTML = `
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1B2321; color: #FFFFFF; padding: 1.5rem; text-align: center;">
              <i class="fa-brands fa-youtube" style="font-size: 2.8rem; color: #E62117; margin-bottom: 0.8rem;"></i>
              <strong style="font-size: 1.05rem; color: #FFFFFF;">Vídeo abierto en YouTube</strong>
              <p style="font-size: 0.85rem; color: #C3B291; margin-top: 0.4rem; max-width: 480px; line-height: 1.5;">Al abrir la web como archivo local (file://), las normas de seguridad de YouTube exigen verlo en su web. En cuanto tu web esté publicada en internet o en un servidor local, se reproducirá aquí directamente.</p>
              <div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
                <a href="https://www.youtube.com/watch?v=1Kh6tzEc15o&t=63s" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm"><i class="fa-solid fa-play"></i> Volver a abrir vídeo</a>
                <button onclick="app.resetTributeVideo()" class="btn btn-sm" style="background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.3);"><i class="fa-solid fa-rotate-left"></i> Restablecer portada</button>
              </div>
            </div>
          `;
          return;
        }

        // Si la web se abre con servidor (http:// o https://), se incrusta el reproductor directamente
        container.innerHTML = '<iframe src="https://www.youtube.com/embed/1Kh6tzEc15o?start=63&autoplay=1&rel=0" title="Primer vídeo de la construcción" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      },
      resetTributeVideo: function() {
        const container = document.getElementById('tribute-video-container');
        if (container && !container.querySelector('.video-preview-facade')) {
          container.innerHTML = `
            <div class="video-preview-facade" onclick="app.playTributeVideo()" role="button" aria-label="Reproducir vídeo de la construcción">
              <img src="https://img.youtube.com/vi/1Kh6tzEc15o/hqdefault.jpg" alt="Miniatura del vídeo de la construcción de la Mezquita Arriduan" loading="lazy" />
              <div class="video-play-btn"><i class="fa-solid fa-play"></i></div>
              <span class="video-preview-title"><i class="fa-brands fa-youtube" style="color: #ff4444; margin-right: 6px;"></i> Ver vídeo de la construcción</span>
            </div>
          `;
        }
      },
      goToMonthlyPrayerTimes: function() {
        this.showView('view-noticias', 'noticia-horarios-mes');
        const pillAll = document.querySelector('#newsFilters .filter-pill');
        if (pillAll) this.filterNews('all', pillAll);
        setTimeout(() => {
          const card = document.getElementById('noticia-horarios-mes');
          if (card) {
            card.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
            card.style.borderColor = 'var(--gold)';
            card.style.boxShadow = '0 0 0 3px rgba(179, 145, 83, 0.45), var(--shadow-lg)';
            setTimeout(() => {
              card.style.borderColor = '';
              card.style.boxShadow = '';
            }, 2500);
          }
        }, 250);
      },
      filterNews: function(category, btn) {
        const pills = document.querySelectorAll('.filter-pill');
        pills.forEach(p => p.classList.remove('active'));
        if (btn) btn.classList.add('active');
        
        const items = document.querySelectorAll('.news-item');
        items.forEach(item => {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.35s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      },
      openNewsModal: function(imgSrc, title, desc, actionUrl, actionLabel) {
        const modal = document.getElementById('news-doc-modal');
        const img = document.getElementById('news-modal-img');
        const titleEl = document.getElementById('news-modal-title');
        const descEl = document.getElementById('news-modal-desc');
        const btnEl = document.getElementById('news-modal-btn');
        const origLink = document.getElementById('news-modal-view-original');
        const zoomIcon = document.getElementById('news-zoom-icon');
        const hint = document.querySelector('.news-modal-img-hint');
        if (!modal) return;
        
        modal.classList.remove('is-fullscreen-image');
        if (zoomIcon) zoomIcon.className = 'fa-solid fa-expand';
        if (hint) hint.innerHTML = '<i class="fa-solid fa-magnifying-glass-plus"></i> Clic para pantalla completa';

        if (img) {
          img.src = imgSrc;
          img.alt = title || 'Comunicado oficial';
        }
        if (titleEl) titleEl.textContent = title || '';
        if (descEl) descEl.textContent = desc || '';
        if (origLink) origLink.href = imgSrc;

        if (btnEl) {
          if (actionUrl && actionLabel) {
            btnEl.href = actionUrl;
            btnEl.innerHTML = actionUrl.includes('wa.me') 
              ? `<i class="fa-brands fa-whatsapp"></i> ${actionLabel}`
              : (actionUrl.includes('maps') ? `<i class="fa-solid fa-location-dot"></i> ${actionLabel}` : `<i class="fa-solid fa-arrow-up-right-from-square"></i> ${actionLabel}`);
            btnEl.style.display = 'inline-flex';
          } else {
            btnEl.style.display = 'none';
          }
        }
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      },
      closeNewsModal: function(e) {
        if (e && e.target && e.target.closest && e.target.closest('.news-modal-content') && !e.target.closest('.news-modal-close')) {
          return;
        }
        const modal = document.getElementById('news-doc-modal');
        if (modal) {
          modal.style.display = 'none';
          modal.classList.remove('is-fullscreen-image');
          document.body.style.overflow = '';
        }
      },
      toggleModalZoom: function() {
        const modal = document.getElementById('news-doc-modal');
        const zoomIcon = document.getElementById('news-zoom-icon');
        const hint = document.querySelector('.news-modal-img-hint');
        if (modal) {
          const isFull = modal.classList.toggle('is-fullscreen-image');
          if (zoomIcon) {
            zoomIcon.className = isFull ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
          }
          if (hint) {
            hint.innerHTML = isFull 
              ? '<i class="fa-solid fa-compress"></i> Clic para vista normal'
              : '<i class="fa-solid fa-magnifying-glass-plus"></i> Clic para pantalla completa';
          }
        }
      },
      downloadNewsFile: function(fileUrl, title) {
        if (!fileUrl) return;
        const link = document.createElement('a');
        link.href = fileUrl;
        const ext = fileUrl.split('.').pop() || 'jpg';
        const cleanTitle = (title || 'comunicado-oficial')
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        link.download = `${cleanTitle}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Descargando: ' + cleanTitle + '.' + ext);
      },
      downloadCurrentNews: function() {
        const img = document.getElementById('news-modal-img');
        const titleEl = document.getElementById('news-modal-title');
        if (img && img.getAttribute('src')) {
          this.downloadNewsFile(img.getAttribute('src'), titleEl ? titleEl.textContent : 'comunicado');
        }
      },
      scrollObserver: null,
      initScrollReveal: function() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!('IntersectionObserver' in window)) return;

        this.scrollObserver = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
              setTimeout(() => {
                entry.target.style.transitionDelay = '';
              }, 900);
            }
          });
        }, {
          root: null,
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.08
        });

        // Contenedores con elementos en rejilla (efecto escalonado suave)
        const staggerContainers = [
          '.hub-grid',
          '.prayer-grid',
          '.news-grid',
          '.news-full-grid',
          '.pillars-grid',
          '.creators-grid',
          '.program-grid',
          '.activity-grid',
          '.gallery-grid',
          '.fases-grid',
          '.donation-cards'
        ];

        staggerContainers.forEach(selector => {
          document.querySelectorAll(selector).forEach(container => {
            Array.from(container.children).forEach((child, idx) => {
              child.classList.add('scroll-reveal');
              child.style.transitionDelay = `${Math.min(idx * 0.08, 0.45)}s`;
              this.scrollObserver.observe(child);
            });
          });
        });

        // Elementos individuales o bloques principales
        const singleSelectors = [
          '.section-head',
          '.urgent-banner',
          '.ayah-band',
          '.prayer-head',
          '.islam-intro-card',
          '.islam-quote-banner',
          '.guide-recommend-box',
          '.madrasa-showcase-wrap',
          '.enrol',
          '.contact-form',
          '.contact-info',
          '.news-subscribe-box',
          '.donation-help-card',
          '.media-card',
          '.mosaic-item'
        ];

        singleSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => {
            if (!el.classList.contains('scroll-reveal')) {
              el.classList.add('scroll-reveal');
              this.scrollObserver.observe(el);
            }
          });
        });
      },

      refreshScrollReveal: function() {
        if (!this.scrollObserver) return;
        setTimeout(() => {
          document.querySelectorAll('.view-section.is-active .scroll-reveal:not(.is-visible)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
              el.classList.add('is-visible');
              this.scrollObserver.unobserve(el);
              setTimeout(() => {
                el.style.transitionDelay = '';
              }, 900);
            }
          });
        }, 80);
      }
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        app.closeNewsModal();
      }
    });

    // Menú móvil toggle animado
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.getElementById('site-nav');
    if (navToggle && siteNav) {
      navToggle.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('is-open');
        navToggle.classList.toggle('is-active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    // Funcionalidad de Toast Feedback
    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-msg').textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4500);
    }

    // Copiar al portapapeles con feedback
    function copyToClipboard(text, label) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`¡${label} copiado al portapapeles!`);
        }).catch(() => fallbackCopy(text, label));
      } else {
        fallbackCopy(text, label);
      }
    }

    function fallbackCopy(text, label) {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.focus();
      temp.select();
      try {
        document.execCommand('copy');
        showToast(`¡${label} copiado!`);
      } catch (err) {
        prompt('Copia manualmente con Ctrl+C:', text);
      }
      document.body.removeChild(temp);
    }
    
    document.getElementById('contact-form')?.addEventListener('submit', e => {
      e.preventDefault();
      showToast('¡Mensaje enviado! Nuestro equipo te responderá pronto.');
      e.target.reset();
    });

    // === HORARIOS DE REZO API ===
    document.addEventListener("DOMContentLoaded", () => {
      async function iniciarHorariosRezo() {
        const fechaGregEl = document.getElementById('fecha-gregoriana');
        const fechaIslEl = document.getElementById('fecha-islamica');

        const hoy = new Date();
        if(fechaGregEl) {
          fechaGregEl.textContent = hoy.toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
          });
        }

        let horarios24 = { fajr: '06:32', shuruq: '08:01', dhuhr: '13:45', asr: '16:52', maghrib: '19:29', isha: '20:54' };

        try {
          const res = await fetch('https://api.aladhan.com/v1/timings?latitude=40.4567&longitude=-3.4697&method=3');
          const data = await res.json();
          if (data && data.data) {
            const t = data.data.timings;
            horarios24 = { fajr: t.Fajr.slice(0, 5), shuruq: t.Sunrise.slice(0, 5), dhuhr: t.Dhuhr.slice(0, 5), asr: t.Asr.slice(0, 5), maghrib: t.Maghrib.slice(0, 5), isha: t.Isha.slice(0, 5) };
            const h = data.data.date.hijri;
            if(fechaIslEl) fechaIslEl.textContent = `${h.day} ${h.month.en} ${h.year} H`;
          }
        } catch (e) {
          if(fechaIslEl) fechaIslEl.textContent = 'Calendario Islámico';
        }

        function formato12(hm) {
          const [H, M] = hm.split(':').map(Number);
          const ampm = H >= 12 ? 'PM' : 'AM';
          const h12 = H % 12 || 12;
          return { hora: `${String(h12).padStart(2, '0')}:${String(M).padStart(2, '0')}`, ampm };
        }

        Object.entries(horarios24).forEach(([id, valor]) => {
          const spanHora = document.getElementById(id);
          if (spanHora) {
            const f = formato12(valor);
            spanHora.textContent = f.hora;
            const ampmSpan = spanHora.parentElement.querySelector('.ampm');
            if (ampmSpan) ampmSpan.textContent = f.ampm;
          }
        });

        const ordenRezos = ['fajr', 'shuruq', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const relojEl = document.getElementById('reloj-cuenta-atras');

        function actualizarCuentaAtras() {
          const ahora = new Date();
          let proximoId = null;
          let proximoDate = null;

          for (const id of ordenRezos) {
            const [h, m] = horarios24[id].split(':').map(Number);
            const candidato = new Date(ahora);
            candidato.setHours(h, m, 0, 0);
            if (candidato > ahora) { proximoId = id; proximoDate = candidato; break; }
          }

          if (!proximoDate) {
            proximoId = 'fajr';
            const [h, m] = horarios24.fajr.split(':').map(Number);
            proximoDate = new Date(ahora);
            proximoDate.setDate(proximoDate.getDate() + 1);
            proximoDate.setHours(h, m, 0, 0);
          }

          document.querySelectorAll('.rezo-caja').forEach(c => c.classList.remove('activo'));
          const cajaActiva = document.getElementById(`caja-${proximoId}`);
          if (cajaActiva) cajaActiva.classList.add('activo');

          const diff = Math.max(0, Math.floor((proximoDate - ahora) / 1000));
          const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
          const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
          const segs = String(diff % 60).padStart(2, '0');
          if (relojEl) relojEl.textContent = `${hrs}:${mins}:${segs}`;
        }

        actualizarCuentaAtras();
        setInterval(actualizarCuentaAtras, 1000);
      }

      iniciarHorariosRezo();
      app.initScrollReveal();
    });

    // CARRUSEL INTERACTIVO ARRIDUAN SCRIPT
    const arrCarousel = (function() {
      let currentIndex = 0;
      let timer = null;
      let isPaused = false;
      const slides = document.querySelectorAll('.arr-slide');
      const dotsContainer = document.getElementById('arrDots');
      const counter = document.getElementById('arrCounter');
      const frame = document.getElementById('arrCarouselFrame');
      const btnToggleFinal = document.getElementById('btnToggleFinal');
      const total = slides.length;
      const finalIndex = total - 1; // Última diapositiva: visión final
      let previousIndexBeforeFinal = 0;

      if (!slides.length) return { next: function(){}, prev: function(){}, goTo: function(){}, toggleFinal: function(){} };

      // Generar puntos dinámicamente
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'arr-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', 'Ir a la foto ' + (i + 1));
          dot.addEventListener('click', function(e) {
            e.stopPropagation();
            goTo(i);
          });
          dotsContainer.appendChild(dot);
        }
      }

      function updateUI() {
        slides.forEach(function(s, idx) {
          if (idx === currentIndex) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });

        if (dotsContainer) {
          const dots = dotsContainer.querySelectorAll('.arr-dot');
          dots.forEach(function(d, idx) {
            if (idx === currentIndex) {
              d.classList.add('active');
            } else {
              d.classList.remove('active');
            }
          });
        }

        if (counter) {
          if (currentIndex === finalIndex) {
            counter.innerHTML = '<span style="color:var(--gold); font-weight:800;">Visión Final</span>';
          } else {
            counter.textContent = (currentIndex + 1) + ' / ' + (total - 1);
          }
        }

        if (btnToggleFinal) {
          if (currentIndex === finalIndex) {
            btnToggleFinal.classList.add('active');
            btnToggleFinal.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Volver a fotos de obra';
          } else {
            btnToggleFinal.classList.remove('active');
            btnToggleFinal.innerHTML = '<i class="fa-solid fa-cube"></i> Visión final proyectada';
          }
        }
      }

      function goTo(index) {
        if (currentIndex !== finalIndex) {
          previousIndexBeforeFinal = currentIndex;
        }
        currentIndex = ((index % total) + total) % total;
        updateUI();
        resetTimer();
      }

      function next() {
        goTo(currentIndex + 1);
      }

      function prev() {
        goTo(currentIndex - 1);
      }

      function toggleFinal() {
        if (currentIndex === finalIndex) {
          goTo(previousIndexBeforeFinal);
        } else {
          goTo(finalIndex);
        }
      }

      function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(function() {
          if (!isPaused) {
            // El carrusel automático cicla entre las fotos de obra (0 a 10). La visión final está accesible mediante botón o tras la última
            next();
          }
        }, 3800);
      }

      function resetTimer() {
        startTimer();
      }

      if (frame) {
        frame.addEventListener('mouseenter', function() { isPaused = true; });
        frame.addEventListener('mouseleave', function() { isPaused = false; });
        frame.addEventListener('touchstart', function() { isPaused = true; }, { passive: true });
        frame.addEventListener('touchend', function() { isPaused = false; }, { passive: true });
      }

      // Iniciar
      updateUI();
      startTimer();

      return {
        next: next,
        prev: prev,
        goTo: goTo,
        toggleFinal: toggleFinal
      };
    })();
