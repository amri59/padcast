/* ============================================================
   اسکریپت‌های مشترک جزوه دوره هوش مصنوعی و دیتاساینس
   نسخه ۸ — سایدبار ثابت (غیر modal) + دکمه منوی شناور پایین
   + منو بعد از کلیک باز می‌ماند + اسکرول انتهای منو اصلاح شد
   + ویرایش HTML بلوک‌های کد با دابل‌کلیک
   + رندر مطمئن فرمول پس از ویرایش
   ============================================================ */

(function() {
    'use strict';

    const CONFIG = window.NOTES_CONFIG || {
        exportFileName: 'ai-course-notes-edited.html'
    };

    // ================= تابع کپی کد =================
    window.copyCode = function(btn) {
        const codeBlock = btn.closest('.code-block');
        const code = codeBlock.querySelector('code');
        const text = code.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                btn.classList.add('copied');
                const originalText = btn.innerHTML;
                btn.innerHTML = '✓ کپی شد';
                setTimeout(function() {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalText;
                }, 2000);
            }).catch(function() {
                fallbackCopy(text, btn);
            });
        } else {
            fallbackCopy(text, btn);
        }
    };

    function fallbackCopy(text, btn) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            btn.classList.add('copied');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ کپی شد';
            setTimeout(function() {
                btn.classList.remove('copied');
                btn.innerHTML = originalText;
            }, 2000);
        } catch (e) {
            console.error('Copy failed:', e);
        }
        document.body.removeChild(textarea);
    }

    // ================= تم =================
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const prismDark = document.getElementById('prism-theme-dark');
    const prismLight = document.getElementById('prism-theme-light');

    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('ai_course_theme') || 'dark';
    } catch (e) { /* ignore */ }

    html.setAttribute('data-theme', savedTheme);
    if (themeIcon) updateToggleUI(savedTheme);
    updatePrismTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            updateToggleUI(next);
            updatePrismTheme(next);
            try { localStorage.setItem('ai_course_theme', next); } catch (e) {}
        });
    }

    function updateToggleUI(theme) {
        if (!themeIcon || !themeLabel) return;
        if (theme === 'dark') {
            themeIcon.textContent = '🌙';
            themeLabel.textContent = 'تم تاریک';
        } else {
            themeIcon.textContent = '☀️';
            themeLabel.textContent = 'تم روشن';
        }
    }

    function updatePrismTheme(theme) {
        if (!prismDark || !prismLight) return;
        if (theme === 'dark') {
            prismDark.disabled = false;
            prismLight.disabled = true;
        } else {
            prismDark.disabled = true;
            prismLight.disabled = false;
        }
    }

    // ================= عناصر =================
    const sidebarBody = document.getElementById('sidebarBody');
    const sessionGrid = document.getElementById('sessionGrid');
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarFloatBtn = document.getElementById('sidebarFloatBtn');
    const editToggle = document.getElementById('editToggle');
    const editLabel = document.getElementById('editLabel');
    const editToolbar = document.getElementById('editToolbar');
    const saveBtn = document.getElementById('saveBtn');
    const exportBtn = document.getElementById('exportBtn');
    const resetBtn = document.getElementById('resetBtn');
    const insertImageBtn = document.getElementById('insertImageBtn');
    const insertLinkBtn = document.getElementById('insertLinkBtn');
    const editHtmlBtn = document.getElementById('editHtmlBtn');
    const exitEditBtn = document.getElementById('exitEditBtn');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const modalExtraContent = document.getElementById('modalExtraContent');
    const toast = document.getElementById('toast');
    const formatToolbar = document.getElementById('formatToolbar');
    const customTextColor = document.getElementById('customTextColor');
    const customBgColor = document.getElementById('customBgColor');
    const floatingEditBtn = document.getElementById('floatingEditBtn');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const imageToolbar = document.getElementById('imageToolbar');
    const imgSizeLabel = document.getElementById('imgSizeLabel');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    const imageInsertModal = document.getElementById('imageInsertModal');
    const imageFilenameInput = document.getElementById('imageFilenameInput');
    const imagePreviewBox = document.getElementById('imagePreviewBox');
    const imageInsertConfirm = document.getElementById('imageInsertConfirm');
    const imageInsertCancel = document.getElementById('imageInsertCancel');
    const recentImagesBox = document.getElementById('recentImagesBox');
    const recentThumbs = document.getElementById('recentThumbs');
    const imageTargetInfo = document.getElementById('imageTargetInfo');
    const imageTargetText = document.getElementById('imageTargetText');

    const linkInsertModal = document.getElementById('linkInsertModal');
    const linkTypeWeb = document.getElementById('linkTypeWeb');
    const linkTypeLocal = document.getElementById('linkTypeLocal');
    const webLinkSection = document.getElementById('webLinkSection');
    const localLinkSection = document.getElementById('localLinkSection');
    const webLinkUrlInput = document.getElementById('webLinkUrlInput');
    const localLinkUrlInput = document.getElementById('localLinkUrlInput');
    const linkDisplayTextInput = document.getElementById('linkDisplayTextInput');
    const linkPreviewContent = document.getElementById('linkPreviewContent');
    const linkInsertConfirm = document.getElementById('linkInsertConfirm');
    const linkInsertCancel = document.getElementById('linkInsertCancel');
    const linkTargetInfo = document.getElementById('linkTargetInfo');
    const linkTargetText = document.getElementById('linkTargetText');

    const formulaToolbar = document.getElementById('formulaToolbar');
    const formulaEditModal = document.getElementById('formulaEditModal');
    const formulaEditConfirm = document.getElementById('formulaEditConfirm');
    const formulaEditCancel = document.getElementById('formulaEditCancel');
    const formulaTextInput = document.getElementById('formulaTextInput');
    const formulaCaptionInput = document.getElementById('formulaCaptionInput');
    const formulaPreview = document.getElementById('formulaPreview');

    let blockInsertModal = document.getElementById('blockInsertModal');
    let blockTypeInput = document.getElementById('blockTypeInput');
    let blockTextInput = document.getElementById('blockTextInput');
    let blockLanguageInput = document.getElementById('blockLanguageInput');
    let blockCaptionInput = document.getElementById('blockCaptionInput');
    let blockInsertConfirm = document.getElementById('blockInsertConfirm');
    let blockInsertCancel = document.getElementById('blockInsertCancel');

    const htmlEditModal = document.getElementById('htmlEditModal');
    const htmlEditTextarea = document.getElementById('htmlEditTextarea');
    const htmlEditPreview = document.getElementById('htmlEditPreview');
    const htmlEditConfirm = document.getElementById('htmlEditConfirm');
    const htmlEditCancel = document.getElementById('htmlEditCancel');
    const htmlEditFormat = document.getElementById('htmlEditFormat');
    const htmlEditRevert = document.getElementById('htmlEditRevert');
    const htmlEditTargetInfo = document.getElementById('htmlEditTargetInfo');
    const htmlEditTargetText = document.getElementById('htmlEditTargetText');

    // ================= MathJax Typeset =================
    let mathTypesetDone = false;

    function typesetMathOnce() {
        if (mathTypesetDone) return;
        if (!window.MathJax || !window.MathJax.typesetPromise) return;
        mathTypesetDone = true;
        window.MathJax.typesetPromise().catch(function(err) {
            console.warn('MathJax typeset warning:', err);
        });
    }

    function typesetMathDelayed(delays) {
        const actualDelays = delays || [300, 800, 1500];
        actualDelays.forEach(function(delay) {
            setTimeout(function() {
                typesetMathOnce();
            }, delay);
        });
    }
    window.__typesetMathDelayed = typesetMathDelayed;

    function renderMathInElement(el) {
        if (!el || !document.body.contains(el)) return;
        if (!window.MathJax || !window.MathJax.typesetPromise) return;

        try {
            if (window.MathJax.typesetClear) {
                window.MathJax.typesetClear([el]);
            }
        } catch (e) {
            console.warn('typesetClear warning:', e);
        }

        window.MathJax.typesetPromise([el]).then(function() {
            const hasRendered = el.querySelector(
                'mjx-container, .MathJax, .MathJax_Preview, .MathJax_Display, .MathJax_CHTML'
            );
            if (!hasRendered) {
                console.warn('⏳ رندر مستقیم موفق نبود — امتحان کل document...');
                window.MathJax.typesetPromise().catch(function(err) {
                    console.warn('Full typeset error:', err);
                });
            }
        }).catch(function(err) {
            console.warn('renderMathInElement error:', err);
            window.MathJax.typesetPromise().catch(function(){});
        });
    }
    window.__renderMathInElement = renderMathInElement;

    // ================= Toast =================
    let toastTimer;
    function showToast(message, type) {
        if (!toast) return;
        type = type || 'info';
        toast.textContent = message;
        toast.className = 'toast ' + type;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toast.classList.remove('show');
        }, 4500);
    }

    // ================= Modal =================
    let modalCallback = null;
    function showModal(title, message, callback, extraContent) {
        if (!modalOverlay) return;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalCallback = callback;
        modalExtraContent.innerHTML = extraContent || '';
        modalOverlay.classList.add('open');
    }
    function hideModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('open');
        modalCallback = null;
        modalExtraContent.innerHTML = '';
    }
    if (modalConfirm) {
        modalConfirm.addEventListener('click', function() {
            const cb = modalCallback;
            const inputs = modalExtraContent.querySelectorAll('input');
            if (inputs.length > 0 && cb) {
                const values = Array.from(inputs).map(function(inp) { return inp.value; });
                cb.apply(null, values);
            } else if (cb) {
                cb();
            }
            hideModal();
        });
    }
    if (modalCancel) modalCancel.addEventListener('click', hideModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) hideModal();
        });
    }

    // ================= سایدبار (نسخه ثابت - غیر modal) =================
    const SIDEBAR_WIDTH = 400;

    function buildSidebar() {
        if (!sessionGrid || !sidebarBody) return;
        const sessions = sessionGrid.querySelectorAll('.session-card');
        let sidebarHTML = '';
        sessions.forEach(function(session) {
            const sessionId = session.id;
            const badge = session.querySelector('.session-badge');
            const titleEl = session.querySelector('.session-title');
            const topics = session.querySelectorAll('.topic');
            const badgeText = badge ? badge.textContent.trim() : '';
            let titleText = '';
            if (titleEl) {
                titleEl.childNodes.forEach(function(node) {
                    if (node.nodeType === 3) titleText += node.textContent;
                });
                titleText = titleText.trim();
            }
            const isPart2 = badge && badge.classList.contains('part2');
            const badgeClass = isPart2 ? 'session-num p2' : 'session-num';
            const persianNumMatch = badgeText.match(/[۰-۹]+/);
            const persianNum = persianNumMatch ? persianNumMatch[0] : '?';
            sidebarHTML += '<div class="sidebar-session">' +
                '<div class="sidebar-session-header" data-target="' + sessionId + '">' +
                    '<div style="display:flex;align-items:center;gap:0.6rem;flex:1;min-width:0;">' +
                        '<span class="' + badgeClass + '">' + persianNum + '</span>' +
                        '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + titleText + '</span>' +
                    '</div>' +
                    '<span class="chevron">▼</span>' +
                '</div>' +
                '<ul class="sidebar-session-topics">';
            topics.forEach(function(topic) {
                const topicId = topic.id;
                const topicTitleEl = topic.querySelector('.topic-title');
                const timeBadge = topic.querySelector('.time-badge');
                let topicTitle = '';
                if (topicTitleEl) {
                    topicTitleEl.childNodes.forEach(function(node) {
                        if (node.nodeType === 3) topicTitle += node.textContent;
                    });
                    topicTitle = topicTitle.trim();
                }
                let timeText = '';
                if (timeBadge) {
                    const timeParts = timeBadge.textContent.trim().replace(/[⏱▶]/g, '').trim();
                    const timeMatch = timeParts.match(/(\d{1,2}:\d{2}:\d{2})/);
                    timeText = timeMatch ? timeMatch[1] : '';
                }
                sidebarHTML += '<li><a href="#' + topicId + '" data-topic="' + topicId + '">' +
                    topicTitle +
                    (timeText ? '<span class="sb-time">⏱ ' + timeText + '</span>' : '') +
                    '</a></li>';
            });
            sidebarHTML += '</ul></div>';
        });
        sidebarBody.innerHTML = sidebarHTML;

        document.querySelectorAll('.sidebar-session-header').forEach(function(header) {
            header.addEventListener('click', function(e) {
                if (e.target.tagName !== 'A') {
                    const topicsList = this.nextElementSibling;
                    const isCollapsed = topicsList.classList.contains('collapsed');
                    document.querySelectorAll('.sidebar-session-topics').forEach(function(ul) {
                        ul.classList.add('collapsed');
                    });
                    document.querySelectorAll('.sidebar-session-header').forEach(function(h) {
                        h.classList.add('collapsed');
                    });
                    if (isCollapsed) {
                        topicsList.classList.remove('collapsed');
                        this.classList.remove('collapsed');
                    }
                }
            });
        });

        // ✅ لینک‌های تاپیک — منو بعد از کلیک باز می‌ماند
        sidebarBody.querySelectorAll('a[data-topic]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-topic');
                const target = document.getElementById(targetId);
                if (target) {
                    // هایلایت لینک فعال
                    sidebarBody.querySelectorAll('a[data-topic]').forEach(function(l) {
                        l.classList.remove('active-topic');
                    });
                    this.classList.add('active-topic');

                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // ✅ closeSidebar() حذف شد تا منو باز بماند
                    target.style.transition = 'background 0.3s ease';
                    target.style.background = 'rgba(96, 165, 250, 0.1)';
                    setTimeout(function() { target.style.background = ''; }, 1500);
                }
            });
        });
    }

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
        // جابجایی محتوای اصلی به چپ (فقط در دسکتاپ)
        if (window.innerWidth > 900) {
            document.body.style.paddingRight = SIDEBAR_WIDTH + 'px';
            document.body.style.transition = 'padding-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        if (sidebarFloatBtn) sidebarFloatBtn.classList.add('active');
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
        document.body.style.paddingRight = '';
        if (sidebarFloatBtn) sidebarFloatBtn.classList.remove('active');
    }

    function toggleSidebar() {
        if (sidebar && sidebar.classList.contains('open')) closeSidebar();
        else openSidebar();
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarFloatBtn) {
        sidebarFloatBtn.addEventListener('click', toggleSidebar);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) closeSidebar();
    });

    buildSidebar();

    function refreshSidebar() {
        const openHeaderIndex = Array.prototype.findIndex.call(
            document.querySelectorAll('.sidebar-session-topics'),
            function(ul) { return !ul.classList.contains('collapsed'); }
        );
        buildSidebar();
        if (openHeaderIndex > -1) {
            const lists = document.querySelectorAll('.sidebar-session-topics');
            const headers = document.querySelectorAll('.sidebar-session-header');
            lists.forEach(function(ul) { ul.classList.add('collapsed'); });
            headers.forEach(function(h) { h.classList.add('collapsed'); });
            if (lists[openHeaderIndex]) lists[openHeaderIndex].classList.remove('collapsed');
            if (headers[openHeaderIndex]) headers[openHeaderIndex].classList.remove('collapsed');
        }
    }

    let sidebarRefreshTimer = null;
    function refreshSidebarDebounced() {
        clearTimeout(sidebarRefreshTimer);
        sidebarRefreshTimer = setTimeout(refreshSidebar, 700);
    }

    document.addEventListener('input', function(e) {
        const el = e.target;
        if (!el || !el.closest) return;
        if (el.closest('.topic-title') || el.closest('.session-title') || el.closest('.time-editable')) {
            refreshSidebarDebounced();
        }
    });

    window.__refreshSidebar = refreshSidebar;

    window.addEventListener('scroll', function() {
        if (!backToTopBtn || !floatingEditBtn) return;
        const shouldShow = window.scrollY > 300;
        backToTopBtn.classList.toggle('visible', shouldShow);
        floatingEditBtn.classList.toggle('visible', shouldShow);
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ================= توابع زمان =================
    function normalizeTimeDigits(timeStr) {
        return String(timeStr || '').trim()
            .replace(/[۰-۹]/g, function(d) { return String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)); })
            .replace(/[٠-٩]/g, function(d) { return String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)); })
            .replace(/[٫]/g, ':');
    }
    function timeToSeconds(timeStr) {
        if (!timeStr) return 0;
        const parts = normalizeTimeDigits(timeStr).split(':').map(function(p) {
            return parseInt(p, 10) || 0;
        });
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 1) return parts[0];
        return 0;
    }
    function isValidTime(timeStr) {
        if (!timeStr) return false;
        const value = normalizeTimeDigits(timeStr);
        if (!/^\d{1,2}:\d{2}:\d{2}$/.test(value)) return false;
        const parts = value.split(':').map(Number);
        return parts[1] < 60 && parts[2] < 60;
    }
    function buildVideoUrl(videoFile, startTime) {
        const seconds = timeToSeconds(startTime);
        let cleanFile = String(videoFile).split('#')[0];
        cleanFile = cleanFile.split('?')[0];
        return cleanFile + (seconds > 0 ? '#t=' + seconds : '');
    }
    function extractVideoFile(href) {
        if (!href) return '';
        return String(href).split('#')[0].split('?')[0];
    }
    function secondsToTime(secs) {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return String(h).padStart(2, '0') + ':' +
               String(m).padStart(2, '0') + ':' +
               String(s).padStart(2, '0');
    }

    // ============================================================
    // ================= سیستم ویرایش =================
    // ============================================================
    let isEditMode = false;
    let isDirty = false;
    let lastActiveTopic = null;

    const EDITABLE_SELECTORS = [
        '.topic-title', '.topic-desc', '.note-box', '.inserted-text-block',
        '.session-title', '#mainTitle', '#subheadText', '#footerNote',
        '.video-badge', 'td', 'th', '.session-badge'
    ];
    const TIME_BADGE_SELECTOR = '.time-badge';

    function getTopicBlocks(topic) {
        return Array.prototype.filter.call(topic.children, function(child) {
            return !child.classList.contains('delete-topic-btn') &&
                   !child.classList.contains('add-note-btn');
        });
    }

    function cleanNodeForStorage(node) {
        const clone = node.cloneNode(true);
        clone.querySelectorAll(
            '.delete-topic-btn, .add-note-btn, .add-topic-btn, .topic-tools, .block-tools, .editable-hint'
        ).forEach(function(el) { el.remove(); });
        clone.querySelectorAll('[contenteditable]').forEach(function(el) {
            el.removeAttribute('contenteditable');
            el.removeAttribute('spellcheck');
        });
        if (clone.hasAttribute && clone.hasAttribute('contenteditable')) {
            clone.removeAttribute('contenteditable');
            clone.removeAttribute('spellcheck');
        }
        clone.querySelectorAll('.time-badge').forEach(function(badge) {
            const startEl = badge.querySelector('.time-start');
            if (startEl) {
                badge.innerHTML = '<i>⏱</i> ' + startEl.textContent.trim() +
                    ' <span class="play-icon">▶</span>';
            }
            badge.removeAttribute('data-time-editable');
        });
        if (clone.style && clone.style.position === 'relative') {
            clone.style.position = '';
            if (!clone.getAttribute('style')) clone.removeAttribute('style');
        }
        return clone;
    }

    function saveEdits() {
        if (!isDirty) {
            showToast('ℹ️ تغییر جدیدی برای ذخیره وجود ندارد', 'info');
            return;
        }
        showToast('ℹ️ تغییرات فقط در همین صفحه است. برای ذخیره دائم، از «دانلود HTML» استفاده کنید.', 'info');
    }

    function onEditInput() {
        this.setAttribute('data-edited', 'true');
        markDirty();
    }
    function onEditFocus() {
        this.style.outline = '2px solid #10b981';
        const topic = this.closest ? this.closest('.topic') : null;
        if (topic) lastActiveTopic = topic;
    }
    function onEditBlur() {
        this.style.outline = '';
    }
    function preventLinkClick(e) {
        if (isEditMode) {
            if (e.target.tagName === 'IMG') return;
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function makeTimeBadgeEditable(badge) {
        if (badge.dataset.timeEditable === 'true') return;
        badge.dataset.timeEditable = 'true';

        const href = badge.getAttribute('href') || '';
        if (!badge.dataset.videoFile) {
            badge.dataset.videoFile = extractVideoFile(href);
        }
        const text = badge.textContent || '';
        const timeMatch = text.match(/(\d{1,2}:\d{2}:\d{2})/);
        const startTime = timeMatch ? timeMatch[1] : '00:00:00';

        badge.innerHTML =
            '<i>⏱</i> ' +
            '<span class="time-editable time-start" contenteditable="true" spellcheck="false">' + startTime + '</span>' +
            ' <span class="play-icon">▶</span>';

        function updateHref() {
            const startEl = badge.querySelector('.time-start');
            if (!startEl) return;
            const newStart = normalizeTimeDigits(startEl.textContent);
            if (isValidTime(newStart)) {
                const videoFile = badge.dataset.videoFile || extractVideoFile(badge.getAttribute('href'));
                const newHref = buildVideoUrl(videoFile, newStart);
                badge.setAttribute('href', newHref);
                badge.dataset.startSeconds = String(timeToSeconds(newStart));
                badge.dataset.edited = 'true';
            }
        }

        badge.querySelectorAll('.time-editable').forEach(function(span) {
            span.addEventListener('input', function() {
                badge.setAttribute('data-edited', 'true');
                markDirty();
                updateHref();
            });
            span.addEventListener('change', updateHref);
            span.addEventListener('blur', function() {
                this.style.outline = '';
                const val = normalizeTimeDigits(this.textContent);
                this.textContent = secondsToTime(timeToSeconds(val));
                updateHref();
            });
            span.addEventListener('focus', function() {
                this.style.outline = '2px solid #3b82f6';
            });
            span.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
        });
    }

    function restoreTimeBadge(badge) {
        if (badge.dataset.timeEditable !== 'true') return;
        badge.dataset.timeEditable = 'false';
        const startEl = badge.querySelector('.time-start');
        const startTime = startEl ? startEl.textContent.trim() : '00:00:00';
        badge.innerHTML = '<i>⏱</i> ' + startTime + ' <span class="play-icon">▶</span>';
    }

    function enableEditMode() {
        if (isEditMode) return;
        isEditMode = true;
        document.body.classList.add('edit-mode');
        if (editToggle) editToggle.classList.add('active');
        if (floatingEditBtn) floatingEditBtn.classList.add('active');
        if (editLabel) editLabel.textContent = 'خروج از ویرایش';
        if (editToolbar) editToolbar.classList.add('visible');

        EDITABLE_SELECTORS.forEach(function(selector) {
            document.querySelectorAll(selector).forEach(function(el) {
                if (el.getAttribute('contenteditable') === 'true') return;
                el.setAttribute('contenteditable', 'true');
                el.setAttribute('spellcheck', 'false');
                el.addEventListener('input', onEditInput);
                el.addEventListener('focus', onEditFocus);
                el.addEventListener('blur', onEditBlur);
            });
        });

        document.querySelectorAll(TIME_BADGE_SELECTOR).forEach(function(badge) {
            makeTimeBadgeEditable(badge);
            badge.addEventListener('click', preventLinkClick);
        });

        document.querySelectorAll('.topic').forEach(attachTopicTools);
        attachAllCustomBlockTools();

        document.querySelectorAll('.session-body').forEach(function(body) {
            if (!body.querySelector('.add-topic-btn')) {
                const addBtn = document.createElement('button');
                addBtn.className = 'add-topic-btn';
                addBtn.innerHTML = '＋ افزودن تاپیک جدید';
                addBtn.addEventListener('click', function() {
                    openTopicInsertModal(body.closest('.session-card'));
                });
                body.appendChild(addBtn);
            }
        });

        document.querySelectorAll('.video-badge').forEach(function(el) {
            el.addEventListener('click', preventLinkClick);
        });

        attachImageListeners();
        attachFormulaListeners();
        attachCodeBlockListeners();
        ensureEditToolbarButtons();
        showToast('✏️ حالت ویرایش فعال شد. برای ویرایش کد، روی بلوک کد دابل‌کلیک کنید.', 'info');
    }

    function disableEditMode() {
        isEditMode = false;
        document.body.classList.remove('edit-mode');
        if (editToggle) editToggle.classList.remove('active');
        if (floatingEditBtn) floatingEditBtn.classList.remove('active');
        if (editLabel) editLabel.textContent = 'ویرایش';
        if (editToolbar) editToolbar.classList.remove('visible');
        if (formatToolbar) formatToolbar.classList.remove('visible');
        if (imageToolbar) imageToolbar.classList.remove('visible');
        hideInlineButtons();
        hideFormulaToolbar();
        currentCodeBlock = null;

        document.querySelectorAll(TIME_BADGE_SELECTOR).forEach(function(badge) {
            restoreTimeBadge(badge);
            badge.removeEventListener('click', preventLinkClick);
        });

        document.querySelectorAll('[contenteditable="true"]').forEach(function(el) {
            el.removeAttribute('contenteditable');
            el.removeAttribute('spellcheck');
            el.removeEventListener('input', onEditInput);
            el.removeEventListener('focus', onEditFocus);
            el.removeEventListener('blur', onEditBlur);
        });

        document.querySelectorAll('.delete-topic-btn, .add-topic-btn, .add-note-btn, .block-tools').forEach(function(el) { el.remove(); });
        stylePainterDeactivate();
        document.querySelectorAll('.video-badge').forEach(function(el) {
            el.removeEventListener('click', preventLinkClick);
        });

        if (isDirty) {
            showModal(
                'تغییرات ذخیره‌نشده',
                'شما تغییرات ذخیره‌نشده دارید. آیا می‌خواهید فایل HTML خروجی را ذخیره کنید؟',
                function() { exportHTML(); }
            );
        } else {
            showToast('حالت ویرایش غیرفعال شد', 'info');
        }
    }

    function makeElementEditable(el) {
        if (!el || el.getAttribute('contenteditable') === 'true') return;
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
        el.addEventListener('input', onEditInput);
        el.addEventListener('focus', onEditFocus);
        el.addEventListener('blur', onEditBlur);
    }

    function attachTopicTools(topic) {
        if (!topic) return;
        topic.style.position = 'relative';

        if (!topic.querySelector('.delete-topic-btn')) {
            const delBtn = document.createElement('button');
            delBtn.className = 'delete-topic-btn';
            delBtn.innerHTML = '✕';
            delBtn.title = 'حذف این تاپیک';
            delBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showModal('حذف تاپیک', 'آیا از حذف این تاپیک مطمئن هستید؟', function() {
                    topic.remove();
                    if (lastActiveTopic === topic) lastActiveTopic = null;
                    markDirty();
                    refreshSidebar();
                    showToast('🗑 تاپیک حذف شد', 'info');
                });
            });
            topic.prepend(delBtn);
        }

        if (!topic.querySelector('.add-note-btn')) {
            const noteBtn = document.createElement('button');
            noteBtn.className = 'add-note-btn';
            noteBtn.innerHTML = '◈ افزودن نکته';
            noteBtn.title = 'افزودن نکته به این تاپیک';
            noteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                openNoteInsertModal(topic);
            });
            topic.appendChild(noteBtn);
        }
    }

    function createNewTopic(options) {
        const opts = options || {};
        const topic = document.createElement('div');
        topic.className = 'topic';
        topic.id = 't-custom-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        topic.setAttribute('data-custom-topic', 'true');

        const title = (opts.title || '').trim() || 'تاپیک جدید';
        const time = isValidTime(normalizeTimeDigits(opts.time || ''))
            ? secondsToTime(timeToSeconds(opts.time))
            : '00:00:00';

        let descLines = opts.desc;
        if (typeof descLines === 'string') descLines = descLines.split('\n');
        if (!Array.isArray(descLines)) descLines = [];
        descLines = descLines.map(function(l) { return String(l).trim(); })
                             .filter(function(l) { return l.length > 0; });
        if (descLines.length === 0) descLines = ['توضیحات تاپیک را اینجا وارد کنید.'];

        const descHTML = '<ul>' + descLines.map(function(line) {
            return '<li>' + escapeHTML(line) + '</li>';
        }).join('') + '</ul>';

        const videoFile = opts.videoFile || getDefaultVideoFile();
        const href = videoFile ? buildVideoUrl(videoFile, time) : '#';

        let html =
            '<div class="topic-title">📌 ' + escapeHTML(title) +
                '<a class="time-badge" href="' + escapeHTML(href) + '" target="_blank">' +
                    '<i>⏱</i> ' + time + ' <span class="play-icon">▶</span>' +
                '</a>' +
            '</div>' +
            '<div class="topic-desc">' + descHTML + '</div>';

        const noteText = (opts.note || '').trim();
        if (noteText) {
            html += '<div class="note-box">' +
                '<span class="note-label">◈ نکته تکمیلی</span>' +
                '<p>' + escapeHTML(noteText) + '</p>' +
            '</div>';
        }

        topic.innerHTML = html;

        if (isEditMode) {
            topic.querySelectorAll('.topic-title, .topic-desc, .note-box').forEach(makeElementEditable);
            attachTopicTools(topic);
            const newBadge = topic.querySelector('.time-badge');
            if (newBadge) {
                makeTimeBadgeEditable(newBadge);
                newBadge.addEventListener('click', preventLinkClick);
            }
        }
        return topic;
    }

    function getDefaultVideoFile() {
        const badge = document.querySelector('.time-badge[href]');
        if (!badge) return '';
        return extractVideoFile(badge.getAttribute('href'));
    }
    function markDirty() {
        isDirty = true;
        updateStatus();
    }
    function updateStatus() {
        if (!statusDot || !statusText) return;
        if (isDirty) {
            statusDot.classList.add('dirty');
            statusText.textContent = 'تغییرات ذخیره‌نشده — از «دانلود HTML» استفاده کنید';
        } else {
            statusDot.classList.remove('dirty');
            statusText.textContent = 'همه تغییرات اعمال شده';
        }
    }

    // ============================================================
    // ================= خروجی HTML =================
    // ============================================================

    function getBaseHref() {
        try {
            const href = window.location.href;
            const hashless = href.split('#')[0].split('?')[0];
            const lastSlash = hashless.lastIndexOf('/');
            return lastSlash >= 0 ? hashless.substring(0, lastSlash + 1) : '';
        } catch (e) {
            return '';
        }
    }

    function cleanupEditArtifacts(clone) {
        clone.querySelectorAll(
            '.delete-topic-btn, .add-topic-btn, .add-note-btn, .block-tools, ' +
            '.editable-hint, .inline-insert-img-btn, .inline-insert-link-btn'
        ).forEach(function(el) { el.remove(); });

        clone.querySelectorAll('[contenteditable]').forEach(function(el) {
            el.removeAttribute('contenteditable');
            el.removeAttribute('spellcheck');
        });
        clone.querySelectorAll('[data-edited]').forEach(function(el) {
            el.removeAttribute('data-edited');
        });
        clone.querySelectorAll('[data-time-editable]').forEach(function(el) {
            el.removeAttribute('data-time-editable');
        });
        clone.querySelectorAll('[data-error-handler-attached]').forEach(function(el) {
            el.removeAttribute('data-error-handler-attached');
        });

        clone.querySelectorAll('[data-attached]').forEach(function(el) {
            el.removeAttribute('data-attached');
        });
        clone.querySelectorAll('[data-listener-attached]').forEach(function(el) {
            el.removeAttribute('data-listener-attached');
        });
        clone.querySelectorAll('[data-click-listener-attached]').forEach(function(el) {
            el.removeAttribute('data-click-listener-attached');
        });

        clone.querySelectorAll('.topic').forEach(function(topic) {
            if (topic.style && topic.style.position === 'relative') {
                topic.style.position = '';
                if (!topic.getAttribute('style')) topic.removeAttribute('style');
            }
        });

        clone.querySelectorAll('base').forEach(function(b) { b.remove(); });

        const bodyEl = clone.querySelector('body');
        if (bodyEl) {
            bodyEl.classList.remove('edit-mode');
            bodyEl.classList.remove('sidebar-open');
            bodyEl.style.paddingRight = '';
        }

        const editToggleClone = clone.querySelector('#editToggle');
        if (editToggleClone) editToggleClone.classList.remove('active');

        const floatingEditBtnClone = clone.querySelector('#floatingEditBtn');
        if (floatingEditBtnClone) floatingEditBtnClone.classList.remove('active', 'visible');

        const backToTopBtnClone = clone.querySelector('#backToTopBtn');
        if (backToTopBtnClone) backToTopBtnClone.classList.remove('visible');

        const sidebarFloatBtnClone = clone.querySelector('#sidebarFloatBtn');
        if (sidebarFloatBtnClone) sidebarFloatBtnClone.classList.remove('active');

        const editLabelClone = clone.querySelector('#editLabel');
        if (editLabelClone) editLabelClone.textContent = 'ویرایش';

        ['#editToolbar', '#formatToolbar', '#imageToolbar', '#formulaToolbar'].forEach(function(sel) {
            const el = clone.querySelector(sel);
            if (el) el.classList.remove('visible');
        });

        clone.querySelectorAll('#insertTopicBtn, #insertNoteBtn, #insertBlockBtn').forEach(function(el) {
            el.remove();
        });

        clone.querySelectorAll('.topic-insert-modal, .note-insert-modal, .block-insert-modal').forEach(function(el) {
            el.remove();
        });

        clone.querySelectorAll('.modal-overlay.open, .lightbox.open').forEach(function(el) {
            el.classList.remove('open');
        });

        clone.querySelectorAll(
            '.format-toolbar .style-copy, ' +
            '.format-toolbar .style-apply, ' +
            '.format-toolbar .style-paint, ' +
            '.format-toolbar .style-painter-divider, ' +
            '.style-copy, .style-apply, .style-paint, .style-painter-divider'
        ).forEach(function(el) { el.remove(); });

        clone.querySelectorAll(
            '.image-toolbar .align-btn, ' +
            '.image-toolbar .dyn-img-divider, ' +
            '.image-toolbar .img-btn[data-img-action="newtab"], ' +
            '.align-btn, .dyn-img-divider'
        ).forEach(function(el) { el.remove(); });

        clone.querySelectorAll('.lightbox .lightbox-newtab, .lightbox-newtab').forEach(function(el) {
            el.remove();
        });

        clone.querySelectorAll('.format-toolbar .fmt-divider, .image-toolbar .img-divider')
            .forEach(function(el) { el.remove(); });
    }

    function removeMathJaxDynamicAssets(clone) {
        clone.querySelectorAll('head script[src]').forEach(function(script) {
            const src = script.getAttribute('src') || '';
            if (/\/input\/tex\//.test(src) ||
                /\/input\/mml\//.test(src) ||
                /\/output\/chtml\//.test(src) ||
                /\/output\/svg\//.test(src)) {
                script.remove();
            }
        });

        clone.querySelectorAll('style').forEach(function(style) {
            const id = style.getAttribute('id') || '';
            if (id.indexOf('MJX-') === 0 || id === 'MathJax_CHTML_styles') {
                style.remove();
            }
        });
    }

    function buildExportHTML() {
        const clone = document.documentElement.cloneNode(true);
        const baseHref = getBaseHref();

        clone.querySelectorAll('.time-badge').forEach(function(badge) {
            const startEl = badge.querySelector('.time-start');
            if (startEl) {
                badge.innerHTML =
                    '<i>⏱</i> ' + startEl.textContent.trim() +
                    ' <span class="play-icon">▶</span>';
            }
        });

        cleanupEditArtifacts(clone);
        removeMathJaxDynamicAssets(clone);

        let htmlStr = '<!DOCTYPE html>\n' + clone.outerHTML;

        if (baseHref) {
            const escaped = baseHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            htmlStr = htmlStr.replace(new RegExp(escaped, 'g'), '');
            try {
                const ciRe = new RegExp(escaped, 'gi');
                htmlStr = htmlStr.replace(ciRe, '');
            } catch (e) { /* ignore */ }
        }

        return htmlStr;
    }

    function exportHTML() {
        let htmlContent;
        try {
            htmlContent = buildExportHTML();
        } catch (e) {
            console.error('Export build error:', e);
            showToast('❌ خطا در ساخت خروجی: ' + e.message, 'error');
            return;
        }

        const sizeKB = Math.round(htmlContent.length / 1024);
        const baseHref = getBaseHref();

        const customContent =
            '<div style="background:rgba(59,130,246,0.1); border:1px solid #3b82f6; ' +
                'border-radius:8px; padding:0.6rem 0.9rem; margin-bottom:0.8rem; ' +
                'font-size:0.78rem; color:var(--text-desc); text-align:right; line-height:1.85; direction:rtl;">' +
                '<b style="color:var(--text-title);">📁 این خروجی به این فایل‌ها نیاز دارد (کنار فایل HTML قرار دهید):</b><br>' +
                '<code style="direction:ltr; display:inline-block; background:var(--bg-code); ' +
                'padding:2px 6px; border-radius:3px; margin:2px 0;">assets/shared-scripts.js</code>' +
                '<code style="direction:ltr; display:inline-block; background:var(--bg-code); ' +
                'padding:2px 6px; border-radius:3px; margin:2px 0;">assets/shared-styles.css</code>' +
                '<span style="opacity:0.75;">(و پوشه‌ی <code style="direction:ltr;">img/</code> اگر عکس دارید)</span>' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:0.6rem;">' +
                '<button type="button" class="edit-btn primary" id="exportDownloadBtn" ' +
                    'style="justify-content:center; padding:0.7rem 1rem; font-size:0.9rem;">' +
                    '⬇ دانلود فایل HTML' +
                '</button>' +
                '<button type="button" class="edit-btn info" id="exportCopyBtn" ' +
                    'style="justify-content:center; padding:0.7rem 1rem; font-size:0.9rem;">' +
                    '📋 کپی کل کد HTML' +
                '</button>' +
            '</div>' +
            '<div style="background:var(--bg-note); border-right:3px solid var(--bg-note-border); ' +
                'border-radius:8px; padding:0.7rem 0.9rem; font-size:0.75rem; line-height:1.85; ' +
                'text-align:right; margin-top:0.9rem; color:var(--text-desc);">' +
                '<b style="color:var(--text-note);">💡 اگر ویندوز فایل را مسدود کرد:</b><br>' +
                'راست‌کلیک روی فایل → <b>Properties</b> → تیک <b>Unblock</b> → <b>OK</b>' +
            '</div>';

        showModal(
            '⬇ ذخیره فایل HTML',
            'حجم خروجی: ' + sizeKB + ' کیلوبایت. مسیر پایه: ' + baseHref,
            null,
            customContent
        );

        setTimeout(function() {
            const dlBtn = document.getElementById('exportDownloadBtn');
            const cpBtn = document.getElementById('exportCopyBtn');

            if (dlBtn) {
                dlBtn.addEventListener('click', function() {
                    doDownloadHTML(htmlContent);
                    hideModal();
                    isDirty = false;
                    updateStatus();
                });
            }
            if (cpBtn) {
                cpBtn.addEventListener('click', function() {
                    doCopyHTML(htmlContent);
                    hideModal();
                    isDirty = false;
                    updateStatus();
                });
            }
        }, 50);
    }

    function doDownloadHTML(htmlContent) {
        try {
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = CONFIG.exportFileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                if (a.parentNode) a.parentNode.removeChild(a);
                URL.revokeObjectURL(url);
            }, 200);
            showToast('⬇ فایل HTML دانلود شد. یادتان نرود assets/ کنارش باشد.', 'success');
        } catch (e) {
            console.error('Download failed:', e);
            showToast('❌ خطا در دانلود: ' + e.message, 'error');
        }
    }

    function doCopyHTML(htmlContent) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(htmlContent).then(function() {
                showToast('📋 کد HTML کپی شد (' + Math.round(htmlContent.length / 1024) +
                    ' KB) — در Notepad بچسبانید و با پسوند .html ذخیره کنید.', 'success');
            }).catch(function() {
                fallbackCopyHTML(htmlContent);
            });
        } else {
            fallbackCopyHTML(htmlContent);
        }
    }

    function fallbackCopyHTML(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(ta);
        if (ok) {
            showToast('📋 کد HTML کپی شد — در Notepad بچسبانید و با پسوند .html ذخیره کنید.', 'success');
        } else {
            showToast('❌ کپی ناموفق بود. لطفاً از روش دانلود استفاده کنید.', 'error');
        }
    }

    function resetEdits() {
        showModal(
            'بازنشانی تغییرات',
            'همه تغییرات این جلسه پاک شده و صفحه دوباره بارگذاری می‌شود. آیا مطمئن هستید؟',
            function() { location.reload(); }
        );
    }

    // ============================================================
    // ================= نوار ابزار فرمت‌دهی =================
    // ============================================================
    let savedRange = null;
    let activeCaretRange = null;
    let activeEditableElement = null;
    let activeInsertImgBtn = null;
    let activeInsertLinkBtn = null;

    function updateFormatToolbar() {
        if (!isEditMode || !formatToolbar) {
            if (formatToolbar) formatToolbar.classList.remove('visible');
            return;
        }
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        let node = range.commonAncestorContainer;
        if (node.nodeType === 3) node = node.parentNode;
        const editableParent = node.closest ? node.closest('[contenteditable="true"]') : null;
        if (!editableParent) return;

        savedRange = range.cloneRange();
        const bottomOffset = editToolbar && editToolbar.classList.contains('visible')
            ? (editToolbar.offsetHeight + 15) : 15;

        formatToolbar.style.left = '50%';
        formatToolbar.style.transform = 'translateX(-50%)';
        formatToolbar.style.right = 'auto';
        formatToolbar.style.top = 'auto';
        formatToolbar.style.bottom = bottomOffset + 'px';
        formatToolbar.classList.add('visible');
    }

    function applyFormatToSelection(type, value) {
        if (!isEditMode) return;
        const selection = window.getSelection();
        if (!savedRange) {
            showToast('❌ لطفاً ابتدا متن را انتخاب کنید', 'error');
            return;
        }
        try {
            selection.removeAllRanges();
            selection.addRange(savedRange);
        } catch(e) {
            showToast('❌ لطفاً دوباره متن را انتخاب کنید', 'error');
            return;
        }
        if (selection.isCollapsed) {
            showToast('❌ لطفاً ابتدا متن را انتخاب کنید', 'error');
            return;
        }

        const range = selection.getRangeAt(0);
        const fragment = range.extractContents();
        let wrapper;

        if (type === 'bold') wrapper = document.createElement('strong');
        else if (type === 'italic') wrapper = document.createElement('em');
        else if (type === 'underline') wrapper = document.createElement('u');
        else if (type === 'color') {
            wrapper = document.createElement('span');
            wrapper.style.color = value;
        } else if (type === 'bg') {
            wrapper = document.createElement('span');
            wrapper.style.backgroundColor = value;
            wrapper.style.padding = '0 2px';
            wrapper.style.borderRadius = '3px';
        } else if (type === 'clear') {
            const text = fragment.textContent;
            const textNode = document.createTextNode(text);
            range.insertNode(textNode);
            const newRange = document.createRange();
            newRange.selectNodeContents(textNode);
            selection.removeAllRanges();
            selection.addRange(newRange);
            savedRange = newRange.cloneRange();
            markDirty();
            showToast('✨ فرمت پاک شد', 'success');
            return;
        } else return;

        wrapper.appendChild(fragment);
        range.insertNode(wrapper);

        const newRange = document.createRange();
        newRange.selectNodeContents(wrapper);
        selection.removeAllRanges();
        selection.addRange(newRange);
        savedRange = newRange.cloneRange();

        markDirty();
        let parent = wrapper.parentNode;
        while (parent && !parent.hasAttribute('contenteditable')) parent = parent.parentNode;
        if (parent) parent.setAttribute('data-edited', 'true');
        showToast('✅ اعمال شد', 'success');
    }

    if (formatToolbar) {
        formatToolbar.addEventListener('mousedown', function(e) {
            if (e.target.tagName !== 'INPUT') e.preventDefault();
        });

        formatToolbar.querySelectorAll('.fmt-btn[data-cmd]').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const cmd = this.getAttribute('data-cmd');
                if (cmd === 'bold') applyFormatToSelection('bold');
                else if (cmd === 'italic') applyFormatToSelection('italic');
                else if (cmd === 'underline') applyFormatToSelection('underline');
                else if (cmd === 'removeFormat') applyFormatToSelection('clear');
                else if (cmd === 'link') openLinkInsertModal();
                else if (cmd === 'image') openImageInsertModal();
            });
        });

        formatToolbar.querySelectorAll('.color-swatch[data-color]').forEach(function(swatch) {
            swatch.addEventListener('click', function(e) {
                e.preventDefault();
                applyFormatToSelection('color', this.getAttribute('data-color'));
                if (customTextColor) customTextColor.value = this.getAttribute('data-color');
            });
        });

        formatToolbar.querySelectorAll('.color-swatch[data-bg]').forEach(function(swatch) {
            swatch.addEventListener('click', function(e) {
                e.preventDefault();
                applyFormatToSelection('bg', this.getAttribute('data-bg'));
                if (customBgColor) customBgColor.value = this.getAttribute('data-bg');
            });
        });
    }

    if (customTextColor) {
        customTextColor.addEventListener('change', function() {
            applyFormatToSelection('color', this.value);
        });
    }
    if (customBgColor) {
        customBgColor.addEventListener('change', function() {
            applyFormatToSelection('bg', this.value);
        });
    }

    document.addEventListener('mouseup', function(e) {
        if (!isEditMode) return;
        if (formatToolbar && formatToolbar.contains(e.target)) return;
        setTimeout(function() {
            updateFormatToolbar();
            updateActiveCaret();
        }, 20);
    });

    document.addEventListener('keyup', function(e) {
        if (!isEditMode) return;
        if (e.shiftKey || (e.ctrlKey && (e.key === 'a' || e.key === 'A'))) {
            setTimeout(updateFormatToolbar, 20);
        }
    });

    document.addEventListener('mousedown', function(e) {
        if (!isEditMode) return;
        const insideSpecial =
            (formatToolbar && formatToolbar.contains(e.target)) ||
            (imageToolbar && imageToolbar.contains(e.target)) ||
            (imageInsertModal && imageInsertModal.contains(e.target)) ||
            (linkInsertModal && linkInsertModal.contains(e.target)) ||
            (formulaToolbar && formulaToolbar.contains(e.target)) ||
            (formulaEditModal && formulaEditModal.contains(e.target)) ||
            (htmlEditModal && htmlEditModal.contains(e.target)) ||
            (activeInsertImgBtn && activeInsertImgBtn.contains(e.target)) ||
            (activeInsertLinkBtn && activeInsertLinkBtn.contains(e.target));
        if (!insideSpecial) {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                if (formatToolbar) formatToolbar.classList.remove('visible');
            }
            if (imageToolbar) imageToolbar.classList.remove('visible');
            hideFormulaToolbar();
        }
    });

    window.addEventListener('resize', function() {
        if (formatToolbar && formatToolbar.classList.contains('visible')) {
            const bottomOffset = editToolbar && editToolbar.classList.contains('visible')
                ? (editToolbar.offsetHeight + 15) : 15;
            formatToolbar.style.bottom = bottomOffset + 'px';
        }
        // تنظیم مجدد padding در صورت تغییر اندازه صفحه
        if (sidebar && sidebar.classList.contains('open')) {
            if (window.innerWidth > 900) {
                document.body.style.paddingRight = SIDEBAR_WIDTH + 'px';
            } else {
                document.body.style.paddingRight = '';
            }
        }
    }, { passive: true });

    // ============================================================
    // ================= ردیابی کرسر =================
    // ============================================================
    function updateActiveCaret() {
        if (!isEditMode) return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;

        const range = sel.getRangeAt(0);
        let node = range.commonAncestorContainer;
        if (node.nodeType === 3) node = node.parentNode;

        const editable = node.closest ? node.closest('[contenteditable="true"]') : null;
        if (!editable) return;

        activeCaretRange = range.cloneRange();
        activeEditableElement = editable;

        const topic = editable.closest ? editable.closest('.topic') : null;
        if (topic) lastActiveTopic = topic;

        showInlineButtons(editable);
    }

    function showInlineButtons(editable) {
        if (editable.classList && editable.classList.contains('time-editable')) return;

        if (!activeInsertImgBtn) {
            activeInsertImgBtn = document.createElement('button');
            activeInsertImgBtn.className = 'inline-insert-img-btn';
            activeInsertImgBtn.innerHTML = '🖼';
            activeInsertImgBtn.title = 'درج عکس اینجا';
            activeInsertImgBtn.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            activeInsertImgBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                updateCaretFromSelection();
                openImageInsertModal();
            });
            document.body.appendChild(activeInsertImgBtn);
        }

        if (!activeInsertLinkBtn) {
            activeInsertLinkBtn = document.createElement('button');
            activeInsertLinkBtn.className = 'inline-insert-link-btn';
            activeInsertLinkBtn.innerHTML = '🔗';
            activeInsertLinkBtn.title = 'درج لینک اینجا';
            activeInsertLinkBtn.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            activeInsertLinkBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                updateCaretFromSelection();
                openLinkInsertModal();
            });
            document.body.appendChild(activeInsertLinkBtn);
        }

        const rect = editable.getBoundingClientRect();
        const btnSize = 38;
        const gap = 6;

        let left = rect.left - btnSize - 8;
        let topImg = rect.top + 5;
        let topLink = rect.top + 5 + btnSize + gap;

        if (left < 10) left = rect.right + 8;
        if (topImg < 10) topImg = 10;
        if (topImg + btnSize > window.innerHeight - 10) topImg = window.innerHeight - btnSize - 10;
        if (topLink + btnSize > window.innerHeight - 10) topLink = window.innerHeight - btnSize - 10;

        activeInsertImgBtn.style.left = left + 'px';
        activeInsertImgBtn.style.top = topImg + 'px';
        activeInsertImgBtn.classList.add('visible');

        activeInsertLinkBtn.style.left = left + 'px';
        activeInsertLinkBtn.style.top = topLink + 'px';
        activeInsertLinkBtn.classList.add('visible');
    }

    function updateCaretFromSelection() {
        if (!activeEditableElement) return;
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            let node = sel.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            const currentEditable = node.closest ? node.closest('[contenteditable="true"]') : null;
            if (currentEditable === activeEditableElement) {
                activeCaretRange = sel.getRangeAt(0).cloneRange();
            }
        }
    }

    function hideInlineButtons() {
        if (activeInsertImgBtn) activeInsertImgBtn.classList.remove('visible');
        if (activeInsertLinkBtn) activeInsertLinkBtn.classList.remove('visible');
    }

    // ============================================================
    // ================= درج عکس =================
    // ============================================================
    function insertImageFromFolder(filename, targetElement) {
        if (!filename || !filename.trim()) {
            showToast('❌ نام فایل رو وارد کنید', 'error');
            return false;
        }
        filename = extractFilenameFromPath(filename);
        if (!filename) {
            showToast('❌ نام فایل معتبر نیست', 'error');
            return false;
        }

        const src = 'img/' + filename;
        const img = document.createElement('img');
        img.src = src;
        img.className = 'inserted-image';
        img.alt = filename;
        img.setAttribute('data-filename', filename);
        img.setAttribute('data-size', '100');
        img.setAttribute('data-align', 'right');
        img.loading = 'lazy';
        img.style.width = '100%';

        let target = targetElement;
        let insertedViaRange = false;

        if (!target && activeCaretRange && activeEditableElement && activeEditableElement.isConnected) {
            try {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(activeCaretRange);
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);
                insertedViaRange = true;

                let parent = img.parentNode;
                while (parent && !parent.hasAttribute('contenteditable')) parent = parent.parentNode;
                if (parent) parent.setAttribute('data-edited', 'true');
            } catch(e) {
                insertedViaRange = false;
            }
        }

        if (!insertedViaRange && !target) {
            if (savedRange) {
                let node = savedRange.commonAncestorContainer;
                if (node.nodeType === 3) node = node.parentNode;
                target = node.closest ? node.closest('[contenteditable="true"]') : null;
            }
            if (!target) {
                const editables = document.querySelectorAll('[contenteditable="true"]');
                if (editables.length > 0) target = editables[editables.length - 1];
            }
            if (!target) target = document.querySelector('.topic-desc');
            if (target) {
                target.appendChild(document.createElement('br'));
                target.appendChild(img);
                target.setAttribute('data-edited', 'true');
            }
        }

        if (!insertedViaRange && !target) {
            showToast('❌ محلی برای درج عکس پیدا نشد', 'error');
            return false;
        }

        img.addEventListener('error', function() {
            this.classList.add('image-error');
            const fname = this.getAttribute('data-filename') || filename;
            showToast('⚠️ عکس در مسیر img/' + fname + ' پیدا نشد', 'error');
        });

        img.addEventListener('click', function(e) {
            if (isEditMode) {
                e.stopPropagation();
                showImageToolbar(this);
            } else {
                openLightbox(this.src);
            }
        });

        attachSingleImageListener(img);
        markDirty();
        showToast('🖼 عکس درج شد: img/' + filename, 'success');
        return true;
    }

    function updateImagePreview() {
        if (!imageFilenameInput || !imagePreviewBox) return;
        const filename = extractFilenameFromPath(imageFilenameInput.value);
        if (!filename) {
            imagePreviewBox.innerHTML = '<span>پیش‌نمایش عکس اینجا نمایش داده می‌شود</span>';
            return;
        }
        imagePreviewBox.innerHTML = '<span style="opacity:0.5;">در حال بارگذاری...</span>';
        const testImg = new Image();
        testImg.onload = function() {
            imagePreviewBox.innerHTML = '';
            const previewImg = document.createElement('img');
            previewImg.src = 'img/' + filename + '?_=' + Date.now();
            previewImg.alt = filename;
            imagePreviewBox.appendChild(previewImg);
        };
        testImg.onerror = function() {
            imagePreviewBox.innerHTML = '<div class="preview-error">❌ عکس در مسیر <code>img/' + filename + '</code> پیدا نشد</div>';
        };
        testImg.src = 'img/' + filename + '?_=' + Date.now();
    }

    function extractFilenameFromPath(path) {
        if (!path) return '';
        let cleaned = String(path).trim();
        cleaned = cleaned.replace(/^["'`]+|["'`]+$/g, '').trim();
        cleaned = cleaned.replace(/\\/g, '/');
        cleaned = cleaned.replace(/^file:\/\/\/?/i, '');
        const lastSlash = cleaned.lastIndexOf('/');
        if (lastSlash >= 0) {
            cleaned = cleaned.substring(lastSlash + 1);
        }
        cleaned = cleaned.split('?')[0].split('#')[0];
        cleaned = cleaned.replace(/^\.?\/?img\//i, '');
        cleaned = cleaned.trim();
        return cleaned;
    }

    if (imageFilenameInput) {
        imageFilenameInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const clipboardData = e.clipboardData || window.clipboardData;
            let pastedText = '';
            if (clipboardData) {
                pastedText = clipboardData.getData('text') || '';
            } else {
                pastedText = '';
            }
            const filename = extractFilenameFromPath(pastedText);

            const start = this.selectionStart || 0;
            const end = this.selectionEnd || 0;
            const currentValue = this.value || '';
            const newValue = currentValue.substring(0, start) + filename + currentValue.substring(end);
            this.value = newValue;

            const newCaretPos = start + filename.length;
            try {
                this.setSelectionRange(newCaretPos, newCaretPos);
            } catch (err) { /* ignore */ }

            updateImagePreview();
        });

        imageFilenameInput.addEventListener('input', updateImagePreview);
        imageFilenameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (imageInsertConfirm) imageInsertConfirm.click();
            }
        });
    }

    function openImageInsertModal() {
        if (!isEditMode) {
            showToast('⚠️ ابتدا حالت ویرایش رو فعال کنید', 'info');
            return;
        }
        if (!imageInsertModal) return;
        imageFilenameInput.value = '';
        imagePreviewBox.innerHTML = '<span>پیش‌نمایش عکس اینجا نمایش داده می‌شود</span>';

        if (recentImagesBox) recentImagesBox.style.display = 'none';
        if (recentThumbs) recentThumbs.innerHTML = '';

        if (activeEditableElement) {
            let label = 'محل کرسر فعلی';
            const el = activeEditableElement;
            if (el.classList.contains('topic-desc')) label = 'توضیحات تاپیک';
            else if (el.classList.contains('note-box')) label = 'نکته تکمیلی';
            else if (el.classList.contains('topic-title')) label = 'عنوان تاپیک';
            else if (el.tagName === 'TD' || el.tagName === 'TH') label = 'سلول جدول';

            const topic = el.closest('.topic');
            if (topic) {
                const titleEl = topic.querySelector('.topic-title');
                if (titleEl) {
                    let t = '';
                    titleEl.childNodes.forEach(function(n) {
                        if (n.nodeType === 3) t += n.textContent;
                    });
                    t = t.trim().substring(0, 40);
                    label = t + ' → ' + label;
                }
            }
            if (imageTargetText) imageTargetText.textContent = 'محل درج: ' + label;
            if (imageTargetInfo) imageTargetInfo.style.display = 'flex';
        } else {
            if (imageTargetInfo) imageTargetInfo.style.display = 'none';
        }

        imageInsertModal.classList.add('open');
        setTimeout(function() { imageFilenameInput.focus(); }, 100);
    }

    if (imageInsertConfirm) {
        imageInsertConfirm.addEventListener('click', function() {
            const filename = imageFilenameInput.value.trim();
            if (!filename) {
                showToast('❌ نام فایل رو وارد کنید', 'error');
                imageFilenameInput.focus();
                return;
            }
            const success = insertImageFromFolder(filename);
            if (success) imageInsertModal.classList.remove('open');
        });
    }

    if (imageInsertCancel) {
        imageInsertCancel.addEventListener('click', function() {
            imageInsertModal.classList.remove('open');
        });
    }

    if (imageInsertModal) {
        imageInsertModal.addEventListener('click', function(e) {
            if (e.target === imageInsertModal) imageInsertModal.classList.remove('open');
        });
    }

    if (insertImageBtn) insertImageBtn.addEventListener('click', openImageInsertModal);

    // ============================================================
    // ================= درج لینک =================
    // ============================================================
    let currentLinkType = 'web';
    let pendingLinkRange = null;
    let pendingLinkText = '';

    function setLinkType(type) {
        currentLinkType = type;
        if (type === 'web') {
            linkTypeWeb.classList.add('active');
            linkTypeLocal.classList.remove('active');
            webLinkSection.classList.add('active');
            localLinkSection.classList.remove('active');
            setTimeout(function() { webLinkUrlInput.focus(); }, 100);
        } else {
            linkTypeWeb.classList.remove('active');
            linkTypeLocal.classList.add('active');
            webLinkSection.classList.remove('active');
            localLinkSection.classList.add('active');
            setTimeout(function() { localLinkUrlInput.focus(); }, 100);
        }
        updateLinkPreview();
    }

    if (linkTypeWeb) linkTypeWeb.addEventListener('click', function() { setLinkType('web'); });
    if (linkTypeLocal) linkTypeLocal.addEventListener('click', function() { setLinkType('local'); });

    function updateLinkPreview() {
        if (!linkPreviewContent) return;
        const displayText = linkDisplayTextInput.value.trim();
        if (displayText) {
            linkPreviewContent.textContent = displayText;
            return;
        }
        if (pendingLinkText) {
            linkPreviewContent.textContent = pendingLinkText.substring(0, 60) +
                (pendingLinkText.length > 60 ? '...' : '');
            return;
        }
        linkPreviewContent.textContent = '—';
    }

    function openLinkInsertModal() {
        if (!isEditMode) {
            showToast('⚠️ ابتدا حالت ویرایش رو فعال کنید', 'info');
            return;
        }
        if (!linkInsertModal) return;
        pendingLinkRange = null;
        pendingLinkText = '';

        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
            let node = sel.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            const editable = node.closest ? node.closest('[contenteditable="true"]') : null;
            if (editable && !editable.classList.contains('time-editable')) {
                pendingLinkRange = sel.getRangeAt(0).cloneRange();
                pendingLinkText = sel.toString().trim();
                activeEditableElement = editable;
            }
        }
        if (!pendingLinkRange && activeCaretRange && activeEditableElement && activeEditableElement.isConnected) {
            pendingLinkRange = activeCaretRange.cloneRange();
        }

        webLinkUrlInput.value = '';
        localLinkUrlInput.value = '';
        linkDisplayTextInput.value = pendingLinkText;
        setLinkType('web');

        if (activeEditableElement) {
            let label = 'محل کرسر فعلی';
            const el = activeEditableElement;
            if (el.classList.contains('topic-desc')) label = 'توضیحات تاپیک';
            else if (el.classList.contains('note-box')) label = 'نکته تکمیلی';
            else if (el.classList.contains('topic-title')) label = 'عنوان تاپیک';
            else if (el.tagName === 'TD' || el.tagName === 'TH') label = 'سلول جدول';

            const topic = el.closest('.topic');
            if (topic) {
                const titleEl = topic.querySelector('.topic-title');
                if (titleEl) {
                    let t = '';
                    titleEl.childNodes.forEach(function(n) {
                        if (n.nodeType === 3) t += n.textContent;
                    });
                    t = t.trim().substring(0, 40);
                    label = t + ' → ' + label;
                }
            }
            if (linkTargetText) linkTargetText.textContent = 'محل درج: ' + label;
            if (linkTargetInfo) linkTargetInfo.style.display = 'flex';
        } else {
            if (linkTargetInfo) linkTargetInfo.style.display = 'none';
        }

        updateLinkPreview();
        linkInsertModal.classList.add('open');
    }

    function insertLink(url, type) {
        if (!pendingLinkRange) {
            showToast('❌ لطفاً ابتدا محل درج لینک رو مشخص کنید', 'error');
            return false;
        }

        let linkText = linkDisplayTextInput.value.trim();
        if (!linkText) linkText = pendingLinkText || url;

        try {
            const a = document.createElement('a');
            a.href = url;
            a.textContent = linkText;
            a.className = 'content-link ' + (type === 'local' ? 'local-link' : 'web-link');
            if (type === 'web') {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }

            const range = pendingLinkRange.cloneRange();
            range.deleteContents();
            range.insertNode(a);

            if (!pendingLinkText) {
                const space = document.createTextNode(' ');
                if (a.nextSibling) a.parentNode.insertBefore(space, a.nextSibling);
                else a.parentNode.appendChild(space);
            }

            markDirty();
            let parent = a.parentNode;
            while (parent && !parent.hasAttribute('contenteditable')) parent = parent.parentNode;
            if (parent) parent.setAttribute('data-edited', 'true');

            showToast('🔗 لینک درج شد: ' + linkText, 'success');
            pendingLinkRange = null;
            pendingLinkText = '';
            return true;
        } catch(e) {
            console.error('Error inserting link:', e);
            showToast('❌ خطا در درج لینک', 'error');
            return false;
        }
    }

    if (linkInsertConfirm) {
        linkInsertConfirm.addEventListener('click', function() {
            let url = '';
            if (currentLinkType === 'web') {
                url = webLinkUrlInput.value.trim();
                if (!url) {
                    showToast('❌ آدرس لینک اینترنتی رو وارد کنید', 'error');
                    webLinkUrlInput.focus();
                    return;
                }
                if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
            } else {
                url = localLinkUrlInput.value.trim();
                if (!url) {
                    showToast('❌ آدرس فایل لوکال رو وارد کنید', 'error');
                    localLinkUrlInput.focus();
                    return;
                }
            }
            const success = insertLink(url, currentLinkType);
            if (success) linkInsertModal.classList.remove('open');
        });
    }

    if (linkInsertCancel) {
        linkInsertCancel.addEventListener('click', function() {
            linkInsertModal.classList.remove('open');
            pendingLinkRange = null;
            pendingLinkText = '';
        });
    }

    if (linkInsertModal) {
        linkInsertModal.addEventListener('click', function(e) {
            if (e.target === linkInsertModal) {
                linkInsertModal.classList.remove('open');
                pendingLinkRange = null;
                pendingLinkText = '';
            }
        });
    }

    if (webLinkUrlInput) {
        webLinkUrlInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); linkInsertConfirm.click(); }
        });
    }
    if (localLinkUrlInput) {
        localLinkUrlInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); linkInsertConfirm.click(); }
        });
    }
    if (linkDisplayTextInput) {
        linkDisplayTextInput.addEventListener('input', updateLinkPreview);
    }

    if (insertLinkBtn) {
        insertLinkBtn.addEventListener('click', function() {
            const sel = window.getSelection();
            if (sel && !sel.isCollapsed) {
                let node = sel.getRangeAt(0).commonAncestorContainer;
                if (node.nodeType === 3) node = node.parentNode;
                const editable = node.closest ? node.closest('[contenteditable="true"]') : null;
                if (editable && !editable.classList.contains('time-editable')) {
                    activeEditableElement = editable;
                    activeCaretRange = sel.getRangeAt(0).cloneRange();
                }
            }
            openLinkInsertModal();
        });
    }

    // ============================================================
    // ================= درج بلوک =================
    // ============================================================
    function escapeHTML(value) {
        const node = document.createElement('div');
        node.textContent = value;
        return node.innerHTML;
    }

    function updateBlockInsertFields() {
        if (!blockTypeInput) return;
        const type = blockTypeInput.value;
        blockLanguageInput.closest('.block-language-row').style.display = type === 'code' ? '' : 'none';
        blockCaptionInput.closest('.block-caption-row').style.display = type === 'formula' ? '' : 'none';
        blockTextInput.placeholder = type === 'formula'
            ? '$$\\frac{a}{b}$$'
            : (type === 'code' ? 'کد را وارد کنید...' : 'متن مستقل را وارد کنید...');
    }

    let editingCustomBlock = null;

    function setBlockModalMode(isEditing) {
        if (!blockInsertModal) return;
        const heading = blockInsertModal.querySelector('h3');
        const help = blockInsertModal.querySelector('.block-insert-help');
        if (heading) heading.textContent = isEditing ? '✎ ویرایش محتوای درج‌شده' : '＋ درج محتوای مستقل';
        if (help) {
            help.textContent = isEditing
                ? 'محتوای این بلوک جایگزین می‌شود؛ نوع آن را هم می‌توانید تغییر دهید.'
                : 'این بلوک بعد از محل کرسر در همان تاپیک درج می‌شود.';
        }
        if (blockInsertConfirm) {
            blockInsertConfirm.textContent = isEditing ? '✓ ذخیره تغییرات' : '✓ درج بلوک';
        }
    }

    function openBlockInsertModal() {
        if (!isEditMode) return;
        if (!activeEditableElement) {
            showToast('❌ ابتدا محل درج را در یک تاپیک انتخاب کنید', 'error');
            return;
        }
        ensureBlockInsertUI();
        editingCustomBlock = null;
        blockTextInput.value = '';
        blockCaptionInput.value = '';
        blockTypeInput.value = 'text';
        setBlockModalMode(false);
        updateBlockInsertFields();
        blockInsertModal.classList.add('open');
        setTimeout(function() { blockTextInput.focus(); }, 100);
    }

    function openBlockEditModal(block) {
        if (!isEditMode || !block) return;
        ensureBlockInsertUI();
        editingCustomBlock = block;
        const type = blockTypeOf(block);

        if (type === 'formula') {
            blockTypeInput.value = 'formula';
            blockTextInput.value = block.getAttribute('data-formula') || '';
            blockCaptionInput.value = block.getAttribute('data-caption') || '';
        } else if (type === 'code') {
            blockTypeInput.value = 'code';
            const codeEl = block.querySelector('code');
            blockTextInput.value = codeEl ? codeEl.textContent : '';
            blockCaptionInput.value = '';
            const match = codeEl ? (codeEl.className || '').match(/language-([\w-]+)/) : null;
            const lang = match ? match[1] : 'plaintext';
            const exists = Array.prototype.some.call(blockLanguageInput.options, function(o) {
                return o.value === lang;
            });
            blockLanguageInput.value = exists ? lang : 'plaintext';
        } else {
            blockTypeInput.value = 'text';
            blockTextInput.value = getBlockPlainText(block).trim();
            blockCaptionInput.value = '';
        }

        setBlockModalMode(true);
        updateBlockInsertFields();
        blockInsertModal.classList.add('open');
        setTimeout(function() { blockTextInput.focus(); }, 100);
    }

    function insertIndependentBlock() {
        const text = blockTextInput.value.trim();
        const type = blockTypeInput.value;
        if (!text) {
            showToast('❌ محتوا نمی‌تواند خالی باشد', 'error');
            blockTextInput.focus();
            return;
        }
        const topic = editingCustomBlock
            ? editingCustomBlock.closest('.topic')
            : (activeEditableElement ? activeEditableElement.closest('.topic') : null);
        if (!topic) {
            showToast('❌ محل درج باید داخل یک تاپیک باشد', 'error');
            return;
        }
        const block = document.createElement('div');
        block.dataset.customBlock = 'true';
        block.dataset.topicIndex = Array.prototype.indexOf.call(document.querySelectorAll('.topic'), topic);
        if (type === 'formula') {
            const formula = (text.startsWith('$$') || text.startsWith('$') ||
                text.startsWith('\\[') || text.startsWith('\\(')) ? text : '$$' + text + '$$';
            const caption = blockCaptionInput.value.trim();
            block.className = 'math-block';
            block.setAttribute('data-formula', formula);
            block.setAttribute('data-caption', caption);
            block.innerHTML = '<div class="math-formula"></div>' +
                (caption ? '<div class="math-caption"></div>' : '') +
                '<button class="formula-edit-btn" title="ویرایش فرمول">✎</button>';
            const fd = block.querySelector('.math-formula');
            if (fd) fd.textContent = formula;
            const cd = block.querySelector('.math-caption');
            if (cd && caption) cd.textContent = caption;
        } else if (type === 'code') {
            const lang = blockLanguageInput.value || 'plaintext';
            block.className = 'code-block inserted-code-block';
            block.innerHTML = '<div class="code-block-header"><span class="code-lang">' + escapeHTML(lang.toUpperCase()) +
                '</span><div class="code-actions"><button class="code-copy-btn" onclick="copyCode(this)">📋 کپی</button></div></div>' +
                '<pre><code class="language-' + escapeHTML(lang) + '">' + escapeHTML(text) + '</code></pre>';
        } else {
            block.className = 'inserted-text-block';
            block.textContent = text;
        }
        const wasEditing = !!editingCustomBlock;
        if (wasEditing) {
            block.dataset.topicIndex = editingCustomBlock.getAttribute('data-topic-index') ||
                block.dataset.topicIndex;
            editingCustomBlock.replaceWith(block);
            editingCustomBlock = null;
        } else {
            const caretBlock = getCaretBlockInTopic(topic);
            if (caretBlock && caretBlock.parentNode === topic) {
                caretBlock.insertAdjacentElement('afterend', block);
            } else {
                const addNoteBtn = topic.querySelector('.add-note-btn');
                if (addNoteBtn) topic.insertBefore(block, addNoteBtn);
                else topic.appendChild(block);
            }
        }
        if (isEditMode) {
            if (type === 'text') makeElementEditable(block);
            attachCustomBlockTools(block);
        }
        if (type === 'formula') {
            attachFormulaListeners();
            setTimeout(function() { renderMathInElement(block); }, 150);
        }
        if (type === 'code') {
            if (window.Prism) Prism.highlightElement(block.querySelector('code'));
            attachCodeBlockListeners();
        }
        markDirty();
        blockInsertModal.classList.remove('open');
        showToast(wasEditing ? '✅ محتوا ویرایش شد' : '✅ بلوک جدید درج شد', 'success');
    }

    function ensureBlockInsertUI() {
        if (blockInsertModal) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-overlay block-insert-modal';
        wrapper.id = 'blockInsertModal';
        wrapper.innerHTML = '<div class="modal-box"><h3>＋ درج محتوای مستقل</h3>' +
            '<p class="block-insert-help">این بلوک در انتهای همان تاپیک درج می‌شود.</p>' +
            '<label>نوع محتوا</label><select id="blockTypeInput"><option value="text">متن مستقل</option><option value="formula">فرمول LaTeX</option><option value="code">قطعه کد</option></select>' +
            '<div class="block-language-row"><label>زبان کد</label><select id="blockLanguageInput"><option value="python">Python</option><option value="javascript">JavaScript</option><option value="html">HTML</option><option value="css">CSS</option><option value="bash">Bash</option><option value="json">JSON</option><option value="plaintext">متن ساده</option></select></div>' +
            '<div class="block-caption-row"><label>توضیح فرمول (اختیاری)</label><input id="blockCaptionInput" type="text"></div>' +
            '<label>محتوا</label><textarea id="blockTextInput" class="block-content-textarea" spellcheck="false"></textarea>' +
            '<div class="modal-actions"><button class="edit-btn primary" id="blockInsertConfirm">✓ درج بلوک</button><button class="edit-btn" id="blockInsertCancel">انصراف</button></div></div>';
        document.body.appendChild(wrapper);
        blockInsertModal = wrapper;
        blockTypeInput = document.getElementById('blockTypeInput');
        blockTextInput = document.getElementById('blockTextInput');
        blockLanguageInput = document.getElementById('blockLanguageInput');
        blockCaptionInput = document.getElementById('blockCaptionInput');
        blockInsertConfirm = document.getElementById('blockInsertConfirm');
        blockInsertCancel = document.getElementById('blockInsertCancel');
        blockTypeInput.addEventListener('change', updateBlockInsertFields);
        blockInsertConfirm.addEventListener('click', insertIndependentBlock);
        blockInsertCancel.addEventListener('click', function() {
            blockInsertModal.classList.remove('open');
            editingCustomBlock = null;
        });
        blockInsertModal.addEventListener('click', function(e) {
            if (e.target === blockInsertModal) blockInsertModal.classList.remove('open');
        });
    }

    // ============================================================
    // ========== ویرایش فرمول ==========
    // ============================================================
    const formulaButtonBound = new WeakSet();
    const formulaBlockClickBound = new WeakSet();
    const formulaBlockContextBound = new WeakSet();

    let currentFormulaBlock = null;
    let editingFormulaBlock = null;

    function showFormulaToolbar(formulaBlock) {
        if (!formulaToolbar) return;
        currentFormulaBlock = formulaBlock;
        const rect = formulaBlock.getBoundingClientRect();
        let left = rect.right + 10;
        let top = rect.top;

        if (left + 130 > window.innerWidth) left = rect.left - 140;
        if (top < 10) top = 10;
        if (top + 150 > window.innerHeight) top = window.innerHeight - 160;

        formulaToolbar.style.left = left + 'px';
        formulaToolbar.style.top = top + 'px';
        formulaToolbar.classList.add('visible');
    }

    function hideFormulaToolbar() {
        if (formulaToolbar) formulaToolbar.classList.remove('visible');
        currentFormulaBlock = null;
    }

    function attachFormulaListeners() {
        document.querySelectorAll('.math-block').forEach(function(block) {
            const editBtn = block.querySelector('.formula-edit-btn');
            if (editBtn && !formulaButtonBound.has(editBtn)) {
                formulaButtonBound.add(editBtn);
                editBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    showFormulaToolbar(block);
                });
            }

            if (!formulaBlockContextBound.has(block)) {
                formulaBlockContextBound.add(block);
                block.addEventListener('contextmenu', function(e) {
                    if (isEditMode) {
                        e.preventDefault();
                        showFormulaToolbar(block);
                    }
                });
            }

            if (!formulaBlockClickBound.has(block)) {
                formulaBlockClickBound.add(block);
                block.addEventListener('click', function(e) {
                    if (isEditMode && e.target.tagName !== 'BUTTON') {
                        showFormulaToolbar(block);
                    }
                });
            }
        });
    }

    if (formulaToolbar) {
        formulaToolbar.querySelectorAll('.formula-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!currentFormulaBlock || !document.body.contains(currentFormulaBlock)) {
                    showToast('❌ فرمول مورد نظر پیدا نشد', 'error');
                    hideFormulaToolbar();
                    return;
                }

                const blockRef = currentFormulaBlock;
                const action = this.getAttribute('data-formula-action');

                hideFormulaToolbar();

                if (action === 'edit') {
                    openFormulaEditModal(blockRef, false);
                } else if (action === 'edit-caption') {
                    openFormulaEditModal(blockRef, true);
                } else if (action === 'delete') {
                    showModal('حذف فرمول', 'آیا از حذف این فرمول مطمئن هستید؟', function() {
                        if (blockRef && document.body.contains(blockRef)) {
                            blockRef.remove();
                            markDirty();
                            showToast('🗑 فرمول حذف شد', 'info');
                        }
                    });
                }
            });
        });
    }

    function openFormulaEditModal(block, focusCaption) {
        if (!isEditMode) {
            showToast('⚠️ ابتدا حالت ویرایش رو فعال کنید', 'info');
            return;
        }
        if (!block || !document.body.contains(block)) {
            showToast('❌ فرمول مورد نظر پیدا نشد', 'error');
            return;
        }
        if (!formulaEditModal) return;

        editingFormulaBlock = block;
        formulaTextInput.value = block.getAttribute('data-formula') || '';
        formulaCaptionInput.value = block.getAttribute('data-caption') || '';
        updateFormulaPreview();
        formulaEditModal.classList.add('open');
        setTimeout(function() {
            if (focusCaption) formulaCaptionInput.focus();
            else formulaTextInput.focus();
        }, 100);
    }

    function updateFormulaPreview() {
        if (!formulaPreview) return;
        const text = formulaTextInput.value.trim();
        if (!text) {
            formulaPreview.innerHTML = '<span style="opacity: 0.6;">پیش‌نمایش فرمول اینجا نمایش داده می‌شود...</span>';
            return;
        }
        let processed = text;
        if (!(processed.startsWith('$$') || processed.startsWith('$')
              || processed.startsWith('\\[') || processed.startsWith('\\('))) {
            processed = '$$' + processed + '$$';
        }
        formulaPreview.innerHTML = '';
        formulaPreview.textContent = processed;
        setTimeout(function() {
            renderMathInElement(formulaPreview);
        }, 100);
    }

    if (formulaTextInput) formulaTextInput.addEventListener('input', updateFormulaPreview);

    if (formulaEditConfirm) {
        formulaEditConfirm.addEventListener('click', function() {
            if (!editingFormulaBlock || !document.body.contains(editingFormulaBlock)) {
                showToast('❌ فرمول مورد نظر پیدا نشد', 'error');
                formulaEditModal.classList.remove('open');
                editingFormulaBlock = null;
                return;
            }
            const newFormula = formulaTextInput.value.trim();
            const newCaption = formulaCaptionInput.value.trim();
            if (!newFormula) {
                showToast('❌ متن فرمول نمی‌تواند خالی باشد', 'error');
                formulaTextInput.focus();
                return;
            }
            let finalFormula = newFormula;
            if (!(finalFormula.startsWith('$$') || finalFormula.startsWith('$')
                  || finalFormula.startsWith('\\[') || finalFormula.startsWith('\\('))) {
                finalFormula = '$$' + finalFormula + '$$';
            }

            editingFormulaBlock.setAttribute('data-formula', finalFormula);
            editingFormulaBlock.setAttribute('data-caption', newCaption);
            editingFormulaBlock.setAttribute('data-edited', 'true');

            const oldFormulaDiv = editingFormulaBlock.querySelector('.math-formula');
            const newFormulaDiv = document.createElement('div');
            newFormulaDiv.className = 'math-formula';
            newFormulaDiv.textContent = finalFormula;
            if (oldFormulaDiv && oldFormulaDiv.parentNode) {
                oldFormulaDiv.parentNode.replaceChild(newFormulaDiv, oldFormulaDiv);
            } else {
                editingFormulaBlock.insertBefore(newFormulaDiv, editingFormulaBlock.firstChild);
            }

            let captionDiv = editingFormulaBlock.querySelector('.math-caption');
            if (newCaption) {
                if (!captionDiv) {
                    captionDiv = document.createElement('div');
                    captionDiv.className = 'math-caption';
                    newFormulaDiv.insertAdjacentElement('afterend', captionDiv);
                }
                captionDiv.textContent = newCaption;
            } else if (captionDiv) {
                captionDiv.remove();
            }

            const blockToRender = editingFormulaBlock;
            setTimeout(function() {
                renderMathInElement(blockToRender);
            }, 150);

            markDirty();
            formulaEditModal.classList.remove('open');
            showToast('✅ فرمول با موفقیت ویرایش شد', 'success');
            editingFormulaBlock = null;
            currentFormulaBlock = null;
        });
    }

    if (formulaEditCancel) {
        formulaEditCancel.addEventListener('click', function() {
            formulaEditModal.classList.remove('open');
            editingFormulaBlock = null;
            currentFormulaBlock = null;
        });
    }
    if (formulaEditModal) {
        formulaEditModal.addEventListener('click', function(e) {
            if (e.target === formulaEditModal) {
                formulaEditModal.classList.remove('open');
                editingFormulaBlock = null;
                currentFormulaBlock = null;
            }
        });
    }

    // ============================================================
    // ========= ردیابی بلوک کد برای ویرایش HTML =========
    // ============================================================
    const codeBlockDblClickBound = new WeakSet();
    const codeBlockClickBound = new WeakSet();

    let currentCodeBlock = null;

    function attachCodeBlockListeners() {
        document.querySelectorAll('.code-block').forEach(function(block) {
            if (!codeBlockClickBound.has(block)) {
                codeBlockClickBound.add(block);
                block.addEventListener('click', function(e) {
                    if (!isEditMode) return;
                    if (e.target.closest('.code-copy-btn')) return;
                    if (e.target.closest('.block-tools')) return;
                    currentCodeBlock = block;
                    activeEditableElement = block;
                    lastActiveTopic = block.closest('.topic') || lastActiveTopic;

                    block.style.outline = '3px solid #10b981';
                    block.style.outlineOffset = '2px';
                    setTimeout(function() {
                        if (block.style) {
                            block.style.outline = '';
                            block.style.outlineOffset = '';
                        }
                    }, 1500);
                });
            }

            if (!codeBlockDblClickBound.has(block)) {
                codeBlockDblClickBound.add(block);
                block.addEventListener('dblclick', function(e) {
                    if (!isEditMode) return;
                    if (e.target.closest('.code-copy-btn')) return;
                    if (e.target.closest('.block-tools')) return;
                    e.preventDefault();
                    e.stopPropagation();

                    currentCodeBlock = block;
                    activeEditableElement = block;
                    openHtmlEditModal();
                });
            }
        });
    }

    // ============================================================
    // ================= ویرایش HTML =================
    // ============================================================
    let currentHtmlEditTarget = null;
    let originalHtmlEditContent = null;

    function detectHtmlEditTarget() {
        if (activeEditableElement && activeEditableElement.isConnected) {
            if (activeEditableElement.classList.contains('time-editable')) {
                return activeEditableElement.closest('.topic-title') ||
                    activeEditableElement.closest('.topic');
            }
            return activeEditableElement;
        }
        if (currentFormulaBlock && currentFormulaBlock.isConnected) return currentFormulaBlock;
        if (currentCodeBlock && currentCodeBlock.isConnected) return currentCodeBlock;
        if (currentImage && currentImage.isConnected) return currentImage;

        const topics = document.querySelectorAll('.topic');
        let closest = null;
        let minDistance = Infinity;
        const viewportCenter = window.innerHeight / 2;
        topics.forEach(function(topic) {
            const rect = topic.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closest = topic;
            }
        });
        return closest;
    }

    function getHtmlEditTargetLabel(el) {
        if (!el) return 'نامشخص';
        const topic = el.closest ? el.closest('.topic') : null;
        let topicTitle = '';
        if (topic) {
            const titleEl = topic.querySelector('.topic-title');
            if (titleEl) {
                let t = '';
                titleEl.childNodes.forEach(function(n) {
                    if (n.nodeType === 3) t += n.textContent;
                });
                topicTitle = t.trim().substring(0, 30);
            }
        }
        let partLabel = el.tagName.toLowerCase();
        if (el.classList.contains('topic')) partLabel = 'کل تاپیک';
        else if (el.classList.contains('topic-desc')) partLabel = 'توضیحات تاپیک';
        else if (el.classList.contains('note-box')) partLabel = 'نکته تکمیلی';
        else if (el.classList.contains('topic-title')) partLabel = 'عنوان تاپیک';
        else if (el.classList.contains('math-block')) partLabel = 'فرمول ریاضی';
        else if (el.classList.contains('code-block')) partLabel = 'بلوک کد';
        else if (el.classList.contains('inserted-text-block')) partLabel = 'متن مستقل';
        else if (el.tagName === 'IMG') partLabel = 'تصویر';
        else if (el.classList.contains('table-wrap')) partLabel = 'جدول';
        if (topicTitle) return topicTitle + ' → ' + partLabel;
        return partLabel;
    }

    function formatHtmlString(html) {
        const tokens = html
            .replace(/>\s*</g, '>\n<')
            .split('\n')
            .map(function(s) { return s.trim(); })
            .filter(function(s) { return s.length > 0; });

        let indent = 0;
        const result = [];
        const inlineTags = ['a', 'strong', 'em', 'u', 'span', 'code', 'b', 'i', 'small'];
        const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link'];

        tokens.forEach(function(token) {
            const isClosing = /^<\//.test(token);
            const isSelfClose = /\/>$/.test(token);
            const tagMatch = token.match(/^<\/?([a-zA-Z0-9-]+)/);
            const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
            const isInline = inlineTags.indexOf(tagName) !== -1;
            const isVoid = selfClosing.indexOf(tagName) !== -1;

            if (isClosing && !isInline) indent = Math.max(0, indent - 1);
            result.push('  '.repeat(indent) + token);

            const opensAndCloses = new RegExp('^<' + tagName + '[^>]*>.*</' + tagName + '>$').test(token);
            if (!isClosing && !isSelfClose && !isVoid && !isInline && !opensAndCloses) indent++;
        });
        return result.join('\n');
    }

    function updateHtmlPreview() {
        if (!htmlEditPreview) return;
        htmlEditPreview.innerHTML = htmlEditTextarea.value;
        if (window.Prism) {
            htmlEditPreview.querySelectorAll('code[class*="language-"]').forEach(function(c) {
                try { Prism.highlightElement(c); } catch(e) {}
            });
        }
        setTimeout(function() {
            renderMathInElement(htmlEditPreview);
        }, 100);
    }

    function openHtmlEditModal() {
        if (!isEditMode) {
            showToast('⚠️ ابتدا حالت ویرایش رو فعال کنید', 'info');
            return;
        }
        const target = detectHtmlEditTarget();
        if (!target) {
            showToast('❌ عنصری برای ویرایش پیدا نشد', 'error');
            return;
        }
        currentHtmlEditTarget = target;
        originalHtmlEditContent = target.outerHTML;
        htmlEditTextarea.value = formatHtmlString(target.outerHTML);

        if (htmlEditTargetText) htmlEditTargetText.textContent = 'بخش: ' + getHtmlEditTargetLabel(target);
        if (htmlEditTargetInfo) htmlEditTargetInfo.style.display = 'flex';

        updateHtmlPreview();
        htmlEditModal.classList.add('open');
        setTimeout(function() { htmlEditTextarea.focus(); }, 100);
    }

    function confirmHtmlEdit() {
        if (!currentHtmlEditTarget || !currentHtmlEditTarget.isConnected) {
            showToast('❌ المان هدف دیگر موجود نیست', 'error');
            htmlEditModal.classList.remove('open');
            return;
        }
        const newHtml = htmlEditTextarea.value.trim();
        if (!newHtml) {
            showToast('❌ محتوای HTML نمی‌تواند خالی باشد', 'error');
            return;
        }
        try {
            const temp = document.createElement('div');
            temp.innerHTML = newHtml;
            const newElement = temp.firstElementChild;
            if (!newElement) {
                showToast('❌ HTML معتبر نیست', 'error');
                return;
            }
            currentHtmlEditTarget.replaceWith(newElement);
            newElement.setAttribute('data-edited', 'true');

            const topic = newElement.closest('.topic');
            if (topic) {
                const topicIndex = Array.prototype.indexOf.call(document.querySelectorAll('.topic'), topic);
                newElement.setAttribute('data-custom-block', 'true');
                newElement.setAttribute('data-topic-index', String(topicIndex));
            }

            if (isEditMode) {
                EDITABLE_SELECTORS.forEach(function(sel) {
                    newElement.querySelectorAll(sel).forEach(function(el) {
                        el.setAttribute('contenteditable', 'true');
                        el.setAttribute('spellcheck', 'false');
                        el.addEventListener('input', onEditInput);
                        el.addEventListener('focus', onEditFocus);
                        el.addEventListener('blur', onEditBlur);
                    });
                });
            }

            if (window.Prism) {
                newElement.querySelectorAll('code[class*="language-"]').forEach(function(c) {
                    try { Prism.highlightElement(c); } catch(e) {}
                });
            }
            setTimeout(function() {
                attachFormulaListeners();
                attachCodeBlockListeners();
                renderMathInElement(newElement);
            }, 150);

            markDirty();
            htmlEditModal.classList.remove('open');
            showToast('✅ HTML با موفقیت ویرایش شد', 'success');
            currentHtmlEditTarget = null;
            originalHtmlEditContent = null;
            currentCodeBlock = null;
        } catch (e) {
            console.error('HTML edit error:', e);
            showToast('❌ خطا در ویرایش HTML: ' + e.message, 'error');
        }
    }

    function cancelHtmlEdit() {
        htmlEditModal.classList.remove('open');
        currentHtmlEditTarget = null;
        originalHtmlEditContent = null;
        currentCodeBlock = null;
    }

    if (htmlEditTextarea) {
        htmlEditTextarea.addEventListener('input', function() {
            clearTimeout(htmlEditTextarea._previewTimer);
            htmlEditTextarea._previewTimer = setTimeout(updateHtmlPreview, 400);
        });
    }
    if (htmlEditConfirm) htmlEditConfirm.addEventListener('click', confirmHtmlEdit);
    if (htmlEditCancel) htmlEditCancel.addEventListener('click', cancelHtmlEdit);

    if (htmlEditFormat) {
        htmlEditFormat.addEventListener('click', function() {
            htmlEditTextarea.value = formatHtmlString(htmlEditTextarea.value);
            updateHtmlPreview();
            showToast('✨ HTML فرمت شد', 'success');
        });
    }
    if (htmlEditRevert) {
        htmlEditRevert.addEventListener('click', function() {
            if (originalHtmlEditContent) {
                htmlEditTextarea.value = formatHtmlString(originalHtmlEditContent);
                updateHtmlPreview();
                showToast('↺ بازگردانی شد', 'info');
            }
        });
    }
    if (htmlEditModal) {
        htmlEditModal.addEventListener('click', function(e) {
            if (e.target === htmlEditModal) cancelHtmlEdit();
        });
    }
    if (editHtmlBtn) editHtmlBtn.addEventListener('click', openHtmlEditModal);

    // ============================================================
    // ================= مدیریت تصاویر =================
    // ============================================================
    const imageClickListenerBound = new WeakSet();
    const imageErrorHandlerBound = new WeakSet();

    function attachSingleImageListener(img) {
        img.oncontextmenu = function(e) {
            if (isEditMode) {
                e.preventDefault();
                showImageToolbar(this);
            }
        };
    }

    function attachImageListeners() {
        document.querySelectorAll('img.inserted-image, .topic-desc img, .note-box img, .inserted-text-block img, .code-block img').forEach(function(img) {
            attachSingleImageListener(img);
            if (!img.hasAttribute('data-size')) img.setAttribute('data-size', '100');

            if (!imageErrorHandlerBound.has(img)) {
                imageErrorHandlerBound.add(img);
                img.addEventListener('error', function() {
                    this.classList.add('image-error');
                    const fname = this.getAttribute('data-filename') || this.getAttribute('src') || '';
                    showToast('⚠️ عکس پیدا نشد: ' + fname, 'error');
                });
            }

            if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
                img.classList.add('image-error');
            }

            if (!imageClickListenerBound.has(img)) {
                imageClickListenerBound.add(img);
                img.addEventListener('click', function(e) {
                    if (isEditMode) {
                        e.stopPropagation();
                        showImageToolbar(this);
                    } else {
                        openLightbox(this.src);
                    }
                });
            }
        });
    }

    let currentImage = null;

    function markImageParentEdited(img) {
        if (!img) return;
        let parent = img.parentNode;
        while (parent && !(parent.hasAttribute && parent.hasAttribute('contenteditable'))) {
            parent = parent.parentNode;
        }
        if (parent) parent.setAttribute('data-edited', 'true');
        markDirty();
    }

    function setImageAlignment(img, alignment) {
        if (!img) return;
        if (alignment !== 'right' && alignment !== 'center' && alignment !== 'left') return;
        img.setAttribute('data-align', alignment);

        if (imageToolbar) {
            imageToolbar.querySelectorAll('.align-btn').forEach(function(btn) {
                btn.classList.toggle('active', btn.getAttribute('data-img-align') === alignment);
            });
        }
        markImageParentEdited(img);
        const label = alignment === 'right' ? 'راست‌چین'
                    : alignment === 'center' ? 'وسط‌چین' : 'چپ‌چین';
        showToast('✅ تصویر ' + label + ' شد', 'success');
    }

    function showImageToolbar(img) {
        if (!imageToolbar) return;
        currentImage = img;
        const size = parseInt(img.getAttribute('data-size') || '100', 10);
        if (imgSizeLabel) imgSizeLabel.textContent = size + '%';

        const currentAlign = img.getAttribute('data-align') || 'right';
        imageToolbar.querySelectorAll('.align-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-img-align') === currentAlign);
        });

        const rect = img.getBoundingClientRect();
        let left = rect.right + 10;
        let top = rect.top;
        if (left + 60 > window.innerWidth) left = rect.left - 60;
        if (top < 10) top = 10;
        if (top + 320 > window.innerHeight) top = window.innerHeight - 330;
        imageToolbar.style.left = left + 'px';
        imageToolbar.style.top = top + 'px';
        imageToolbar.classList.add('visible');
    }

    function changeImageSize(delta) {
        if (!currentImage) return;
        let size = parseInt(currentImage.getAttribute('data-size') || '100', 10);
        size = size + delta;
        if (size < 10) size = 10;
        if (size > 300) size = 300;
        currentImage.setAttribute('data-size', size);
        currentImage.style.width = size + '%';
        if (imgSizeLabel) imgSizeLabel.textContent = size + '%';
        markImageParentEdited(currentImage);
        setTimeout(function() {
            if (currentImage) {
                const rect = currentImage.getBoundingClientRect();
                let left = rect.right + 10;
                let top = rect.top;
                if (left + 60 > window.innerWidth) left = rect.left - 60;
                if (top < 10) top = 10;
                if (top + 320 > window.innerHeight) top = window.innerHeight - 330;
                imageToolbar.style.left = left + 'px';
                imageToolbar.style.top = top + 'px';
            }
        }, 100);
    }

    if (imageToolbar) {
        imageToolbar.querySelectorAll('.img-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.getAttribute('data-img-action');
                if (!currentImage) return;

                if (action === 'delete') {
                    showModal('حذف تصویر', 'آیا از حذف این تصویر مطمئن هستید؟', function() {
                        markImageParentEdited(currentImage);
                        currentImage.remove();
                        showToast('🗑 تصویر حذف شد', 'info');
                    });
                    imageToolbar.classList.remove('visible');
                } else if (action === 'edit') {
                    const currentFilename = currentImage.getAttribute('data-filename') || '';
                    showModal('ویرایش نام فایل', 'نام جدید فایل (بدون img/):',
                        function(newName) {
                            if (newName && newName.trim()) {
                                newName = newName.trim().replace(/^\.?\/?img\//i, '');
                                currentImage.src = 'img/' + newName;
                                currentImage.setAttribute('data-filename', newName);
                                currentImage.alt = newName;
                                markImageParentEdited(currentImage);
                                showToast('✎ نام فایل تغییر کرد', 'success');
                            }
                        },
                        '<input type="text" id="imgNameInput" placeholder="my-image.png" value="' + currentFilename + '">'
                    );
                    setTimeout(function() {
                        const inp = document.getElementById('imgNameInput');
                        if (inp) inp.focus();
                    }, 100);
                    imageToolbar.classList.remove('visible');
                } else if (action === 'size-up') changeImageSize(10);
                else if (action === 'size-down') changeImageSize(-10);
                else if (action === 'size-reset') {
                    currentImage.setAttribute('data-size', '100');
                    currentImage.style.width = '100%';
                    if (imgSizeLabel) imgSizeLabel.textContent = '100%';
                    markImageParentEdited(currentImage);
                    showToast('↺ سایز به ۱۰۰٪ بازگشت', 'info');
                }
            });
        });
    }

    function openLightbox(src) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.classList.add('open');
    }
    if (lightboxClose) lightboxClose.addEventListener('click', function() { lightbox.classList.remove('open'); });
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) lightbox.classList.remove('open');
        });
    }

    // ============================================================
    // ========= ابزارهای بلوک‌ها =========
    // ============================================================
    function getBlockPlainText(block) {
        const clone = block.cloneNode(true);
        clone.querySelectorAll('.block-tools').forEach(function(el) { el.remove(); });
        return clone.textContent;
    }
    function blockTypeOf(block) {
        if (!block || !block.classList) return 'text';
        if (block.classList.contains('math-block')) return 'formula';
        if (block.classList.contains('code-block')) return 'code';
        if (block.classList.contains('note-box')) return 'note';
        return 'text';
    }
    function moveBlock(block, direction) {
        const topic = block.closest('.topic');
        if (!topic) return;
        const blocks = getTopicBlocks(topic);
        const index = blocks.indexOf(block);
        const targetIndex = index + direction;
        if (index < 0 || targetIndex < 0 || targetIndex >= blocks.length) {
            showToast('⚠️ امکان جابه‌جایی بیشتر وجود ندارد', 'info');
            return;
        }
        const target = blocks[targetIndex];
        if (direction < 0) topic.insertBefore(block, target);
        else topic.insertBefore(block, target.nextSibling);
        markDirty();
        showToast(direction < 0 ? '↑ یک مرحله بالا رفت' : '↓ یک مرحله پایین رفت', 'success');
    }

    function attachCustomBlockTools(block) {
        if (!block || block.querySelector('.block-tools')) return;
        const type = blockTypeOf(block);
        const tools = document.createElement('div');
        tools.className = 'block-tools';
        tools.setAttribute('contenteditable', 'false');

        function addBtn(label, title, className, handler) {
            const b = document.createElement('button');
            b.className = 'block-tool-btn' + (className ? ' ' + className : '');
            b.innerHTML = label;
            b.title = title;
            b.setAttribute('contenteditable', 'false');
            b.addEventListener('mousedown', function(e) { e.preventDefault(); });
            b.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handler();
            });
            tools.appendChild(b);
            return b;
        }

        addBtn('↑', 'انتقال به بالا', '', function() { moveBlock(block, -1); });
        addBtn('↓', 'انتقال به پایین', '', function() { moveBlock(block, 1); });

        if (type === 'formula') addBtn('✎', 'ویرایش فرمول', 'info', function() { openFormulaEditModal(block, false); });
        else if (type === 'code') addBtn('✎', 'ویرایش HTML کد', 'info', function() {
            activeEditableElement = block;
            currentCodeBlock = block;
            openHtmlEditModal();
        });
        else if (type !== 'note') addBtn('✎', 'ویرایش محتوا', 'info', function() { openBlockEditModal(block); });

        addBtn('⧉', 'تکثیر این بلوک', 'success', function() {
            const copy = cleanNodeForStorage(block);
            block.insertAdjacentElement('afterend', copy);
            if (isEditMode) {
                if (blockTypeOf(copy) === 'text' || blockTypeOf(copy) === 'note') {
                    makeElementEditable(copy);
                }
                attachCustomBlockTools(copy);
            }
            attachFormulaListeners();
            attachImageListeners();
            attachCodeBlockListeners();
            if (blockTypeOf(copy) === 'formula') {
                setTimeout(function() { renderMathInElement(copy); }, 150);
            }
            if (window.Prism && copy.querySelector('code')) {
                window.Prism.highlightElement(copy.querySelector('code'));
            }
            markDirty();
            showToast('⧉ یک نسخه کپی شد', 'success');
        });

        addBtn('🗑', 'حذف این بلوک', 'danger', function() {
            showModal('حذف محتوا', 'آیا از حذف این بخش مطمئن هستید؟', function() {
                block.remove();
                markDirty();
                hideFormulaToolbar();
                showToast('🗑 حذف شد', 'info');
            });
        });

        if (!block.style.position) block.style.position = 'relative';
        block.insertBefore(tools, block.firstChild);
    }

    function attachAllCustomBlockTools() {
        document.querySelectorAll('[data-custom-block="true"]').forEach(attachCustomBlockTools);
    }

    // ============================================================
    // ================= ۱) افزودن تاپیک جدید =================
    // ============================================================
    let topicInsertModal = null;
    let topicSessionSelect = null;
    let topicTitleInput = null;
    let topicTimeInput = null;
    let topicDescInput = null;
    let topicNoteInput = null;
    let topicPositionSelect = null;
    let topicInsertCaretTopic = null;

    function ensureTopicInsertUI() {
        if (topicInsertModal) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-overlay topic-insert-modal';
        wrapper.id = 'topicInsertModal';
        wrapper.innerHTML =
            '<div class="modal-box">' +
                '<h3>＋ افزودن تاپیک جدید</h3>' +
                '<p class="block-insert-help">تاپیک جدید به‌صورت پیش‌فرض <b>بعد از تاپیکی که کرسر در آن است</b> درج می‌شود.</p>' +
                '<div class="target-info" id="topicCaretInfo">' +
                    '<span class="target-icon">⌖</span>' +
                    '<span>تاپیک مرجع (محل کرسر): <b id="topicCaretText">—</b></span>' +
                '</div>' +
                '<label>جلسه مقصد</label><select id="topicSessionSelect"></select>' +
                '<label>عنوان تاپیک</label>' +
                '<input id="topicTitleInput" type="text" class="rtl-input" placeholder="مثلاً: مقدمه‌ای بر شبکه‌های عصبی">' +
                '<label>زمان شروع در ویدیو (اختیاری)</label>' +
                '<input id="topicTimeInput" type="text" placeholder="00:00:00" value="00:00:00">' +
                '<label>توضیحات (هر خط یک بند می‌شود)</label>' +
                '<textarea id="topicDescInput" class="block-content-textarea rtl-input" spellcheck="false" placeholder="خط اول توضیحات&#10;خط دوم توضیحات"></textarea>' +
                '<label>نکته تکمیلی (اختیاری)</label>' +
                '<textarea id="topicNoteInput" class="block-content-textarea short rtl-input" spellcheck="false"></textarea>' +
                '<label>محل درج</label><select id="topicPositionSelect"></select>' +
                '<div class="modal-actions">' +
                    '<button class="edit-btn primary" id="topicInsertConfirm">✓ افزودن تاپیک</button>' +
                    '<button class="edit-btn" id="topicInsertCancel">انصراف</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(wrapper);

        topicInsertModal = wrapper;
        topicSessionSelect = document.getElementById('topicSessionSelect');
        topicTitleInput = document.getElementById('topicTitleInput');
        topicTimeInput = document.getElementById('topicTimeInput');
        topicDescInput = document.getElementById('topicDescInput');
        topicNoteInput = document.getElementById('topicNoteInput');
        topicPositionSelect = document.getElementById('topicPositionSelect');

        document.getElementById('topicInsertConfirm').addEventListener('click', confirmTopicInsert);
        document.getElementById('topicInsertCancel').addEventListener('click', closeTopicInsertModal);
        topicSessionSelect.addEventListener('change', syncTopicPositionOptions);
        wrapper.addEventListener('click', function(e) {
            if (e.target === wrapper) closeTopicInsertModal();
        });
        topicTitleInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); confirmTopicInsert(); }
        });
    }

    function getSessionLabel(card, index) {
        const badge = card.querySelector('.session-badge');
        const titleEl = card.querySelector('.session-title');
        let title = '';
        if (titleEl) {
            titleEl.childNodes.forEach(function(node) {
                if (node.nodeType === 3) title += node.textContent;
            });
            title = title.trim();
        }
        const badgeText = badge ? badge.textContent.trim().replace(/\s+/g, ' ') : '';
        return (badgeText ? badgeText + ' — ' : 'جلسه ' + (index + 1) + ' — ') + (title || 'بدون عنوان');
    }

    function getTopicTitleText(topic) {
        let text = '';
        const titleEl = topic ? topic.querySelector('.topic-title') : null;
        if (titleEl) {
            titleEl.childNodes.forEach(function(node) {
                if (node.nodeType === 3) text += node.textContent;
            });
        }
        text = text.trim();
        return text ? (text.length > 28 ? text.slice(0, 28) + '…' : text) : 'بدون عنوان';
    }

    function getCaretTopic() {
        if (activeEditableElement && document.body.contains(activeEditableElement)) {
            const topic = activeEditableElement.closest('.topic');
            if (topic) return topic;
        }
        if (lastActiveTopic && document.body.contains(lastActiveTopic)) return lastActiveTopic;

        const topics = document.querySelectorAll('.topic');
        if (!topics.length) return null;
        let closest = null;
        let minDistance = Infinity;
        const viewportCenter = window.innerHeight / 2;
        topics.forEach(function(topic) {
            const rect = topic.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closest = topic;
            }
        });
        return closest;
    }

    function syncTopicPositionOptions() {
        const sessions = document.querySelectorAll('.session-card');
        const card = sessions[parseInt(topicSessionSelect.value, 10) || 0];
        const previous = topicPositionSelect.value;

        const caretOk = topicInsertCaretTopic &&
            document.body.contains(topicInsertCaretTopic) &&
            card && card.contains(topicInsertCaretTopic);

        topicPositionSelect.innerHTML = '';
        if (caretOk) {
            const opt = document.createElement('option');
            opt.value = 'after-caret';
            opt.textContent = '⌖ بعد از تاپیک محل کرسر: ' + getTopicTitleText(topicInsertCaretTopic);
            topicPositionSelect.appendChild(opt);
        }
        [['end', 'انتهای جلسه'], ['start', 'ابتدای جلسه']].forEach(function(pair) {
            const opt = document.createElement('option');
            opt.value = pair[0];
            opt.textContent = pair[1];
            topicPositionSelect.appendChild(opt);
        });

        if (caretOk) topicPositionSelect.value = 'after-caret';
        else {
            const values = Array.prototype.map.call(topicPositionSelect.options, function(o) { return o.value; });
            topicPositionSelect.value = values.indexOf(previous) > -1 ? previous : 'end';
        }

        const caretInfo = document.getElementById('topicCaretInfo');
        const caretText = document.getElementById('topicCaretText');
        if (caretInfo && caretText) {
            if (caretOk) {
                caretInfo.style.display = 'flex';
                caretText.textContent = getTopicTitleText(topicInsertCaretTopic);
            } else {
                caretInfo.style.display = 'none';
                caretText.textContent = '—';
            }
        }
    }

    function openTopicInsertModal(preferredSession) {
        ensureTopicInsertUI();
        const sessions = document.querySelectorAll('.session-card');
        if (!sessions.length) {
            showToast('❌ هیچ جلسه‌ای برای افزودن تاپیک پیدا نشد', 'error');
            return;
        }

        topicSessionSelect.innerHTML = '';
        sessions.forEach(function(card, index) {
            const opt = document.createElement('option');
            opt.value = String(index);
            opt.textContent = getSessionLabel(card, index);
            topicSessionSelect.appendChild(opt);
        });

        topicInsertCaretTopic = getCaretTopic();
        let targetIndex = 0;
        if (preferredSession) {
            const idx = Array.prototype.indexOf.call(sessions, preferredSession);
            if (idx > -1) targetIndex = idx;
        } else if (topicInsertCaretTopic) {
            const card = topicInsertCaretTopic.closest('.session-card');
            const idx = Array.prototype.indexOf.call(sessions, card);
            if (idx > -1) targetIndex = idx;
        }
        topicSessionSelect.value = String(targetIndex);

        if (!topicInsertCaretTopic || !sessions[targetIndex].contains(topicInsertCaretTopic)) {
            topicInsertCaretTopic = null;
        }
        syncTopicPositionOptions();

        topicTitleInput.value = '';
        topicDescInput.value = '';
        topicNoteInput.value = '';
        topicTimeInput.value = '00:00:00';

        topicInsertModal.classList.add('open');
        setTimeout(function() { topicTitleInput.focus(); }, 100);
    }

    function closeTopicInsertModal() {
        if (topicInsertModal) topicInsertModal.classList.remove('open');
    }

    function confirmTopicInsert() {
        const title = topicTitleInput.value.trim();
        if (!title) {
            showToast('❌ عنوان تاپیک نمی‌تواند خالی باشد', 'error');
            topicTitleInput.focus();
            return;
        }
        const sessions = document.querySelectorAll('.session-card');
        const card = sessions[parseInt(topicSessionSelect.value, 10) || 0];
        if (!card) {
            showToast('❌ جلسه مقصد پیدا نشد', 'error');
            return;
        }
        const body = card.querySelector('.session-body') || card;
        const topic = createNewTopic({
            title: title,
            time: topicTimeInput.value,
            desc: topicDescInput.value,
            note: topicNoteInput.value
        });

        const position = topicPositionSelect.value;
        const caretTopic = topicInsertCaretTopic;

        if (position === 'after-caret' && caretTopic &&
            document.body.contains(caretTopic) && body.contains(caretTopic)) {
            caretTopic.insertAdjacentElement('afterend', topic);
        } else if (position === 'start') {
            const firstTopic = body.querySelector('.topic');
            if (firstTopic) body.insertBefore(topic, firstTopic);
            else body.insertBefore(topic, body.firstChild);
        } else {
            const addBtn = body.querySelector('.add-topic-btn');
            if (addBtn) body.insertBefore(topic, addBtn);
            else body.appendChild(topic);
        }

        lastActiveTopic = topic;
        attachImageListeners();
        attachFormulaListeners();
        attachCodeBlockListeners();
        markDirty();
        refreshSidebar();
        closeTopicInsertModal();

        if (typeof topic.scrollIntoView === 'function') {
            topic.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        topic.style.transition = 'background 0.3s ease';
        topic.style.background = 'rgba(16, 185, 129, 0.12)';
        setTimeout(function() { topic.style.background = ''; }, 1500);
        showToast('➕ تاپیک جدید بعد از محل کرسر درج شد', 'success');
    }

    // ============================================================
    // ================= ۲) افزودن نکته =================
    // ============================================================
    let noteInsertModal = null;
    let noteLabelInput = null;
    let noteTextInput = null;
    let noteTargetText = null;
    let noteTargetTopic = null;
    let noteCaretBlock = null;

    function getCaretBlockInTopic(topic) {
        if (!topic || !activeEditableElement) return null;
        if (!document.body.contains(activeEditableElement)) return null;
        if (!topic.contains(activeEditableElement)) return null;
        let block = activeEditableElement;
        while (block && block.parentNode !== topic) block = block.parentNode;
        if (!block || block.nodeType !== 1) return null;
        if (block.classList.contains('delete-topic-btn') ||
            block.classList.contains('add-note-btn')) return null;
        return block;
    }

    function describeBlock(block) {
        if (!block || !block.classList) return 'این بخش';
        if (block.classList.contains('topic-title')) return 'عنوان تاپیک';
        if (block.classList.contains('topic-desc')) return 'توضیحات';
        if (block.classList.contains('note-box')) return 'نکته فعلی';
        if (block.classList.contains('math-block')) return 'فرمول';
        if (block.classList.contains('code-block')) return 'قطعه کد';
        if (block.classList.contains('inserted-text-block')) return 'متن درج‌شده';
        if (block.classList.contains('table-wrap') || block.tagName === 'TABLE') return 'جدول';
        return 'این بخش';
    }

    function ensureNoteInsertUI() {
        if (noteInsertModal) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-overlay note-insert-modal';
        wrapper.id = 'noteInsertModal';
        wrapper.innerHTML =
            '<div class="modal-box">' +
                '<h3>◈ افزودن نکته</h3>' +
                '<div class="target-info" id="noteTargetInfo">تاپیک مقصد: <span id="noteTargetText">—</span></div>' +
                '<label>عنوان نکته</label>' +
                '<select id="noteLabelSelect">' +
                    '<option value="◈ نکته تکمیلی">◈ نکته تکمیلی</option>' +
                    '<option value="⚠ هشدار">⚠ هشدار</option>' +
                    '<option value="💡 ایده کلیدی">💡 ایده کلیدی</option>' +
                    '<option value="📖 مثال">📖 مثال</option>' +
                    '<option value="__custom__">عنوان دلخواه…</option>' +
                '</select>' +
                '<input id="noteLabelInput" type="text" class="rtl-input" placeholder="عنوان دلخواه نکته" style="display:none;">' +
                '<label>متن نکته (هر خط یک بند می‌شود)</label>' +
                '<textarea id="noteTextInput" class="block-content-textarea rtl-input" spellcheck="false"></textarea>' +
                '<label>محل درج</label><select id="notePositionSelect"></select>' +
                '<div class="modal-actions">' +
                    '<button class="edit-btn primary" id="noteInsertConfirm">✓ افزودن نکته</button>' +
                    '<button class="edit-btn" id="noteInsertCancel">انصراف</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(wrapper);

        noteInsertModal = wrapper;
        noteLabelInput = document.getElementById('noteLabelInput');
        noteTextInput = document.getElementById('noteTextInput');
        noteTargetText = document.getElementById('noteTargetText');

        const labelSelect = document.getElementById('noteLabelSelect');
        labelSelect.addEventListener('change', function() {
            const custom = this.value === '__custom__';
            noteLabelInput.style.display = custom ? '' : 'none';
            if (custom) noteLabelInput.focus();
        });

        document.getElementById('noteInsertConfirm').addEventListener('click', confirmNoteInsert);
        document.getElementById('noteInsertCancel').addEventListener('click', closeNoteInsertModal);
        wrapper.addEventListener('click', function(e) {
            if (e.target === wrapper) closeNoteInsertModal();
        });
    }

    function openNoteInsertModal(topic) {
        ensureNoteInsertUI();
        const target = topic || (activeEditableElement && activeEditableElement.closest('.topic'));
        if (!target) {
            showToast('❌ ابتدا داخل یک تاپیک کلیک کنید', 'error');
            return;
        }
        noteTargetTopic = target;
        noteCaretBlock = getCaretBlockInTopic(target);

        const notePositionSelect = document.getElementById('notePositionSelect');
        notePositionSelect.innerHTML = '';
        if (noteCaretBlock) {
            const opt = document.createElement('option');
            opt.value = 'after-caret';
            opt.textContent = '⌖ بعد از ' + describeBlock(noteCaretBlock) + ' (محل کرسر)';
            notePositionSelect.appendChild(opt);
        }
        const endOpt = document.createElement('option');
        endOpt.value = 'end';
        endOpt.textContent = 'انتهای تاپیک';
        notePositionSelect.appendChild(endOpt);
        notePositionSelect.value = noteCaretBlock ? 'after-caret' : 'end';

        let titleText = '';
        const titleEl = target.querySelector('.topic-title');
        if (titleEl) {
            titleEl.childNodes.forEach(function(node) {
                if (node.nodeType === 3) titleText += node.textContent;
            });
        }
        noteTargetText.textContent = titleText.trim() || 'بدون عنوان';

        document.getElementById('noteLabelSelect').value = '◈ نکته تکمیلی';
        noteLabelInput.style.display = 'none';
        noteLabelInput.value = '';
        noteTextInput.value = '';

        noteInsertModal.classList.add('open');
        setTimeout(function() { noteTextInput.focus(); }, 100);
    }

    function closeNoteInsertModal() {
        if (noteInsertModal) noteInsertModal.classList.remove('open');
        noteTargetTopic = null;
        noteCaretBlock = null;
    }

    function confirmNoteInsert() {
        const text = noteTextInput.value.trim();
        if (!text) {
            showToast('❌ متن نکته نمی‌تواند خالی باشد', 'error');
            noteTextInput.focus();
            return;
        }
        if (!noteTargetTopic || !document.body.contains(noteTargetTopic)) {
            showToast('❌ تاپیک مقصد پیدا نشد', 'error');
            return;
        }
        const select = document.getElementById('noteLabelSelect');
        let label = select.value;
        if (label === '__custom__') label = noteLabelInput.value.trim() || '◈ نکته';

        const positionSelect = document.getElementById('notePositionSelect');
        const anchor = (positionSelect && positionSelect.value === 'after-caret') ? noteCaretBlock : null;

        addNoteToTopic(noteTargetTopic, text, label, anchor);
        closeNoteInsertModal();
    }

    function addNoteToTopic(topic, text, label, anchor) {
        if (!topic) return null;
        const lines = String(text || '').split('\n')
            .map(function(l) { return l.trim(); })
            .filter(function(l) { return l.length > 0; });
        if (!lines.length) return null;

        const note = document.createElement('div');
        note.className = 'note-box';
        note.setAttribute('data-custom-block', 'true');
        note.setAttribute('data-topic-index',
            String(Array.prototype.indexOf.call(document.querySelectorAll('.topic'), topic)));

        let inner = '<span class="note-label">' + escapeHTML(label || '◈ نکته تکمیلی') + '</span>';
        if (lines.length === 1) inner += '<p>' + escapeHTML(lines[0]) + '</p>';
        else inner += '<ul>' + lines.map(function(l) {
            return '<li>' + escapeHTML(l) + '</li>';
        }).join('') + '</ul>';
        note.innerHTML = inner;

        if (anchor && anchor.parentNode === topic) {
            anchor.insertAdjacentElement('afterend', note);
        } else {
            const addNoteBtn = topic.querySelector('.add-note-btn');
            if (addNoteBtn) topic.insertBefore(note, addNoteBtn);
            else topic.appendChild(note);
        }
        if (isEditMode) {
            makeElementEditable(note);
            attachCustomBlockTools(note);
        }
        markDirty();
        if (typeof note.scrollIntoView === 'function') {
            note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('◈ نکته اضافه شد', 'success');
        return note;
    }

    // ============================================================
    // ================= ۳) کپی استایل =================
    // ============================================================
    const PAINT_PROPS = [
        'color', 'backgroundColor', 'fontWeight', 'fontStyle',
        'textDecorationLine', 'fontSize', 'fontFamily', 'letterSpacing'
    ];
    let copiedStyle = null;
    let painterContinuous = false;
    let styleCopyBtn = null;
    let styleApplyBtn = null;
    let stylePaintBtn = null;

    function ensureStylePainterUI() {
        if (!formatToolbar) return;

        if (styleCopyBtn && document.body.contains(styleCopyBtn)) return;

        formatToolbar.querySelectorAll(
            '.style-copy, .style-apply, .style-paint, .style-painter-divider'
        ).forEach(function(el) { el.remove(); });

        const lastEl = formatToolbar.lastElementChild;
        const alreadyHasDivider = lastEl &&
            lastEl.classList &&
            lastEl.classList.contains('fmt-divider');

        if (!alreadyHasDivider) {
            const divider = document.createElement('span');
            divider.className = 'fmt-divider style-painter-divider';
            formatToolbar.appendChild(divider);
        }

        styleCopyBtn = document.createElement('button');
        styleCopyBtn.className = 'fmt-btn style-copy';
        styleCopyBtn.innerHTML = '🖌';
        styleCopyBtn.title = 'کپی استایل متن انتخاب‌شده (Ctrl+Alt+C)';
        styleCopyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            captureStyleFromSelection();
        });
        formatToolbar.appendChild(styleCopyBtn);

        styleApplyBtn = document.createElement('button');
        styleApplyBtn.className = 'fmt-btn style-apply';
        styleApplyBtn.innerHTML = '🖍';
        styleApplyBtn.title = 'اعمال استایل کپی‌شده روی متن انتخاب‌شده (Ctrl+Alt+V)';
        styleApplyBtn.disabled = true;
        styleApplyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyCopiedStyleToSelection();
        });
        formatToolbar.appendChild(styleApplyBtn);

        stylePaintBtn = document.createElement('button');
        stylePaintBtn.className = 'fmt-btn style-paint';
        stylePaintBtn.innerHTML = '🔁';
        stylePaintBtn.title = 'حالت قلم‌مو';
        stylePaintBtn.disabled = true;
        stylePaintBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!copiedStyle) {
                showToast('❌ ابتدا استایل یک بخش را کپی کنید', 'error');
                return;
            }
            painterContinuous = !painterContinuous;
            stylePaintBtn.classList.toggle('active', painterContinuous);
            document.body.classList.toggle('style-painter-on', painterContinuous);
            showToast(painterContinuous
                ? '🔁 حالت قلم‌مو روشن شد'
                : 'حالت قلم‌مو خاموش شد', 'info');
        });
        formatToolbar.appendChild(stylePaintBtn);
    }

    function stylePainterDeactivate() {
        painterContinuous = false;
        if (stylePaintBtn) stylePaintBtn.classList.remove('active');
        document.body.classList.remove('style-painter-on');
    }

    function describeStyle(props) {
        const parts = [];
        if (props.color) parts.push('رنگ');
        if (props.backgroundColor) parts.push('پس‌زمینه');
        if (props.fontWeight) parts.push('ضخامت');
        if (props.fontStyle && props.fontStyle !== 'normal') parts.push('ایتالیک');
        if (props.textDecorationLine && props.textDecorationLine !== 'none') parts.push('خط');
        if (props.fontSize) parts.push('اندازه');
        if (props.fontFamily) parts.push('فونت');
        return parts.length ? parts.join(' + ') : 'استایل پایه';
    }

    function captureStyleFromSelection() {
        if (!isEditMode) return;
        const sel = window.getSelection();
        let range = null;
        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) range = sel.getRangeAt(0);
        else if (savedRange) range = savedRange;
        if (!range) {
            showToast('❌ ابتدا متن مبدأ را انتخاب کنید', 'error');
            return;
        }

        let node = range.startContainer;
        if (node.nodeType === 3) node = node.parentNode;
        const root = node.closest ? node.closest('[contenteditable="true"]') : null;
        if (!root) {
            showToast('❌ متن انتخاب‌شده در ناحیه قابل ویرایش نیست', 'error');
            return;
        }

        let target = node;
        if (target === root) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
            while (walker.nextNode()) {
                if (range.intersectsNode(walker.currentNode)) {
                    target = walker.currentNode;
                    break;
                }
            }
        }

        const cs = window.getComputedStyle(target);
        const rs = window.getComputedStyle(root);
        const props = {};
        PAINT_PROPS.forEach(function(p) {
            const value = cs[p];
            if (value && value !== rs[p]) props[p] = value;
        });

        copiedStyle = { props: props, sample: String(range.toString() || '').slice(0, 25) };
        if (styleApplyBtn) styleApplyBtn.disabled = false;
        if (stylePaintBtn) stylePaintBtn.disabled = false;
        if (styleCopyBtn) {
            styleCopyBtn.classList.add('active');
            setTimeout(function() { styleCopyBtn.classList.remove('active'); }, 900);
        }

        if (Object.keys(props).length === 0) {
            showToast('⚠️ استایل خاصی روی این متن پیدا نشد (متن ساده است)', 'info');
        } else {
            showToast('🖌 استایل کپی شد (' + describeStyle(props) + ')', 'success');
        }
    }

    function stripInlineFormatting(fragment) {
        fragment.querySelectorAll('[style]').forEach(function(el) {
            if (el.tagName === 'IMG') return;
            el.removeAttribute('style');
        });
        fragment.querySelectorAll('b, strong, i, em, u, font, span').forEach(function(el) {
            if (el.classList && (el.classList.contains('time-badge') ||
                el.classList.contains('note-label') ||
                el.classList.contains('play-icon'))) return;
            const parent = el.parentNode;
            if (!parent) return;
            while (el.firstChild) parent.insertBefore(el.firstChild, el);
            parent.removeChild(el);
        });
    }

    function applyCopiedStyleToSelection(silent) {
        if (!isEditMode) return;
        if (!copiedStyle) {
            showToast('❌ ابتدا استایل یک بخش را با 🖌 کپی کنید', 'error');
            return;
        }
        const selection = window.getSelection();
        if (!savedRange) {
            showToast('❌ لطفاً ابتدا متن مقصد را انتخاب کنید', 'error');
            return;
        }
        try {
            selection.removeAllRanges();
            selection.addRange(savedRange);
        } catch (e) {
            showToast('❌ لطفاً دوباره متن را انتخاب کنید', 'error');
            return;
        }
        if (selection.isCollapsed) {
            if (!silent) showToast('❌ لطفاً ابتدا متن مقصد را انتخاب کنید', 'error');
            return;
        }
        const range = selection.getRangeAt(0);
        const fragment = range.extractContents();
        stripInlineFormatting(fragment);

        const wrapper = document.createElement('span');
        wrapper.className = 'painted-style';
        const props = copiedStyle.props;
        Object.keys(props).forEach(function(p) {
            if (p === 'textDecorationLine') wrapper.style.textDecoration = props[p];
            else wrapper.style[p] = props[p];
        });
        if (props.backgroundColor) {
            wrapper.style.padding = '0 2px';
            wrapper.style.borderRadius = '3px';
        }
        wrapper.appendChild(fragment);
        range.insertNode(wrapper);

        const newRange = document.createRange();
        newRange.selectNodeContents(wrapper);
        selection.removeAllRanges();
        selection.addRange(newRange);
        savedRange = newRange.cloneRange();

        let parent = wrapper.parentNode;
        while (parent && !(parent.hasAttribute && parent.hasAttribute('contenteditable'))) {
            parent = parent.parentNode;
        }
        if (parent) parent.setAttribute('data-edited', 'true');
        markDirty();
        showToast('🖍 استایل اعمال شد', 'success');
    }

    ensureStylePainterUI();

    document.addEventListener('mouseup', function(e) {
        if (!isEditMode || !painterContinuous || !copiedStyle) return;
        if (formatToolbar && formatToolbar.contains(e.target)) return;
        setTimeout(function() {
            const sel = window.getSelection();
            if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
            let node = sel.getRangeAt(0).commonAncestorContainer;
            if (node.nodeType === 3) node = node.parentNode;
            if (!node.closest || !node.closest('[contenteditable="true"]')) return;
            savedRange = sel.getRangeAt(0).cloneRange();
            applyCopiedStyleToSelection(true);
        }, 70);
    });

    document.addEventListener('keydown', function(e) {
        if (!isEditMode) return;
        if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'c' || e.key === 'C' || e.code === 'KeyC')) {
            e.preventDefault();
            captureStyleFromSelection();
        }
        if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'v' || e.key === 'V' || e.code === 'KeyV')) {
            e.preventDefault();
            applyCopiedStyleToSelection();
        }
        if (e.key === 'Escape' && painterContinuous) {
            stylePainterDeactivate();
            showToast('حالت قلم‌مو خاموش شد', 'info');
        }
    });

    // ============================================================
    // ================= ۴) نمایش عکس در تب مستقل =================
    // ============================================================
    function openImageInNewTab(src, name) {
        if (!src) {
            showToast('❌ تصویری برای نمایش پیدا نشد', 'error');
            return;
        }
        let absolute = src;
        try {
            absolute = new URL(src, document.baseURI).href;
        } catch (e) {}

        const win = window.open('', '_blank');
        if (!win) {
            showToast('❌ مرورگر باز شدن تب جدید را مسدود کرد', 'error');
            return;
        }
        const title = escapeHTML(name || src.split('/').pop() || 'تصویر');
        const safeSrc = absolute.replace(/"/g, '&quot;');

        const page =
            '<!DOCTYPE html><html dir="rtl" lang="fa"><head><meta charset="utf-8">' +
            '<title>' + title + '</title><style>' +
            'html,body{margin:0;padding:0;background:#0a0e17;color:#e2e8f0;font-family:Tahoma,sans-serif;}' +
            '.bar{position:sticky;top:0;display:flex;gap:.5rem;padding:.6rem 1rem;background:#111827;border-bottom:1px solid #1e293b;}' +
            '.bar button,.bar a{background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:.35rem .8rem;font-size:.85rem;cursor:pointer;text-decoration:none;}' +
            '.bar button:hover,.bar a:hover{background:#2563eb;color:#fff;}' +
            '.stage{display:flex;justify-content:center;padding:1.5rem;}' +
            'img{max-width:100%;height:auto;border-radius:10px;box-shadow:0 20px 50px rgba(0,0,0,.6);}' +
            '</style></head><body>' +
            '<div class="bar">' +
            '<button onclick="zoom(20)">＋</button>' +
            '<button onclick="zoom(-20)">－</button>' +
            '<button onclick="zoomReset()">↺</button>' +
            '<a href="' + safeSrc + '" download>⬇ دانلود</a>' +
            '</div>' +
            '<div class="stage"><img id="pic" src="' + safeSrc + '"></div>' +
            '<scr' + 'ipt>' +
            'var pic=document.getElementById("pic");var z=100;' +
            'function zoom(d){z=Math.max(10,Math.min(500,z+d));pic.style.maxWidth="none";pic.style.width=z+"%";}' +
            'function zoomReset(){z=100;pic.style.width="";pic.style.maxWidth="100%";}' +
            '</scr' + 'ipt></body></html>';

        try {
            win.document.open();
            win.document.write(page);
            win.document.close();
        } catch (e) {
            win.location.href = absolute;
        }
    }
    window.openImageInNewTab = openImageInNewTab;

    if (imageToolbar) {
        const alignDivider = document.createElement('div');
        alignDivider.className = 'img-divider dyn-img-divider';
        imageToolbar.appendChild(alignDivider);

        [
            { align: 'right',  label: '⇥', title: 'راست‌چین (پیش‌فرض)' },
            { align: 'center', label: '↔', title: 'وسط‌چین' },
            { align: 'left',   label: '⇤', title: 'چپ‌چین' }
        ].forEach(function(cfg) {
            const btn = document.createElement('button');
            btn.className = 'img-btn align-btn';
            btn.setAttribute('data-img-align', cfg.align);
            btn.innerHTML = cfg.label;
            btn.title = cfg.title;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (!currentImage) return;
                setImageAlignment(currentImage, cfg.align);
            });
            imageToolbar.appendChild(btn);
        });

        const newTabDivider = document.createElement('div');
        newTabDivider.className = 'img-divider dyn-img-divider';
        imageToolbar.appendChild(newTabDivider);

        const newTabBtn = document.createElement('button');
        newTabBtn.className = 'img-btn info';
        newTabBtn.setAttribute('data-img-action', 'newtab');
        newTabBtn.innerHTML = '🗗';
        newTabBtn.title = 'نمایش تصویر در تب مستقل';
        newTabBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!currentImage) return;
            openImageInNewTab(
                currentImage.getAttribute('src'),
                currentImage.getAttribute('data-filename') || currentImage.alt
            );
        });
        imageToolbar.appendChild(newTabBtn);
    }

    if (lightbox) {
        const lbNewTab = document.createElement('button');
        lbNewTab.className = 'lightbox-newtab';
        lbNewTab.innerHTML = '🗗 باز کردن در تب مستقل';
        lbNewTab.addEventListener('click', function(e) {
            e.stopPropagation();
            openImageInNewTab(lightboxImg.getAttribute('src'), lightboxImg.alt);
        });
        lightbox.appendChild(lbNewTab);
    }

    document.addEventListener('click', function(e) {
        if (!e.target || e.target.tagName !== 'IMG') return;
        if (!(e.ctrlKey || e.metaKey)) return;
        if (e.target.closest('.lightbox')) return;
        e.preventDefault();
        e.stopPropagation();
        openImageInNewTab(
            e.target.getAttribute('src'),
            e.target.getAttribute('data-filename') || e.target.alt
        );
    }, true);

    // ============================================================
    // ================= دکمه‌های نوار ابزار ویرایش =================
    // ============================================================
    function ensureEditToolbarButtons() {
        if (!editToolbar) return;
        const exitButton = document.getElementById('exitEditBtn');

        if (!document.getElementById('insertTopicBtn')) {
            const btn = document.createElement('button');
            btn.className = 'edit-btn primary';
            btn.id = 'insertTopicBtn';
            btn.textContent = '＋ تاپیک جدید';
            btn.title = 'افزودن تاپیک جدید بعد از تاپیک محل کرسر';
            btn.addEventListener('click', function() { openTopicInsertModal(null); });
            editToolbar.insertBefore(btn, exitButton || null);
        }
        if (!document.getElementById('insertNoteBtn')) {
            const btn = document.createElement('button');
            btn.className = 'edit-btn warning';
            btn.id = 'insertNoteBtn';
            btn.textContent = '◈ افزودن نکته';
            btn.title = 'افزودن نکته به تاپیکی که در آن هستید';
            btn.addEventListener('click', function() { openNoteInsertModal(null); });
            editToolbar.insertBefore(btn, exitButton || null);
        }
        if (!document.getElementById('insertBlockBtn')) {
            const btn = document.createElement('button');
            btn.className = 'edit-btn info';
            btn.id = 'insertBlockBtn';
            btn.textContent = '＋ درج متن / فرمول / کد';
            btn.title = 'درج بلوک مستقل (متن، فرمول، کد)';
            btn.addEventListener('click', openBlockInsertModal);
            editToolbar.insertBefore(btn, exitButton || null);
        }
    }

    // ============================================================
    // ================= تشخیص خودکار حالت ویرایش از DOM =================
    // ============================================================
    function detectInitialEditMode() {
        const bodyHasEditMode = document.body.classList.contains('edit-mode');
        const toggleHasActive = editToggle && editToggle.classList.contains('active');

        if (bodyHasEditMode || toggleHasActive) {
            console.log('✏️ حالت ویرایش در DOM یافت شد — بازیابی...');
            enableEditMode();
            console.log('✏️ حالت ویرایش از DOM بازیابی شد');
        } else {
            if (editLabel) editLabel.textContent = 'ویرایش';
            if (editToggle) editToggle.classList.remove('active');
            if (editToolbar) editToolbar.classList.remove('visible');
            document.body.classList.remove('edit-mode');
        }
    }

    // ============================================================
    // ================= رویدادهای اصلی =================
    // ============================================================
    if (editToggle) {
        editToggle.addEventListener('click', function() {
            if (isEditMode) disableEditMode();
            else enableEditMode();
        });
    }
    if (floatingEditBtn) {
        floatingEditBtn.addEventListener('click', function() {
            if (isEditMode) disableEditMode();
            else enableEditMode();
        });
    }

    if (saveBtn) saveBtn.addEventListener('click', saveEdits);
    if (exportBtn) exportBtn.addEventListener('click', exportHTML);
    if (resetBtn) resetBtn.addEventListener('click', resetEdits);
    if (exitEditBtn) exitEditBtn.addEventListener('click', disableEditMode);

    window.addEventListener('beforeunload', function(e) {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = 'تغییرات ذخیره‌نشده دارید. برای حفظ، از «دانلود HTML» استفاده کنید.';
        }
    });

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S') && isEditMode) {
            e.preventDefault();
            saveEdits();
        }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'e' || e.key === 'E') && isEditMode) {
            e.preventDefault();
            exportHTML();
        }
        if (e.key === 'Escape') {
            if (imageToolbar) imageToolbar.classList.remove('visible');
            hideFormulaToolbar();
            if (lightbox && lightbox.classList.contains('open')) lightbox.classList.remove('open');
            if (imageInsertModal && imageInsertModal.classList.contains('open')) imageInsertModal.classList.remove('open');
            if (linkInsertModal && linkInsertModal.classList.contains('open')) linkInsertModal.classList.remove('open');
            if (formulaEditModal && formulaEditModal.classList.contains('open')) formulaEditModal.classList.remove('open');
            if (htmlEditModal && htmlEditModal.classList.contains('open')) cancelHtmlEdit();
            if (blockInsertModal && blockInsertModal.classList.contains('open')) {
                blockInsertModal.classList.remove('open');
                editingCustomBlock = null;
            }
            if (topicInsertModal && topicInsertModal.classList.contains('open')) closeTopicInsertModal();
            if (noteInsertModal && noteInsertModal.classList.contains('open')) closeNoteInsertModal();
        }
    });

    attachImageListeners();
    attachFormulaListeners();
    attachCodeBlockListeners();

    document.addEventListener('focusin', function(e) {
        if (!isEditMode) return;
        const topic = e.target && e.target.closest ? e.target.closest('.topic') : null;
        if (topic) lastActiveTopic = topic;
    });

    document.addEventListener('mousedown', function(e) {
        if (!isEditMode) return;
        const topic = e.target && e.target.closest ? e.target.closest('.topic') : null;
        if (topic) lastActiveTopic = topic;
    }, true);

    // ============================================================
    // ================= رندر اولیه فرمول‌ها =================
    // ============================================================
    typesetMathDelayed([300, 800, 1500]);
    window.addEventListener('load', function() {
        typesetMathDelayed([200]);
    });

    // ============================================================
    // ================= اجرای تشخیص حالت ویرایش =================
    // ============================================================
    detectInitialEditMode();

    console.log('✅ سیستم آماده است — نسخه ۸ (سایدبار ثابت + اسکرول اصلاح‌شده + منو باز می‌ماند)');
})();