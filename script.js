/* Guarda/checa elementos antes de usar para evitar erros que interrompem todo o script */

// Countdown (só inicia se o elemento existir)
const countdownElement = document.getElementById('countdown');
if (countdownElement) {
    const targetDateString = countdownElement.getAttribute('data-countdown-to');
    const weddingDate = new Date(targetDateString).getTime();

    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const formatTime = (time) => String(time).padStart(2, '0');

        document.getElementById("days").innerHTML = formatTime(days);
        document.getElementById("hours").innerHTML = formatTime(hours);
        document.getElementById("minutes").innerHTML = formatTime(minutes);
        document.getElementById("seconds").innerHTML = formatTime(seconds);

        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = "CASADOS!";
            document.getElementById("countdown").style.fontSize = "3em";
            document.getElementById("countdown").style.color = "#6a0dad";
        }
    }, 1000);
}

// RSVP form (só adiciona listener se existir)
const rsvpForm = document.getElementById('rsvpForm');
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const formMessage = document.getElementById('formMessage');

        const API_ENDPOINT = 'http://localhost:3000/rsvp';

        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao confirmar presença. Tente novamente.');
            return response.json();
        })
        .then(result => {
            formMessage.textContent = '✅ Presença confirmada com sucesso! Obrigado.';
            formMessage.style.color = 'green';
            form.reset();
        })
        .catch(error => {
            console.error('Erro:', error);
            formMessage.textContent = '❌ Houve um erro. Tente novamente mais tarde.';
            formMessage.style.color = 'red';
        });
    });
}

// Copiar chave PIX (querySelectorAll retorna NodeList — forEach em vazio é seguro)
document.querySelectorAll('.pix-copy-button').forEach(button => {
    button.addEventListener('click', function() {
        const pixKey = this.getAttribute('data-pix-key');
        navigator.clipboard.writeText(pixKey).then(() => {
            const originalText = this.textContent;
            this.textContent = 'Chave Copiada! ✅';
            setTimeout(() => this.textContent = originalText, 2000);
        }).catch(err => {
            console.error('Erro ao copiar chave PIX:', err);
            alert('Não foi possível copiar a chave. Por favor, copie manualmente: ' + pixKey);
        });
    });
});

// Header dinâmico: inicializa com segurança mesmo se DOMContentLoaded já ocorreu
function setupHeaderScroll() {
    function handleScroll() {
        try {
            const header = document.getElementById('main-header');
            if (!header) return;
            const scrolled = (window.scrollY || document.documentElement.scrollTop) > 400;
            header.classList.toggle('header-scrolled', scrolled);
        } catch (e) {
            console.error("Erro no handleScroll:", e);
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHeaderScroll);
} else {
    setupHeaderScroll();
}

// Altura da sua navbar fixa
const NAVBAR_HEIGHT = 70;

