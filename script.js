const canvas = document.getElementById('ionCanvas');
const ctx = canvas.getContext('2d');
const ions = []; // An array to store ion objects

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Function to create an ion object
function createIon(x, y, charge, mass, velocityX, velocityY) {
    return {
        x,
        y,
        charge,
        mass,
        radius: 20, // Adjust as needed
        velocityX: velocityX || 0, // Initial velocity in the x direction
        velocityY: velocityY || 0, // Initial velocity in the y direction
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

// Function to update ion positions and handle collisions
function updateIons() {
    ions.forEach(ion => {
        ion.x += ion.velocityX;
        ion.y += ion.velocityY;

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

        // Reflect ions off the canvas edges if they go out of bounds
        if (ion.x - ion.radius < 0 || ion.x + ion.radius > canvasWidth) {
            ion.velocityX *= -1; // Reverse the x velocity
        }
        if (ion.y - ion.radius < 0 || ion.y + ion.radius > canvasHeight) {
            ion.velocityY *= -1; // Reverse the y velocity
        }
    });
}

// Add ions to the array
ions.push(createIon(100, 100, 1, 1, 2, 2)); // Example: Positive ion with mass 1 and initial velocity
ions.push(createIon(200, 200, -1, 1, -2, -2)); // Example: Negative ion with mass 1 and initial velocity

function update() {
    updateIons(); // Update ion positions and handle collisions
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawIons(); // Draw ions in their updated positions
    requestAnimationFrame(update);
}

update(); // Start the simulation loop
