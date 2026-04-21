document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.querySelector('.background-container');
    const button = document.getElementById('notifyBtn');

    // Add subtle parallax effect on mouse move
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 60;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 60;
            
            // Smooth transform
            bgContainer.style.transform = `scale(1.05) translate(${xAxis}px, ${yAxis}px)`;
        });
    }

    // Button click interaction
    button.addEventListener('click', () => {
        const originalText = button.querySelector('.btn-text').innerText;
        button.querySelector('.btn-text').innerText = "WE'LL NOTIFY YOU!";
        button.style.borderColor = "#00ffff"; // Cyan 
        button.style.color = "#00ffff";
        
        // Disable the before pseudo-element temporarily via class
        button.classList.add('clicked');
        
        // Note: Actually, keeping it simple for the showcase.
        setTimeout(() => {
            button.querySelector('.btn-text').innerText = originalText;
            button.style.borderColor = "";
            button.style.color = "";
            button.classList.remove('clicked');
        }, 2000);
    });
});
