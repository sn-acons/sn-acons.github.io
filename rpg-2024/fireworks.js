const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const fireworks = [];
const particles = [];
const maxFireworks = 10;
const maxParticles = 100;
const colors = ['#FF5733', '#FFA500', '#FFD700', '#FFFF00', '#FF4500', '#FF69B4', '#ADFF2F', '#00FF7F', '#00CED1', '#1E90FF'];
const names = ["Sai Puja", "RPG", "Kicha-Papad", "Nariyal Chatni", "Blenders Pride", "Bacardi Lemon", "Aachar", "Thumbs up", "Chicken Kheema", "Patla aur Soft Roti", "Happy birthday to you Pakya", "Classic Milds"];
const nameObjects = [];

let textAlpha = 1.0; // Initial alpha for fading out
let textFadeOut = true; // Control fading direction
let textSize = 60; // Initial text size
let showTimer = false;

// Initialize name objects with random positions and velocities
names.forEach(name => {
    nameObjects.push({
        text: name,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        fontSize: Math.random() * 20 + 20
    });
});

function createFirework() {
    const firework = {
        x: Math.random() * canvas.width,
        y: canvas.height,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
            x: (Math.random() - 0.5) * 6,
            y: -Math.random() * 10 - 5
        },
        lifespan: Math.random() * 30 + 30, // Control how long each firework lasts
        exploded: false // Track whether the firework has exploded
    };
    fireworks.push(firework);
}

function createParticles(x, y, color) {
    for (let i = 0; i < maxParticles; i++) {
        const particle = {
            x: x,
            y: y,
            size: Math.random() * 2 + 1,
            color: colors[Math.floor(Math.random() * colors.length)], // Random colors for particles
            velocity: {
                x: (Math.random() - 0.5) * 10,
                y: (Math.random() - 0.5) * 10
            },
            lifespan: Math.random() * 20 + 20
        };
        particles.push(particle);
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Slightly transparent fill for trailing effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        if (!firework.exploded) {
            firework.y += firework.velocity.y;
            firework.x += firework.velocity.x;
            firework.lifespan--;

            drawFirework(firework);

            if (firework.lifespan <= 0 || firework.velocity.y >= 0) {
                firework.exploded = true;
                createParticles(firework.x, firework.y, firework.color);
                fireworks.splice(index, 1);
            }
        }
    });

    particles.forEach((particle, index) => {
        particle.lifespan--;
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.size *= 0.95; // Gradually shrink the particles

        drawParticle(particle);

        if (particle.lifespan <= 0) {
            particles.splice(index, 1);
        }
    });

    if (fireworks.length < maxFireworks) {
        createFirework();
    }

    drawNames();
    drawText();
    if (showTimer) {
        drawTimer();
    }
}

function drawFirework(firework) {
    ctx.beginPath();
    ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
    ctx.fillStyle = firework.color;
    ctx.fill();
    ctx.closePath();
}

function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = particle.color;
    ctx.fill();
    ctx.closePath();
}

function drawNames() {
    nameObjects.forEach(nameObj => {
        ctx.save();
        ctx.font = `${nameObj.fontSize}px Arial`;
        ctx.fillStyle = nameObj.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nameObj.text, nameObj.x, nameObj.y);
        ctx.restore();

        // Update positions
        nameObj.x += nameObj.velocityX;
        nameObj.y += nameObj.velocityY;

        // Bounce off edges
        if (nameObj.x < 0 || nameObj.x > canvas.width) {
            nameObj.velocityX = -nameObj.velocityX;
        }
        if (nameObj.y < 0 || nameObj.y > canvas.height) {
            nameObj.velocityY = -nameObj.velocityY;
        }
    });
}

function drawText() {
    ctx.save();
    ctx.globalAlpha = textAlpha; // Set the alpha value
    ctx.font = `${textSize}px 'Courier New', Courier, monospace`; // Use a stylish font
    ctx.fillStyle = textFadeOut ? 'white' : '#FFD700'; // Bright, appealing color for 2025
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textY = canvas.height / 4; // Position text at the top-center
    ctx.fillText(textFadeOut ? 'Bye Bye 2024' : 'Welcome 2025', canvas.width / 2, textY);
    ctx.restore();

    if (textFadeOut) {
        textAlpha -= 0.005; // Slow down the fading out of 2024
        if (textAlpha <= 0) {
            textAlpha = 0;
            textFadeOut = false;
            textSize = 120; // Increase size for 2025
        }
    } else {
        textAlpha += 0.005; // Slow down the fading in of 2025
        if (textAlpha >= 1) {
            textAlpha = 1;
            showTimer = true; // Show the timer after 2025 appears
        }
    }
}

function drawTimer() {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0); // 7:00 PM IST
    let remaining = target - now;

    if (remaining < 0) {
        remaining += 24 * 60 * 60 * 1000; // Adjust for next day's 7:00 PM if time has passed
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    const timerText = `Party Time In: ${hours}h ${minutes}m ${seconds}s`;

    // Create a vibrant gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#FF00FF');
    gradient.addColorStop(0.5, '#FFFF00');
    gradient.addColorStop(1, '#00FFFF');

    ctx.save();
    ctx.globalAlpha = 1; // Ensure the timer text is fully opaque
    ctx.font = '60px Arial Black'; // Bold, modern font
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;
    ctx.fillStyle = gradient; // Use gradient for the text fill
    ctx.textAlign =[_{{{CITATION{{{_1{](https://github.com/EleanorEllingson/web-dev/tree/b2f2a382e77a20fd6895677c8b8f402ac4bae352/7-bank-project%2F1-template-route%2Ftranslations%2FREADME.ko.md)