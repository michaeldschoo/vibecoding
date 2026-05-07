// Lotto Ball Web Component
class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const number = this.getAttribute('number');
    const color = this.getBallColor(parseInt(number));
    const delay = this.getAttribute('delay') || '0s';
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 45px;
          height: 45px;
          perspective: 1000px;
        }
        .ball {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: ${color};
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: white;
          box-shadow: inset -4px -4px 10px rgba(0,0,0,0.3),
                      4px 4px 12px rgba(0,0,0,0.2);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: ${delay};
          opacity: 0;
          transform: scale(0) rotate(-45deg);
        }
        @keyframes popIn {
          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }
      </style>
      <div class="ball">${number}</div>
    `;
  }

  getBallColor(num) {
    if (num <= 10) return 'linear-gradient(135deg, #fbc02d, #f57f17)'; // Yellow
    if (num <= 20) return 'linear-gradient(135deg, #1976d2, #0d47a1)'; // Blue
    if (num <= 30) return 'linear-gradient(135deg, #d32f2f, #b71c1c)'; // Red
    if (num <= 40) return 'linear-gradient(135deg, #7b1fa2, #4a148c)'; // Purple
    return 'linear-gradient(135deg, #388e3c, #1b5e20)'; // Green
  }
}

customElements.define('lotto-ball', LottoBall);

// Main Logic
document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-btn');
  const ballDisplay = document.getElementById('ball-display');

  function generateSingleSet() {
    const numbers = [];
    while (numbers.length < 6) {
      const rand = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(rand)) {
        numbers.push(rand);
      }
    }
    return numbers.sort((a, b) => a - b);
  }

  generateBtn.addEventListener('click', () => {
    // Clear display
    ballDisplay.innerHTML = '';

    // Generate 5 sets
    for (let i = 0; i < 5; i++) {
      const numbers = generateSingleSet();
      const setRow = document.createElement('div');
      setRow.className = 'set-row';
      setRow.style.animationDelay = `${i * 0.1}s`;

      numbers.forEach((num, index) => {
        const ball = document.createElement('lotto-ball');
        ball.setAttribute('number', num);
        // Each ball has a staggered delay based on set and index
        ball.setAttribute('delay', `${(i * 0.15) + (index * 0.05)}s`);
        setRow.appendChild(ball);
      });

      ballDisplay.appendChild(setRow);
    }
  });
});
