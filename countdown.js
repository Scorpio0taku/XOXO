// Countdown Page Logic
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const TARGET_DATE = new Date('December 31, 2026 23:59:59').getTime();
    
    // DOM Elements
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const progressFill = document.querySelector('.progress-fill');
    const statusText = document.getElementById('statusText');
    const statusIndicator = document.getElementById('statusIndicator');
    const redirectMessage = document.getElementById('redirectMessage');
    
    // Progress circle settings
    const CIRCUMFERENCE = 2 * Math.PI * 90; // 2πr (r=90 from SVG)
    
    // Initialize
    initCountdown();
    
    function initCountdown() {
        // Start the countdown
        updateCountdown();
        
        // Update every second
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        // Animate background
        animateBackground();
        
        // Add floating elements animation
        animateFloatingElements();
    }
    
    // Main Countdown Function
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = TARGET_DATE - now;
        
        // If countdown is finished
        if (timeLeft <= 0) {
            handleCountdownComplete();
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update display with leading zeros
        daysElement.textContent = String(days).padStart(3, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
        
        // Update progress circle
        updateProgressCircle(timeLeft);
        
        // Update status message
        updateStatusMessage(days);
        
        // Add subtle animation to active unit
        highlightActiveUnit(days, hours, minutes, seconds);
    }
    
    // Update Progress Circle
    function updateProgressCircle(timeLeft) {
        // Total duration from now until target (approx)
        const totalDuration = TARGET_DATE - new Date('January 1, 2024').getTime();
        const timePassed = totalDuration - timeLeft;
        const progressPercentage = (timePassed / totalDuration) * 100;
        
        // Calculate dash offset (0% = full circle, 100% = no circle)
        const dashOffset = CIRCUMFERENCE - (progressPercentage / 100) * CIRCUMFERENCE;
        
        progressFill.style.strokeDasharray = CIRCUMFERENCE;
        progressFill.style.strokeDashoffset = dashOffset;
        
        // Change color based on progress
        const hue = Math.floor(progressPercentage * 1.2); // 0-120° (red to green)
        progressFill.style.stroke = `hsl(${hue}, 100%, 65%)`;
    }
    
    // Update Status Message
    function updateStatusMessage(days) {
        let message = "Counting down...";
        
        if (days > 365) {
            message = "Still quite a while to go...";
        } else if (days > 180) {
            message = "Getting closer every day...";
        } else if (days > 90) {
            message = "Time is passing...";
        } else if (days > 30) {
            message = "Getting closer...";
        } else if (days > 7) {
            message = "Almost there...";
        } else if (days > 1) {
            message = "Just a few days left...";
        } else if (days === 1) {
            message = "One more day...";
            statusIndicator.style.background = 'rgba(255, 154, 158, 0.2)';
        } else {
            message = "Today's the day!";
            statusIndicator.style.background = 'rgba(76, 217, 100, 0.2)';
        }
        
        statusText.textContent = message;
    }
    
    // Highlight Active Time Unit
    function highlightActiveUnit(days, hours, minutes, seconds) {
        // Remove highlight from all
        const timeUnits = document.querySelectorAll('.time-unit');
        timeUnits.forEach(unit => unit.classList.remove('active'));
        
        // Determine which unit is most "active" (changing soon)
        if (seconds <= 10) {
            document.querySelector('.time-unit:nth-child(4)').classList.add('active');
        } else if (minutes === 0) {
            document.querySelector('.time-unit:nth-child(3)').classList.add('active');
        } else if (hours === 0) {
            document.querySelector('.time-unit:nth-child(2)').classList.add('active');
        } else if (days === 0) {
            document.querySelector('.time-unit:nth-child(1)').classList.add('active');
        }
    }
    
    // Handle Countdown Completion
    function handleCountdownComplete() {
        // Update display to all zeros
        daysElement.textContent = '000';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        
        // Update status
        statusText.textContent = "The moment has arrived!";
        statusIndicator.style.background = 'rgba(76, 217, 100, 0.3)';
        
        // Complete the progress circle
        progressFill.style.strokeDashoffset = 0;
        progressFill.style.stroke = '#4cd964';
        
        // Show redirect message
        redirectMessage.classList.remove('hidden');
        
        // Celebration animation
        startCelebration();
        
        // Redirect to main page after 3 seconds
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 3000);
    }
    
    // Celebration Animation
    function startCelebration() {
        // Flash animation
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            const colors = [
                'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                'linear-gradient(135deg, #4cd964 0%, #5ac8fa 100%)',
                'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                'linear-gradient(135deg, #9c27b0 0%, #673ab7 100%)'
            ];
            
            document.body.style.background = colors[flashCount % colors.length];
            
            flashCount++;
            if (flashCount > 6) {
                clearInterval(flashInterval);
                document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
            }
        }, 500);
        
        // Animate all time units
        const timeUnits = document.querySelectorAll('.time-unit');
        timeUnits.forEach((unit, index) => {
            unit.style.animation = `pulse 0.5s ease ${index * 0.1}s 3`;
        });
        
        // Make colons pulse
        const colons = document.querySelectorAll('.colon');
        colons.forEach(colon => {
            colon.style.animation = 'pulse 0.5s ease infinite';
        });
    }
    
    // Animate Background
    function animateBackground() {
        let hue = 220;
        
        function animate() {
            hue = (hue + 0.05) % 360;
            document.body.style.background = `
                linear-gradient(135deg, 
                    hsl(${hue}, 60%, 15%) 0%, 
                    hsl(${(hue + 30) % 360}, 70%, 20%) 50%, 
                    hsl(${(hue + 60) % 360}, 80%, 25%) 100%
                )`;
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // Animate Floating Elements
    function animateFloatingElements() {
        const items = document.querySelectorAll('.floating-item');
        
        items.forEach((item, index) => {
            // Random starting position
            const startX = Math.random() * 80 + 10;
            const startY = Math.random() * 80 + 10;
            
            item.style.left = `${startX}%`;
            item.style.top = `${startY}%`;
            
            // Random animation
            const duration = 20 + Math.random() * 20;
            const delay = index * 2;
            
            item.style.animation = `
                floatAround ${duration}s ease-in-out ${delay}s infinite alternate
            `;
        });
    }
    
    // Add keyboard shortcut to skip countdown (for testing)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            if (confirm('Skip countdown and go to main page? (Test only)')) {
                window.location.href = 'main.html';
            }
        }
    });
});

// Additional animation for floating elements
const style = document.createElement('style');
style.textContent = `
    @keyframes floatAround {
        0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
        }
        25% {
            transform: translate(20px, -20px) rotate(90deg) scale(1.1);
        }
        50% {
            transform: translate(0, -40px) rotate(180deg) scale(1);
        }
        75% {
            transform: translate(-20px, -20px) rotate(270deg) scale(1.1);
        }
        100% {
            transform: translate(0, 0) rotate(360deg) scale(1);
        }
    }
    
    .time-unit.active {
        background: rgba(255, 255, 255, 0.15) !important;
        box-shadow: 0 0 30px rgba(255, 235, 59, 0.4) !important;
    }
    
    .redirect-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(20px);
        padding: 40px;
        border-radius: 20px;
        border: 2px solid #4cd964;
        text-align: center;
        z-index: 1000;
        animation: fadeIn 0.5s ease;
        max-width: 500px;
        width: 90%;
    }
    
    .redirect-message h3 {
        color: #4cd964;
        font-size: 1.8rem;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
    }
    
    .redirect-message p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.1rem;
    }
    
    .redirect-message.hidden {
        display: none;
    }
`;
document.head.appendChild(style);
