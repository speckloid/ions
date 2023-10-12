const canvas = document.getElementById('ionCanvas');
const ctx = canvas.getContext('2d');
const ions = []; // An array to store ion objects

let selectedIon = null; // Track the currently selected ion
let isDragging = false; // Flag to check if the ion is being dragged
let mouseReleased = true; // Flag to check if the mouse button is released

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
        accelerationX: 0, // Initial acceleration in the x direction
        accelerationY: 0, // Initial acceleration in the y direction
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

// Function to calculate the Coulomb's law force between two ions
function calculateCoulombsLawForce(ion1, ion2) {
    const dx = ion2.x - ion1.x;
    const dy = ion2.y - ion1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const k = 9e9; // Coulomb's law constant, you can adjust this value
    const force = (k * ion1.charge * ion2.charge) / (distance * distance);
    const angle = Math.atan2(dy, dx);
    const forceX = force * Math.cos(angle);
    const forceY = force * Math.sin(angle);

    return { forceX, forceY };
}

// Function to update ion positions and handle Coulomb's law interactions
function updateIons() {
    ions.forEach(ion => {
        ion.accelerationX = 0;
        ion.accelerationY = 0;

        if (!isDragging && mouseReleased) {
            ions.forEach(otherIon => {
                if (ion !== otherIon) {
                    const { forceX, forceY } = calculateCoulombsLawForce(ion, otherIon);
                    ion.accelerationX += forceX / ion.mass;
                    ion.accelerationY += forceY / ion.mass;
                }
            });
            ion.velocityX += ion.accelerationX;
            ion.velocityY += ion.accelerationY;
            ion.x += ion.velocityX;
            ion.y += ion.velocityY;
        }

        // Reflect ions off the canvas edges if they go out of bounds
        if (ion.x - ion.radius < 0 || ion.x + ion.radius > canvasWidth) {
            ion.velocityX *= -1; // Reverse the x velocity
        }
        if (ion.y - ion.radius < 0 || ion.y + ion.radius > canvasHeight) {
            ion.velocityY *= -1; // Reverse the y velocity
        }
    });

    // Handle ion-ion collisions
    ions.forEach(ion => {
        ions.forEach(otherIon => {
            if (ion !== otherIon) {
                const dx = otherIon.x - ion.x;
                const dy = otherIon.y - ion.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const totalRadius = ion.radius + otherIon.radius;

                if (distance < totalRadius) {
                    // Elastic collision
                    const angle = Math.atan2(dy, dx);

                    // Calculate relative velocity
                    const relativeVelocityX = ion.velocityX - otherIon.velocityX;
                    const relativeVelocityY = ion.velocityY - otherIon.velocityY;

                    // Calculate dot product of relative velocity and normal vector
                    const dotProduct = (relativeVelocityX * dx + relativeVelocityY * dy) / distance;

                    // Update velocities
                    ion.velocityX -= (2 * otherIon.mass / (ion.mass + otherIon.mass)) * dotProduct * Math.cos(angle);
                    ion.velocityY -= (2 * otherIon.mass / (ion.mass + otherIon.mass)) * dotProduct * Math.sin(angle);
                    otherIon.velocityX += (2 * ion.mass / (ion.mass + otherIon.mass)) * dotProduct * Math.cos(angle);
                    otherIon.velocityY += (2 * ion.mass / (ion.mass + otherIon.mass)) * dotProduct * Math.sin(angle);

                    // Move ions so they don't overlap
                    const overlap = totalRadius - distance;
                    const moveX = (overlap / 2) * Math.cos(angle);
                    const moveY = (overlap / 2) * Math.sin(angle);
                    ion.x -= moveX;
                    ion.y -= moveY;
                    otherIon.x += moveX;
                    otherIon.y += moveY;
                }
            }
        });
    });

    drawIons(); // Redraw ions after updating their positions
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
            selectedIon = ion
