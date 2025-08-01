// Generate particles for the body
const particleContainer = document.getElementById("particles");

for (let i = 0; i < 100; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
    particleContainer.appendChild(particle);
}

const letters = {
    "B": [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    "U": [
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    "D": [
        [1, 1, 0],
        [1, 0, 1],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 0]
    ],
    "G": [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 1],
        [1, 0, 1],
        [1, 1, 1]
    ],
    "E": [
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
        [1, 1, 1]
    ],
    "T": [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ],
};

function createLetter(letter) {
    const grid = letters[letter];
    const letterContainer = document.createElement("div");
    letterContainer.classList.add("grid", "grid-cols-3", "gap-1");

    grid.forEach(row => {
        row.forEach(cell => {
            const block = document.createElement("div");
            if (cell === 1) block.classList.add("letter-block");
            letterContainer.appendChild(block);
        });
    });

    return letterContainer;
}

// Get the container
const wordContainer = document.getElementById("word");
wordContainer.classList.add("word-container");

// Create the first word (BUDGET)
const line1 = document.createElement("div");
line1.classList.add("word");
"BUDGET".split("").forEach((char, index) => {
    setTimeout(() => {
        const letter = createLetter(char);
        line1.appendChild(letter);
    }, index * 300);
});

// Create the second word (BUDDY)
const line2 = document.createElement("div");
line2.classList.add("word");
"BUDDY".split("").forEach((char, index) => {
    setTimeout(() => {
        const letter = createLetter(char);
        line2.appendChild(letter);
    }, (index + 6) * 300); // Starts after "BUDGET"
});

// Append both lines
wordContainer.appendChild(line1);
setTimeout(() => {
    wordContainer.appendChild(line2);
}, 1800);

// Redirect to index.html after 3.5 seconds
setTimeout(() => {
    window.location.href = "../index.html";
}, 3500);