const logo = document.querySelector('.d2000');

function startHunting() {
  const rect = logo.getBoundingClientRect();

  logo.style.width = rect.width + 'px';
  logo.style.height = rect.height + 'px';

  const footer = document.querySelector('footer');
  const footerRect = footer.getBoundingClientRect();

  let x = footerRect.left + footerRect.width / 2;
  let y = footerRect.top + footerRect.height * 0.7; 
  
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
  const catchDuration = 1500;
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
    } 
    else {
      hoverStart = null;
    }
  });

  const trailContainer = document.createElement('div');
  document.body.appendChild(trailContainer);

  function spawnTrail(x, y, src, rotation) {
    const img = document.createElement('img');
    img.src = src;
    Object.assign(img.style, {
      position: 'fixed',
      left: x + 'px',
      top: y + 'px',
      width: logo.offsetWidth + 'px',
      height: logo.offsetHeight + 'px',
      transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(80%)`,
      pointerEvents: 'none',
      opacity: '0.7',
      transition: 'opacity 5s linear',
      zIndex: '9998'
    });

    trailContainer.appendChild(img);

    setTimeout(() => {
      img.style.opacity = '0';
      setTimeout(() => {
        if (img.parentNode) trailContainer.removeChild(img);
      }, 5000);
    }, 0);
  }

  // the Animation Function idk how to do comments 
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
      // get faster on approach
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

    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    logo.style.transform = `rotate(${angle}deg)`;

    const centerX = x;
    const centerY = y;

    const distanceToCursor = dist;
    
    logo.style.transform = `rotate(${angle}deg)`;
    const jitter = 3;
    spawnTrail(
      x + (Math.random() - 0.5) * jitter, y + (Math.random() - 0.5) * jitter, 'img/D2000.png', angle
    );

    if (distanceToCursor < catchDistance) {
      if (!catchTimer) catchTimer = performance.now();
      else if (performance.now() - catchTimer >= catchDuration) {
        hunting = false;
        logo.style.opacity = '0';
        animate();
        return;
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