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

        /* --- 2. COUNTDOWN TIMER --- */
        // Set target date: 4th May 2026, 09:00:00 AM (local time)
        const targetDate = new Date('May 3, 2026 09:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                document.getElementById('days').innerText = "00";
                document.getElementById('hours').innerText = "00";
                document.getElementById('minutes').innerText = "00";
                document.getElementById('seconds').innerText = "00";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days.toString().padStart(2, '0');
            document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
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

        /* --- PER-GAME CONFIG --- */
        const GAME_CONFIG = {
            BGMI: {
                table: 'bgmi_registrations',
                folder: 'uploads/bgmi',
                requiredCount: 4,
                totalCount: 5,
                note: 'Players 1\u20134 are <strong>compulsory</strong>. Player 5 is a <strong>Substitute</strong> (optional).',
                fields: [
                    { key: 'name',       label: 'Name',               type: 'text', required: true, placeholder: 'Full Name' },
                    { key: 'ign',        label: 'IGN \u2014 In-Game Name', type: 'text', required: true, placeholder: 'In-Game Name' },
                    { key: 'char_id',    label: 'Character ID',        type: 'text', required: true, placeholder: 'Numbers only e.g. 512345678', inputmode: 'numeric', numericOnly: true },
                    { key: 'college_id', label: 'College ID Image',    type: 'file', required: true },
                ],
            },
            Valorant: {
                table: 'valorant_registrations',
                folder: 'uploads/valorant',
                requiredCount: 5,
                totalCount: 6,
                note: 'Players 1\u20135 are <strong>compulsory</strong>. Player 6 is a <strong>Substitute</strong> (optional).',
                fields: [
                    { key: 'name',       label: 'Name',               type: 'text', required: true, placeholder: 'Full Name' },
                    { key: 'ign',        label: 'IGN \u2014 In-Game Name', type: 'text', required: true, placeholder: 'In-Game Name' },
                    { key: 'tagline',    label: 'Tagline',             type: 'text', required: true, placeholder: 'e.g. SilentAce#1234', alphanumeric: true },
                    { key: 'college_id', label: 'College ID Image',    type: 'file', required: true },
                ],
            },
            MLBB: {
                table: 'moba_registrations',
                folder: 'uploads/moba',
                requiredCount: 5,
                totalCount: 6,
                note: 'Players 1\u20135 are <strong>compulsory</strong>. Player 6 is a <strong>Substitute</strong> (optional).',
                fields: [
                    { key: 'name',       label: 'Name',               type: 'text', required: true, placeholder: 'Full Name' },
                    { key: 'ign',        label: 'IGN \u2014 In-Game Name', type: 'text', required: true, placeholder: 'In-Game Name' },
                    { key: 'char_id',    label: 'Character ID',        type: 'text', required: true, placeholder: 'Numbers only e.g. 512345678', inputmode: 'numeric', numericOnly: true },
                    { key: 'server_id',  label: 'Server ID',           type: 'text', required: true, placeholder: 'Numbers only', inputmode: 'numeric', numericOnly: true },
                    { key: 'college_id', label: 'College ID Image',    type: 'file', required: true },
                ],
            },
        };

        /* --- URL PRE-SELECTION --- */
        const urlParams = new URLSearchParams(window.location.search);
        const gameParam = urlParams.get('game');
        if (gameParam) {
            const radio = document.querySelector(`input[name="game_selected"][value="${gameParam}"]`);
            if (radio) radio.checked = true;
        }

        const getSelectedGame = () => document.querySelector('input[name="game_selected"]:checked').value;

        /* --- DYNAMIC PLAYER BLOCK RENDERER --- */
        function renderPlayerBlocks(game) {
            const config = GAME_CONFIG[game];
            const container = document.getElementById('playersContainer');
            container.innerHTML = '';
            document.getElementById('playerNoteText').innerHTML = config.note;

            for (let i = 1; i <= config.totalCount; i++) {
                const isRequired = i <= config.requiredCount;
                let fieldsHTML = '';

                config.fields.forEach(field => {
                    const fieldId = `p${i}_${field.key}`;
                    const fieldRequired = isRequired && field.required;
                    const optSuffix = isRequired ? '' : ' (optional)';

                    if (field.type === 'file') {
                        fieldsHTML += `<div class="form-group">
                            <label for="${fieldId}">${field.label}${fieldRequired ? ' <span class="req">*</span>' : ''}</label>
                            <input type="file" id="${fieldId}" accept="image/*" class="file-input-sm" ${fieldRequired ? 'required' : ''}>
                        </div>`;
                    } else {
                        fieldsHTML += `<div class="form-group">
                            <label for="${fieldId}">${field.label}${fieldRequired ? ' <span class="req">*</span>' : ''}</label>
                            <input type="text" id="${fieldId}"
                                placeholder="${field.placeholder}${optSuffix}"
                                ${field.inputmode ? `inputmode="${field.inputmode}"` : ''}
                                ${field.numericOnly ? 'pattern="[0-9]+"' : ''}
                                ${fieldRequired ? 'required' : ''}>
                        </div>`;
                    }
                });

                const block = document.createElement('div');
                block.className = `player-block ${isRequired ? 'required-player' : 'substitute-player'}`;
                block.id = `p${i}Block`;
                block.innerHTML = `
                    <div class="player-block-head">
                        <span class="p-num">PLAYER ${i}</span>
                        <span class="p-badge ${isRequired ? 'required-badge' : 'sub-badge'}">${isRequired ? 'REQUIRED' : 'SUBSTITUTE \u2014 OPTIONAL'}</span>
                    </div>
                    <div class="form-grid">${fieldsHTML}</div>`;
                container.appendChild(block);
            }

            // Numeric-only real-time enforcement
            config.fields.filter(f => f.numericOnly).forEach(field => {
                for (let i = 1; i <= config.totalCount; i++) {
                    const el = document.getElementById(`p${i}_${field.key}`);
                    if (!el) continue;
                    el.addEventListener('input', () => { const c = el.value.replace(/[^0-9]/g, ''); if (el.value !== c) el.value = c; });
                    el.addEventListener('keypress', ev => { if (!/[0-9]/.test(ev.key)) ev.preventDefault(); });
                }
            });
        }

        /* --- INIT & REACT TO GAME CHANGE --- */
        document.querySelectorAll('input[name="game_selected"]').forEach(r =>
            r.addEventListener('change', () => renderPlayerBlocks(getSelectedGame()))
        );
        renderPlayerBlocks(getSelectedGame());

        /* --- SUPABASE SETUP --- */
        const MAX_FILE_SIZE = 250 * 1024;
        const SUPABASE_URL = 'https://fqxqoqpiaiakzagplbfl.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxeHFvcXBpYWlha3phZ3BsYmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTQyNjksImV4cCI6MjA5MjkzMDI2OX0.b60mYxriGmCFNaBCJBacxOswPUVTL6aeKo7e6TtdXa0';
        let supabaseClient = null;
        try {
            if (window.supabase) {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('Supabase initialized');
            }
        } catch (e) { console.error('Supabase init failed:', e); }

        async function uploadToStorage(file, folder) {
            const ext = file.name.split('.').pop().toLowerCase();
            const uniqueName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
            const { error: upErr } = await supabaseClient.storage
                .from('esports-registrations').upload(uniqueName, file, { cacheControl: '3600', upsert: false });
            if (upErr) throw upErr;
            const { data: urlData } = supabaseClient.storage.from('esports-registrations').getPublicUrl(uniqueName);
            return urlData.publicUrl;
        }

        /* --- FORM SUBMISSION --- */
        document.getElementById('registrationForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const game = getSelectedGame();
            const config = GAME_CONFIG[game];

            // Basic validations
            const waNumber = document.getElementById('leaderWhatsapp').value.trim();
            if (!/^[0-9]{10}$/.test(waNumber)) { showToast('Please enter a valid 10-digit WhatsApp number.', true); return; }
            const email = document.getElementById('leaderEmail').value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address.', true); return; }
            const captain = document.getElementById('captainName').value.trim();
            if (!/^[a-zA-Z\s]{2,}$/.test(captain)) { showToast('Captain Name must contain letters only.', true); return; }

            // Per-player validation (required players only)
            for (let i = 1; i <= config.requiredCount; i++) {
                for (const field of config.fields) {
                    if (!field.required) continue;
                    const el = document.getElementById(`p${i}_${field.key}`);
                    if (!el) continue;
                    if (field.type === 'file') {
                        if (!el.files || !el.files[0]) { showToast(`Player ${i}: ${field.label} is required.`, true); return; }
                        if (el.files[0].size > MAX_FILE_SIZE) { showToast(`Player ${i} ${field.label} too large! Max 250KB.`, true); return; }
                    } else {
                        const val = el.value.trim();
                        if (!val) { showToast(`Player ${i}: ${field.label} is required.`, true); el.focus(); return; }
                        if (field.numericOnly && !/^[0-9]+$/.test(val)) { showToast(`Player ${i}: ${field.label} must be numbers only.`, true); el.focus(); return; }
                        if (field.alphanumeric && !/^[a-zA-Z0-9#\-_.]+$/.test(val)) { showToast(`Player ${i}: ${field.label} has invalid characters.`, true); el.focus(); return; }
                    }
                }
            }

            // Substitute: all-or-nothing
            const subIdx = config.totalCount;
            const subTextFields = config.fields.filter(f => f.type !== 'file');
            const subFileEl = document.getElementById(`p${subIdx}_college_id`);
            const subFilledCount = subTextFields.filter(f => document.getElementById(`p${subIdx}_${f.key}`)?.value.trim()).length;
            const subHasFile = subFileEl?.files?.length > 0;
            if (subFilledCount > 0 || subHasFile) {
                if (subFilledCount < subTextFields.length || !subHasFile) {
                    showToast('Substitute details incomplete. Fill all fields or leave all empty.', true);
                    return;
                }
            }

            if (!document.getElementById('registrationForm').checkValidity()) {
                document.getElementById('registrationForm').reportValidity(); return;
            }

            // Loading state
            const submitBtn  = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitBtnText');
            const submitIcon = document.getElementById('submitIcon');
            const spinner    = document.getElementById('btnSpinner');
            submitBtn.disabled = true;
            submitIcon.style.display = 'none';
            spinner.style.display = 'block';

            try {
                if (!supabaseClient) throw new Error('Supabase client not initialized.');
                submitText.innerText = 'UPLOADING FILES...';

                const payload = {
                    college_name:    document.getElementById('collegeName').value.trim(),
                    team_name:       document.getElementById('teamName').value.trim(),
                    department:      document.getElementById('courseDept').value.trim(),
                    captain_name:    document.getElementById('captainName').value.trim(),
                    leader_email:    document.getElementById('leaderEmail').value.trim(),
                    leader_whatsapp: document.getElementById('leaderWhatsapp').value.trim(),
                };

                for (let i = 1; i <= config.totalCount; i++) {
                    for (const field of config.fields) {
                        const el = document.getElementById(`p${i}_${field.key}`);
                        if (!el) continue;
                        const colKey = `p${i}_${field.key}`;
                        if (field.type === 'file') {
                            payload[colKey] = (el.files && el.files[0]) ? await uploadToStorage(el.files[0], config.folder) : null;
                        } else {
                            payload[colKey] = el.value.trim() || null;
                        }
                    }
                }

                submitText.innerText = 'SAVING REGISTRATION...';
                console.log(`Submitting to ${config.table}:`, payload);
                const { data, error } = await supabaseClient.from(config.table).insert([payload]).select();
                if (error) throw error;
                console.log('Saved:', data);
                showSuccessScreen(game);

            } catch (err) {
                console.error('Submission failed:', err);
                const errMsg = err?.message || err?.details || 'Unknown error';
                showToast(`Submission failed: ${errMsg.substring(0, 80)}`, true);
                submitBtn.disabled = false;
                submitText.innerText = 'SUBMIT REGISTRATION';
                submitIcon.style.display = 'inline-block';
                spinner.style.display = 'none';
            }
        });
    }
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
            const p5IGN = document.getElementById('p5IGN');
            const p5CharID = document.getElementById('p5CharID');

            if (selectedGame === 'BGMI') {
                noteText.innerHTML = "Players 1–4 are <strong>compulsory</strong>. Player 5 is a <strong>Substitute</strong> (optional).";

                // Set P5 as optional
                p5Badge.innerText = "SUBSTITUTE — OPTIONAL";
                p5Badge.classList.remove('required-badge');
                p5Badge.classList.add('sub-badge');
                p5Block.classList.remove('required-player');
                p5Block.classList.add('substitute-player');

                p5Name.removeAttribute('required');
                p5IGN.removeAttribute('required');
                p5CharID.removeAttribute('required');

                p5Name.placeholder = "Full Name (optional)";
                p5IGN.placeholder = "In-Game Name (optional)";
                p5CharID.placeholder = "Game Character / UID (optional)";

                // Hide P6
                p6Block.style.display = 'none';
            } else {
                noteText.innerHTML = "Players 1–5 are <strong>compulsory</strong>. Player 6 is a <strong>Substitute</strong> (optional).";

                // Set P5 as Required
                p5Badge.innerText = "REQUIRED";
                p5Badge.classList.remove('sub-badge');
                p5Badge.classList.add('required-badge');
                p5Block.classList.remove('substitute-player');
                p5Block.classList.add('required-player');

                p5Name.setAttribute('required', 'true');
                p5IGN.setAttribute('required', 'true');
                p5CharID.setAttribute('required', 'true');

                p5Name.placeholder = "Full Name";
                p5IGN.placeholder = "In-Game Name";
                p5CharID.placeholder = "Game Character / UID";

                // Show P6
                p6Block.style.display = 'block';
            }
        };

        const gameRadios = document.querySelectorAll('input[name="game_selected"]');
        gameRadios.forEach(radio => radio.addEventListener('change', updatePlayerFields));
        updatePlayerFields(); // Run once on load

        /* --- CHARACTER ID: NUMBERS ONLY (real-time strip) --- */
        const charIDInputs = ['p1CharID','p2CharID','p3CharID','p4CharID','p5CharID','p6CharID'];
        charIDInputs.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => {
                const cleaned = el.value.replace(/[^0-9]/g, '');
                if (el.value !== cleaned) el.value = cleaned;
            });
            el.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
            });
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

            // --- CHARACTER ID: MUST BE NUMERIC ---
            const requiredCharIDs = ['p1CharID','p2CharID','p3CharID','p4CharID'];
            if (gameSelected !== 'BGMI') requiredCharIDs.push('p5CharID');
            for (const cid of requiredCharIDs) {
                const val = document.getElementById(cid).value.trim();
                if (val && !/^[0-9]+$/.test(val)) {
                    showToast(`Character ID must contain numbers only! Check Player ${cid.replace('p','').replace('CharID','')}`, true);
                    document.getElementById(cid).focus();
                    return;
                }
            }

            // --- SUBSTITUTE PLAYER ALL-OR-NOTHING VALIDATION ---
            const subPrefix = gameSelected === 'BGMI' ? 'p5' : 'p6';
            const subName = document.getElementById(subPrefix + 'Name').value.trim();
            const subIGN = document.getElementById(subPrefix + 'IGN').value.trim();
            const subChar = document.getElementById(subPrefix + 'CharID').value.trim();
            const subFile = document.getElementById(subPrefix + 'CollegeID').files && document.getElementById(subPrefix + 'CollegeID').files.length > 0;

            if (subName || subIGN || subChar || subFile) {
                // If any field is populated, then ALL must be populated
                if (!subName || !subIGN || !subChar || !subFile) {
                    showToast(`Substitute Player (${subPrefix.toUpperCase().replace('P', 'Player ')}) details are incomplete. Fill all fields or leave all empty!`, true);
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

                const payload = {
                    game: gameSelected,
                    college_name: document.getElementById('collegeName').value.trim(),
                    team_name: document.getElementById('teamName').value.trim(),
                    department: document.getElementById('courseDept').value.trim(),
                    captain_name: document.getElementById('captainName').value.trim(),
                    leader_email: document.getElementById('leaderEmail').value.trim(),
                    leader_whatsapp: document.getElementById('leaderWhatsapp').value.trim(),
                    team_logo_url: teamLogoUrl,

                    p1_name: document.getElementById('p1Name').value.trim(),
                    p1_ign: document.getElementById('p1IGN').value.trim(),
                    p1_char_id: document.getElementById('p1CharID').value.trim(),
                    p1_college_id: p1url,

                    p2_name: document.getElementById('p2Name').value.trim(),
                    p2_ign: document.getElementById('p2IGN').value.trim(),
                    p2_char_id: document.getElementById('p2CharID').value.trim(),
                    p2_college_id: p2url,

                    p3_name: document.getElementById('p3Name').value.trim(),
                    p3_ign: document.getElementById('p3IGN').value.trim(),
                    p3_char_id: document.getElementById('p3CharID').value.trim(),
                    p3_college_id: p3url,

                    p4_name: document.getElementById('p4Name').value.trim(),
                    p4_ign: document.getElementById('p4IGN').value.trim(),
                    p4_char_id: document.getElementById('p4CharID').value.trim(),
                    p4_college_id: p4url,

                    p5_name: document.getElementById('p5Name').value.trim() || null,
                    p5_ign: document.getElementById('p5IGN').value.trim() || null,
                    p5_char_id: document.getElementById('p5CharID').value.trim() || null,
                    p5_college_id: p5url,

                    p6_name: document.getElementById('p6Name') ? document.getElementById('p6Name').value.trim() || null : null,
                    p6_ign: document.getElementById('p6IGN') ? document.getElementById('p6IGN').value.trim() || null : null,
                    p6_char_id: document.getElementById('p6CharID') ? document.getElementById('p6CharID').value.trim() || null : null,
                    p6_college_id: p6url,
                };

                console.log('📤 Submitting to Supabase:', payload);

                const { data, error } = await supabaseClient
                    .from('registrations')
                    .insert([payload])
                    .select();

                if (error) {
                    console.error('❌ Supabase error:', error);
                    throw error;
                }

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
