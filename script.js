const canvas = document.getElementById('ionCanvas');
const ctx = canvas.getContext('2d');
const ions = []; // An array to store ion objects

let selectedIon = null; // Track the currently selected ion
let isDragging = false; // Flag to check if the ion is being dragged

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Function to create an ion object
function createIon(x, y, charge, mass) {
    return {
        x,
        y,
        charge,
        mass,
        radius: 20, // Adjust as needed
        velocityX: 0, // Initial velocity in the x direction
        velocityY: 0, // Initial velocity in the y direction
    };
}

// Function to draw ions
function drawIons() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

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

        // Ensure the ion stays within the canvas boundaries
        selectedIon.x = Math.max(selectedIon.radius, Math.min(canvasWidth - selectedIon.radius, mouseX));
        selectedIon.y = Math.max(selectedIon.radius, Math.min(canvasHeight - selectedIon.radius, mouseY));
        drawIons(); // Redraw ions to update the position
    }
});

// Function to handle mouseup event
canvas.addEventListener('mouseup', function () {
    isDragging = false;
    selectedIon = null;
});

// Function to update ion positions based on their velocity
function updateIons() {
    ions.forEach(ion => {
        if (!isDragging) {
            ion.x += ion.velocityX;
            ion.y += ion.velocityY;
        }

        // Reflect ions off the canvas edges if they go out of bounds
        if (ion.x - ion.radius < 0 || ion.x + ion.radius > canvasWidth) {
            ion.velocityX *= -1; // Reverse the x velocity
        }
        if (ion.y - ion.radius < 0
