// Password Page Logic
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const MAIN_PASSWORD = "deborah";        // Case-insensitive
    const BYPASS_PASSWORD = "sonder";       // Your secret bypass
    const TARGET_DATE = new Date('December 31, 2026 23:59:59').getTime();
    
    // DOM Elements
    const passwordInput = document.getElementById('passwordInput');
    const submitBtn = document.getElementById('submitBtn');
    const birthdayMessage = document.getElementById('birthdayMessage');
    const lockIcon = document.getElementById('lockIcon');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    // Music state
    let isMusicPlaying = true;
    
    // Initialize
    init();
    
    function init() {
        setupMusic();
        setupInput();
        setupButton();
        startPlaceholderAnimation();
    }
    
    // Music Controls
    function setupMusic() {
        bgMusic.volume = 0.3; // Soft volume
        
        musicToggle.addEventListener('click', function() {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                bgMusic.play().catch(e => console.log("Auto-play prevented"));
                musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            isMusicPlaying = !isMusicPlaying;
        });
        
        // Handle autoplay restrictions
        bgMusic.play().catch(e => {
            console.log("Autoplay prevented");
            // Play on user interaction
            const playOnInteraction = () => {
                bgMusic.play();
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('keydown', playOnInteraction);
        });
    }
    
    // Input Field Setup
    function setupInput() {
        passwordInput.addEventListener('focus', function() {
            this.style.borderColor = '#4a90e2';
            lockIcon.style.color = '#4a90e2';
        });
        
        passwordInput.addEventListener('blur', function() {
            if (!this.value) {
                this.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                lockIcon.style.color = 'rgba(255, 255, 255, 0.7)';
            }
        });
        
        passwordInput.addEventListener('input', function() {
            if (this.value.length > 0) {
                lockIcon.style.transform = 'rotate(45deg)';
            } else {
                lockIcon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Enter key support
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // Button Setup
    function setupButton() {
        submitBtn.addEventListener('click', checkPassword);
    }
    
    // Animated Placeholder
    function startPlaceholderAnimation() {
        const placeholderText = "Type the word here...";
        let index = 0;
        let isTyping = true;
        
        function typePlaceholder() {
            if (isTyping && !passwordInput.value) {
                if (index < placeholderText.length) {
                    passwordInput.placeholder = placeholderText.substring(0, index + 1);
                    index++;
                    setTimeout(typePlaceholder, 80);
                } else {
                    setTimeout(() => {
                        index = 0;
                        passwordInput.placeholder = '';
                        setTimeout(typePlaceholder, 500);
                    }, 1500);
                }
            }
        }
        
        typePlaceholder();
        
        // Stop animation when user starts typing
        passwordInput.addEventListener('focus', () => isTyping = false);
        passwordInput.addEventListener('blur', () => {
            if (!passwordInput.value) {
                isTyping = true;
                typePlaceholder();
            }
        });
    }
    
    // Main Password Check Function
    function checkPassword() {
        const enteredPassword = passwordInput.value.trim().toLowerCase();
        
        // Button press animation
        submitBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            submitBtn.style.transform = '';
        }, 200);
        
        // Clear previous states
        passwordInput.classList.remove('input-error', 'input-success');
        
        if (!enteredPassword) {
            passwordInput.classList.add('input-error');
            return;
        }
        
        // Check passwords
        if (enteredPassword === BYPASS_PASSWORD) {
            // Bypass: direct to main page
            handleCorrectPassword(true);
            return;
        }
        
        if (enteredPassword === MAIN_PASSWORD) {
            // Main password: check date
            handleCorrectPassword(false);
            return;
        }
        
        // Wrong password
        handleWrongPassword();
    }
    
    // Handle Correct Password
    function handleCorrectPassword(isBypass) {
        passwordInput.classList.add('input-success');
        lockIcon.style.color = '#4cd964';
        
        // Show birthday message (only for main password, not bypass)
        if (!isBypass) {
            showBirthdayMessage();
        }
        
        // Calculate timing
        const now = new Date().getTime();
        const timeLeft = TARGET_DATE - now;
        
        // Determine redirect
        setTimeout(() => {
            if (isBypass || timeLeft <= 0) {
                // Bypass OR date has passed: go to main page
                window.location.href = 'main.html';
            } else {
                // Date hasn't passed: go to countdown
                window.location.href = 'countdown.html';
            }
        }, isBypass ? 800 : 3500); // Shorter delay for bypass
    }
    
    // Show Birthday Message with Typewriter Effect
    function showBirthdayMessage() {
        birthdayMessage.classList.remove('hidden');
        
        const messageText = birthdayMessage.querySelector('h3');
        const originalText = messageText.innerHTML;
        messageText.innerHTML = '';
        
        const text = "Welcome and happy birthday";
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                messageText.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Add gift icon after typing
                messageText.innerHTML += ' <i class="fas fa-gift"></i>';
            }
        }
        
        typeWriter();
    }
    
    // Handle Wrong Password
    function handleWrongPassword() {
        passwordInput.classList.add('input-error');
        
        // Shake animation
        passwordInput.style.animation = 'none';
        setTimeout(() => {
            passwordInput.style.animation = 'shake 0.5s ease';
        }, 10);
        
        // Redirect to denied page after brief pause
        setTimeout(() => {
            window.location.href = 'denied.html';
        }, 800);
    }
    
    // Auto-focus after load
    setTimeout(() => {
        passwordInput.focus();
    }, 1000);
});
