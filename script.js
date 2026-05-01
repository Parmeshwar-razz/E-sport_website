/* ==========================================================================
   BIYANI ESPORTS CHAMPIONSHIP - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- GLOBALS & UTILS --- */
    const isRegPage = document.body.classList.contains('reg-page');

    /* --- 1. NAVBAR SCROLL & MOBILE MENU (Both Pages) --- */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (navbar && !isRegPage) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    if (hamburger && mobileNav) {
        const mobileNavClose = document.getElementById('mobileNavClose');
        const backdrop = document.getElementById('mobileNavBackdrop');

        function closeNav() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
            if (backdrop) backdrop.classList.remove('visible');
            document.body.style.overflow = '';
        }

        hamburger.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            if (isOpen) {
                closeNav();
            } else {
                hamburger.classList.add('active');
                mobileNav.classList.add('open');
                if (backdrop) backdrop.classList.add('visible');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close button inside nav
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeNav);
        }

        // Tap backdrop to close
        if (backdrop) {
            backdrop.addEventListener('click', closeNav);
        }

        // Close on nav link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });
    }


    /* =========================================================
       MAIN PAGE LOGIC (index.html)
       ========================================================= */
    if (!isRegPage) {

        /* --- 2. COUNTDOWN TIMER (Registration Deadline: 3rd May 2026, 10:00 PM IST) --- */
        // IST = UTC+5:30 → 3 May 22:00 IST = 3 May 16:30 UTC
        const REG_DEADLINE = new Date('2026-05-03T22:00:00+05:30').getTime();

        const updateCountdown = () => {
            const now = Date.now();
            const distance = REG_DEADLINE - now;

            if (distance <= 0) {
                // ── REGISTRATION CLOSED ──
                const timer = document.getElementById('countdownTimer');
                const closedMsg = document.getElementById('regClosedMsg');
                const registerBtn = document.getElementById('heroRegisterBtn');

                if (timer) timer.style.display = 'none';
                if (closedMsg) closedMsg.style.display = 'block';
                if (registerBtn) {
                    registerBtn.style.pointerEvents = 'none';
                    registerBtn.style.opacity = '0.4';
                    registerBtn.style.cursor = 'not-allowed';
                    registerBtn.removeAttribute('href');
                    registerBtn.querySelector('span').innerText = 'REGISTRATION CLOSED';
                }
                return; // stop updating
            }

            const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText    = days.toString().padStart(2, '0');
            document.getElementById('hours').innerText   = hours.toString().padStart(2, '0');
            document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
        };

        setInterval(updateCountdown, 1000);
        updateCountdown();

        /* --- AUTO TIMELINE ACTIVE MARKER (updates per current date) --- */
        function updateTimelineMarkers() {
            const now = new Date();
            // Event milestone dates (year, month-1, day)
            const day4 = new Date(2026, 4, 4);  // 4 May 2026
            const day5 = new Date(2026, 4, 5);  // 5 May 2026
            const day7 = new Date(2026, 4, 7);  // 7 May 2026

            // Determine which stage is active
            let activeStage = 0; // 0 = 4 MAY, 1 = 5 MAY, 2 = 7 MAY
            if (now >= day5 && now < day7) activeStage = 1;
            else if (now >= day7) activeStage = 2;

            // Update all timelines (BGMI, Valo, MLBB all have same dates)
            document.querySelectorAll('.timeline').forEach(timeline => {
                const markers = timeline.querySelectorAll('.tl-marker');
                markers.forEach((marker, i) => {
                    marker.classList.remove('active-marker');
                    if (i === activeStage) marker.classList.add('active-marker');
                });
            });
        }
        updateTimelineMarkers();

        /* --- 3. SCROLL REVEAL ANIMATION --- */
        const revealElements = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 100;

            revealElements.forEach(el => {
                const revealTop = el.getBoundingClientRect().top;
                if (revealTop < windowHeight - revealPoint) {
                    el.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        // Trigger once on load
        setTimeout(revealOnScroll, 300);


        /* --- 4. TABS LOGIC (Prize Pool & Format) --- */
        const setupTabs = (containerSelector) => {
            const container = document.querySelector(containerSelector);
            if (!container) return;
            const tabBtns = container.querySelectorAll('.prize-tab-btn');
            const tabPanels = container.querySelectorAll('.prize-tab-panel');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active from all within this container
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabPanels.forEach(p => p.classList.remove('active'));

                    // Add active to clicked target
                    btn.classList.add('active');
                    const targetId = btn.getAttribute('data-target');
                    container.querySelector('#' + targetId).classList.add('active');
                });
            });
        };

        setupTabs('#prize-pool');
        setupTabs('#format');


        /* --- 5. FAQ ACCORDION --- */
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const questionText = item.querySelector('.faq-q');
            const answerBox = item.querySelector('.faq-a');

            questionText.addEventListener('click', () => {
                const isOpen = item.classList.contains('faq-open');

                // Close all others first
                faqItems.forEach(fi => {
                    fi.classList.remove('faq-open');
                    fi.querySelector('.faq-a').style.maxHeight = null;
                });

                if (!isOpen) {
                    item.classList.add('faq-open');
                    answerBox.style.maxHeight = answerBox.scrollHeight + "px";
                }
            });
        });

    }


    /* =========================================================
       REGISTRATION PAGE LOGIC (register.html)
       ========================================================= */
    if (isRegPage) {

        /* --- PARSE URL FOR GAME PRE-SELECTION --- */
        const urlParams = new URLSearchParams(window.location.search);
        const gameParam = urlParams.get('game');
        if (gameParam) {
            const radio = document.querySelector(`input[name="game_selected"][value="${gameParam}"]`);
            if (radio) radio.checked = true;
        }

        /* --- DYNAMIC PLAYER REQUIREMENTS --- */
        const updatePlayerFields = () => {
            const selectedGame = document.querySelector('input[name="game_selected"]:checked').value;
            const p5Block = document.getElementById('p5Block');
            const p5Badge = document.getElementById('p5Badge');
            const p6Block = document.getElementById('p6Block');
            const noteText = document.getElementById('playerNoteText');
            const p5Name = document.getElementById('p5Name');
            const p5IGN  = document.getElementById('p5IGN');
            const p5CharID = document.getElementById('p5CharID');

            // ── Show/hide MOBA-only Server ID fields ──
            document.querySelectorAll('.moba-field').forEach(el => {
                el.style.display = selectedGame === 'MLBB' ? '' : 'none';
            });

            // ── Update CharID label: "Tagline" for Valorant, "Character ID" otherwise ──
            for (let i = 1; i <= 6; i++) {
                const inp = document.getElementById(`p${i}CharID`);
                const lbl = document.querySelector(`label[for="p${i}CharID"]`);
                if (!inp || !lbl) continue;
                const isReqPlayer = (selectedGame === 'BGMI') ? i <= 4 : i <= 5;
                const asterisk = isReqPlayer ? ' <span class="req">*</span>' : '';
                if (selectedGame === 'Valorant') {
                    lbl.innerHTML = 'Tagline' + asterisk;
                    inp.placeholder = isReqPlayer ? 'e.g. PlayerName#1234' : 'e.g. PlayerName#1234 (optional)';
                    inp.removeAttribute('inputmode');
                    inp.removeAttribute('pattern');
                } else {
                    lbl.innerHTML = 'Character ID' + asterisk;
                    inp.placeholder = isReqPlayer ? 'Numbers only e.g. 512345678' : 'Numbers only (optional)';
                    inp.setAttribute('inputmode', 'numeric');
                    inp.setAttribute('pattern', isReqPlayer ? '[0-9]+' : '[0-9]*');
                }
            }

            // ── Update Server ID required state (MLBB P1-P5 required, P6 optional) ──
            for (let i = 1; i <= 6; i++) {
                const sInp = document.getElementById(`p${i}ServerID`);
                const sLbl = document.querySelector(`label[for="p${i}ServerID"]`);
                if (!sInp || !sLbl) continue;
                if (selectedGame === 'MLBB' && i <= 5) {
                    sInp.setAttribute('required', 'true');
                    sLbl.innerHTML = 'Server ID <span class="req">*</span>';
                } else {
                    sInp.removeAttribute('required');
                    sLbl.innerHTML = 'Server ID';
                    if (selectedGame !== 'MLBB') sInp.value = '';
                }
            }

            if (selectedGame === 'BGMI') {
                noteText.innerHTML = "Players 1\u20134 are <strong>compulsory</strong>. Player 5 is a <strong>Substitute</strong> (optional).";
                p5Badge.innerText = "SUBSTITUTE \u2014 OPTIONAL";
                p5Badge.classList.remove('required-badge'); p5Badge.classList.add('sub-badge');
                p5Block.classList.remove('required-player'); p5Block.classList.add('substitute-player');
                p5Name.removeAttribute('required'); p5IGN.removeAttribute('required'); p5CharID.removeAttribute('required');
                p5Name.placeholder = "Full Name (optional)"; p5IGN.placeholder = "In-Game Name (optional)";
                p6Block.style.display = 'none';
            } else {
                noteText.innerHTML = "Players 1\u20135 are <strong>compulsory</strong>. Player 6 is a <strong>Substitute</strong> (optional).";
                p5Badge.innerText = "REQUIRED";
                p5Badge.classList.remove('sub-badge'); p5Badge.classList.add('required-badge');
                p5Block.classList.remove('substitute-player'); p5Block.classList.add('required-player');
                p5Name.setAttribute('required', 'true'); p5IGN.setAttribute('required', 'true'); p5CharID.setAttribute('required', 'true');
                p5Name.placeholder = "Full Name"; p5IGN.placeholder = "In-Game Name";
                p6Block.style.display = 'block';
            }
        };

        const gameRadios = document.querySelectorAll('input[name="game_selected"]');

        /* --- CLEAR ALL PLAYER FIELDS ON GAME SWITCH --- */
        function clearPlayerFields() {
            const form = document.getElementById('registrationForm');
            if (form) form.reset();
        }

        gameRadios.forEach(radio => radio.addEventListener('change', () => {
            clearPlayerFields();
            updatePlayerFields();
        }));
        updatePlayerFields(); // Run once on load

        /* --- CHARACTER ID: NUMERIC only for BGMI/MLBB (skip for Valorant Tagline) --- */
        const charIDInputs = ['p1CharID','p2CharID','p3CharID','p4CharID','p5CharID','p6CharID'];
        charIDInputs.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => {
                const game = document.querySelector('input[name="game_selected"]:checked').value;
                if (game === 'Valorant') return;
                const cleaned = el.value.replace(/[^0-9]/g, '');
                if (el.value !== cleaned) el.value = cleaned;
            });
            el.addEventListener('keypress', (e) => {
                const game = document.querySelector('input[name="game_selected"]:checked').value;
                if (game === 'Valorant') return;
                if (!/[0-9]/.test(e.key)) e.preventDefault();
            });
        });

        /* --- SERVER ID: NUMERIC always (MLBB only fields) --- */
        ['p1ServerID','p2ServerID','p3ServerID','p4ServerID','p5ServerID','p6ServerID'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => { const c = el.value.replace(/[^0-9]/g,''); if (el.value !== c) el.value = c; });
            el.addEventListener('keypress', (e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); });
        });


        /* --- SUPABASE SETUP & FORM SUBMISSION --- */
        const MAX_FILE_SIZE = 250 * 1024; // 250KB max for college ID images
        const SUPABASE_URL = 'https://fqxqoqpiaiakzagplbfl.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeHFvcXBpYWlha3phZ3BsYmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTQyNjksImV4cCI6MjA5MjkzMDI2OX0.b60mYxriGmCFNaBCJBacxOswPUVTL6aeKo7e6TtdXa0';

        let supabaseClient = null;
        try {
            if (window.supabase) {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase client initialized successfully.');
            } else {
                console.error('❌ Supabase CDN not loaded! Check your internet connection.');
            }
        } catch (e) {
            console.error('❌ Supabase client init failed:', e);
        }

        // Upload a file to Supabase Storage, returns public URL
        async function uploadToStorage(file, folder) {
            const ext = file.name.split('.').pop().toLowerCase();
            const uniqueName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
            console.log(`📁 Uploading: ${file.name} → bucket: esports-registrations/${uniqueName}`);
            const { data: upData, error: upErr } = await supabaseClient.storage
                .from('esports-registrations')
                .upload(uniqueName, file, { cacheControl: '3600', upsert: false });
            if (upErr) {
                console.error(`❌ Storage upload failed for "${file.name}":`, upErr);
                throw upErr;
            }
            console.log(`✅ Uploaded successfully:`, upData);
            const { data: urlData } = supabaseClient.storage
                .from('esports-registrations')
                .getPublicUrl(uniqueName);
            console.log(`🔗 Public URL:`, urlData.publicUrl);
            return urlData.publicUrl;
        }

        const form = document.getElementById('registrationForm');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // --- CUSTOM VALIDATIONS ---
            const waNumber = document.getElementById('leaderWhatsapp').value.trim();
            if (!/^[0-9]{10}$/.test(waNumber)) {
                showToast("Please enter a valid exactly 10-digit WhatsApp number.", true);
                return;
            }

            const email = document.getElementById('leaderEmail').value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast("Please enter a valid email address.", true);
                return;
            }

            const captain = document.getElementById('captainName').value.trim();
            if (!/^[a-zA-Z\s]{2,}$/.test(captain)) {
                showToast("Please enter a valid Captain Name (letters only).", true);
                return;
            }

            const gameSelected = document.querySelector('input[name="game_selected"]:checked').value;

            // --- CHARACTER ID / TAGLINE / SERVER ID VALIDATION ---
            if (gameSelected === 'Valorant') {
                // Tagline: alphanumeric — just check not empty (HTML required handles it)
            } else {
                // BGMI & MLBB: CharID must be numeric
                const reqCharIDs = ['p1CharID','p2CharID','p3CharID','p4CharID'];
                if (gameSelected !== 'BGMI') reqCharIDs.push('p5CharID');
                for (const cid of reqCharIDs) {
                    const val = document.getElementById(cid).value.trim();
                    if (val && !/^[0-9]+$/.test(val)) {
                        showToast(`Character ID must be numbers only! (Player ${cid.replace('p','').replace('CharID','')})`, true);
                        document.getElementById(cid).focus(); return;
                    }
                }
            }
            if (gameSelected === 'MLBB') {
                // Server ID must be numeric for P1-P5
                for (let n = 1; n <= 5; n++) {
                    const val = document.getElementById(`p${n}ServerID`)?.value.trim();
                    if (!val) { showToast(`Player ${n}: Server ID is required.`, true); return; }
                    if (!/^[0-9]+$/.test(val)) { showToast(`Player ${n}: Server ID must be numbers only.`, true); return; }
                }
            }

            // --- SUBSTITUTE PLAYER ALL-OR-NOTHING VALIDATION ---
            const subPrefix = gameSelected === 'BGMI' ? 'p5' : 'p6';
            const subName = document.getElementById(subPrefix + 'Name').value.trim();
            const subIGN  = document.getElementById(subPrefix + 'IGN').value.trim();
            const subChar = document.getElementById(subPrefix + 'CharID').value.trim();
            const subFile = document.getElementById(subPrefix + 'CollegeID').files?.length > 0;
            const subServerID = gameSelected === 'MLBB' ? (document.getElementById(subPrefix + 'ServerID')?.value.trim() || '') : 'ok';
            if (subName || subIGN || subChar || subFile) {
                if (!subName || !subIGN || !subChar || !subFile || (gameSelected === 'MLBB' && !subServerID)) {
                    showToast(`Substitute Player details are incomplete. Fill all fields or leave all empty!`, true);
                    return;
                }
            }

            // --- FILE SIZE VALIDATION: 250KB max for all college ID images ---
            const idInputs = [
                { id: 'p1CollegeID', label: 'Player 1' }, { id: 'p2CollegeID', label: 'Player 2' },
                { id: 'p3CollegeID', label: 'Player 3' }, { id: 'p4CollegeID', label: 'Player 4' },
                { id: 'p5CollegeID', label: 'Player 5' }, { id: 'p6CollegeID', label: 'Player 6' },
            ];
            for (const { id, label } of idInputs) {
                const el = document.getElementById(id);
                if (el && el.files[0] && el.files[0].size > MAX_FILE_SIZE) {
                    showToast(`${label} College ID too large! Max 250KB. File: ${(el.files[0].size/1024).toFixed(1)}KB.`, true);
                    return;
                }
            }

            // Basic HTML5 validation fallback
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // --- UI LOADING STATE ---
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitBtnText');
            const submitIcon = document.getElementById('submitIcon');
            const spinner = document.getElementById('btnSpinner');

            submitBtn.disabled = true;
            submitIcon.style.display = 'none';
            spinner.style.display = 'block';

            try {
                if (!supabaseClient) throw new Error('Supabase client not initialized.');

                // --- UPLOAD FILES TO STORAGE ---
                submitText.innerText = "UPLOADING FILES...";

                const uploadFile = async (inputId, folder) => {
                    const el = document.getElementById(inputId);
                    if (el && el.files[0]) return await uploadToStorage(el.files[0], folder);
                    return null;
                };

                const teamLogoUrl = null; // Team logo upload removed

                const [p1url, p2url, p3url, p4url, p5url, p6url] = await Promise.all([
                    uploadFile('p1CollegeID', 'college-ids'),
                    uploadFile('p2CollegeID', 'college-ids'),
                    uploadFile('p3CollegeID', 'college-ids'),
                    uploadFile('p4CollegeID', 'college-ids'),
                    uploadFile('p5CollegeID', 'college-ids'),
                    uploadFile('p6CollegeID', 'college-ids'),
                ]);

                // --- BUILD PAYLOAD ---
                submitText.innerText = "SAVING REGISTRATION...";

                const getV = (id) => { const el = document.getElementById(id); return el ? el.value.trim() || null : null; };
                const urls = [p1url, p2url, p3url, p4url, p5url, p6url];

                const payload = {
                    college_name:    document.getElementById('collegeName').value.trim(),
                    team_name:       document.getElementById('teamName').value.trim(),
                    department:      document.getElementById('courseDept').value.trim(),
                    captain_name:    document.getElementById('captainName').value.trim(),
                    leader_email:    document.getElementById('leaderEmail').value.trim(),
                    leader_whatsapp: document.getElementById('leaderWhatsapp').value.trim(),
                };

                // BGMI has max 5 players (P1-P4 required + P5 substitute)
                // Valorant & MLBB have max 6 players (P1-P5 required + P6 substitute)
                const maxPlayers = gameSelected === 'BGMI' ? 5 : 6;

                for (let n = 1; n <= maxPlayers; n++) {
                    payload[`p${n}_name`]       = getV(`p${n}Name`);
                    payload[`p${n}_ign`]        = getV(`p${n}IGN`);
                    payload[`p${n}_college_id`] = urls[n - 1];
                    if (gameSelected === 'Valorant') {
                        payload[`p${n}_tagline`]  = getV(`p${n}CharID`);
                    } else {
                        payload[`p${n}_char_id`]  = getV(`p${n}CharID`);
                        if (gameSelected === 'MLBB') payload[`p${n}_server_id`] = getV(`p${n}ServerID`);
                    }
                }

                const tableMap = { BGMI: 'bgmi_registrations', Valorant: 'valorant_registrations', MLBB: 'moba_registrations' };
                console.log(`Submitting to ${tableMap[gameSelected]}:`, payload);

                const { data, error } = await supabaseClient
                    .from(tableMap[gameSelected])
                    .insert([payload])
                    .select();

                if (error) { console.error('Supabase error:', error); throw error; }

                console.log('✅ Saved:', data);
                showSuccessScreen(gameSelected);

            } catch (error) {
                console.error('❌ Submission failed:', error);
                const errMsg = error?.message || error?.details || 'Unknown error';
                showToast(`Submission failed: ${errMsg.substring(0, 80)}`, true);
                submitBtn.disabled = false;
                submitText.innerText = "SUBMIT REGISTRATION";
                submitIcon.style.display = 'inline-block';
                spinner.style.display = 'none';
            }
        });
    }

    /* --- TOAST & SUCCESS UTILS --- */
    function showToast(msg, isError = false) {
        const toast = document.getElementById('toastNotification');
        const icon = document.getElementById('toastIcon');
        const message = document.getElementById('toastMessage');

        if (toast) {
            toast.className = 'toast-notification'; // reset
            if (isError) {
                toast.classList.add('error');
                icon.innerText = '!';
            } else {
                icon.innerText = '✓';
            }
            message.innerText = msg;

            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    function showSuccessScreen(game) {
        document.querySelector('.reg-header').style.display = 'none';
        document.querySelector('.game-selector-block').style.display = 'none';
        document.getElementById('registrationForm').style.display = 'none';

        const successScreen = document.getElementById('successScreen');
        const gameTag = document.getElementById('successGameTag');

        let gameColor = "";
        if (game === 'BGMI') gameColor = '#f59e0b';
        if (game === 'Valorant') gameColor = '#ff2a54';
        if (game === 'MLBB') gameColor = '#3b82f6';

        gameTag.innerText = `REGISTERED FOR ${game.toUpperCase()}`;
        if (gameColor) gameTag.style.color = gameColor;

        successScreen.style.display = 'block';
        window.scrollTo(0, 0);
    }
});
