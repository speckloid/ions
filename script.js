const canvas = document.getElementById('ionCanvas');
const ctx = canvas.getContext('2d');
const ions = []; // An array to store ion objects

let selectedIon = null; // Track the currently selected ion
let isDragging = false; // Flag to check if the ion is being dragged

// Function to create an ion object
function createIon(x, y, charge) {
    return {
        x,
        y,
        charge,
        radius: 20, // Adjust as needed
    };
}

// Function to draw ions
function drawIons() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ions.forEach(ion => {
        ctx.fillStyle = ion.charge > 0 ? 'red' : 'blue';
        ctx.beginPath();
        ctx.arc(ion.x, ion.y, ion.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Function to handle user interaction (e.g., click and drag)
canvas.addEventListener('mousedown', function (e) {
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    // Check if the user clicked on an ion
    for (let i = ions.length - 1; i >= 0; i--) {
        const ion = ions[i];
        const dx = ion.x - mouseX;
        const dy = ion.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= ion.radius) {
            selectedIon = ion;
            isDragging = true;
            break; // We selected an ion, so we can exit the loop
        }
    }
});

// Function to handle mousemove event
canvas.addEventListener('mousemove', function (e) {
    if (isDragging && selectedIon) {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;
        selectedIon.x = mouseX;
        selectedIon.y = mouseY;
        drawIons(); // Redraw ions to update the position
    }
});

// Function to handle mouseup event
canvas.addEventListener('mouseup', function () {
    isDragging = false;
    selectedIon = null;
});

// Add ions to the array
ions.push(createIon(100, 100, 1)); // Example: Positive ion
ions.push(createIon(200, 200, -1)); // Example: Negative ion

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawIons(); // Draw ions in their updated positions
    requestAnimationFrame(update);
}

update(); // Start the simulation loop
