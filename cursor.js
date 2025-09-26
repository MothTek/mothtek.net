const logo = document.querySelector('.d2000');

function startHunting() {
    const rect = logo.getBoundingClientRect();

    logo.style.width = rect.width + 'px';
    logo.style.height = rect.height + 'px';

    let x = rect.left + rect.width / 2;
    let y = rect.top + rect.height / 2 - 15; 

    logo.style.position = 'fixed';
    logo.style.left = x - logo.offsetWidth / 2 + 'px';
    logo.style.top  = y - logo.offsetHeight / 2 + 'px';

    let vx = 0;
    let vy = 0;
    let hunting = false;
    let mouseX = x;
    let mouseY = y;

    let catchTimer = 0;
    const catchDistance = 15;
    const catchDuration = 3000;
    const catchChance = 0.1;

    let hoverStart = null;

    document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const rect = logo.getBoundingClientRect();
    const cursorInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if (cursorInside) {
        if (!hoverStart) hoverStart = performance.now();
        else if (!hunting && performance.now() - hoverStart >= 1500) {
        hunting = true;
        vx = 0;
        vy = 0;
        }
    } else {
        hoverStart = null;
    }
    });

    function animate(timestamp) {
        if (hunting) {
            const dx = mouseX - x;
            const dy = mouseY - y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist > 1) {
            const baseSpeed = 0.2;
            const minSpeed = 0.5;
            const maxSpeed = 15;
            const minDistance = 10;
            const maxDistance = 500;

            const clampedDist = Math.max(minDistance, Math.min(dist, maxDistance));
            const speedFactor = minSpeed + (clampedDist - minDistance) / (maxDistance - minDistance) * (maxSpeed - minSpeed);

            const moveX = (dx / dist) * baseSpeed * speedFactor;
            const moveY = (dy / dist) * baseSpeed * speedFactor;

            vx = vx * 0.8 + moveX * 0.2;
            vy = vy * 0.8 + moveY * 0.2;

            x += vx;
            y += vy;

            logo.style.left = x - logo.offsetWidth / 2 + 'px';
            logo.style.top  = y - logo.offsetHeight / 2 + 'px';
        }

        const centerX = x;
        const centerY = y;
        const distanceToCursor = Math.sqrt((mouseX - centerX)**2 + (mouseY - centerY)**2);

        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        logo.style.transform = `rotate(${angle}deg)`;

        if (distanceToCursor < catchDistance) {
            if (!catchTimer) catchTimer = performance.now();
            else if (performance.now() - catchTimer >= catchDuration) {
                if (Math.random() < catchChance) {
                hunting = false;
                window.location.href = "https://phytium.com.cn";
                return;
                } else {
                    catchTimer = performance.now();
                }
            }
        } else {
            catchTimer = 0;
        }
    }

requestAnimationFrame(animate);
}

animate();
}

if (logo.complete) {
  startHunting();
} else {
  logo.addEventListener('load', startHunting);
}
