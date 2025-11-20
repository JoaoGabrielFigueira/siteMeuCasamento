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

// Busca simples, filtro e marcação de compra (estado local — sem backend)
document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('giftList');
  if (!list) return; // nada a fazer se não estivermos na página de presentes

  // removi a lógica de busca/filtro (não existe mais no HTML)

  // comprar / desfazer compra (apenas UI local)
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.buy-button');
    if (!btn) return;
    const id = btn.dataset.id;
    const item = list.querySelector(`.gift-item[data-id="${id}"]`);
    if (!item) return;
    const status = item.getAttribute('data-status') || 'available';

    if (status === 'available') {
      // marcar como comprado
      item.setAttribute('data-status', 'reserved');
      btn.classList.add('purchased');
      btn.textContent = 'Comprado';
      btn.disabled = true;
    } else {
      // caso queira permitir desfazer, ajuste aqui (no momento não permite)
    }
  });

  // removi o handler de detalhes (não existe mais botão de detalhes)
});

// Modal de Compra
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('purchaseModal');
    const closeBtn = document.querySelector('.close-modal');
    const copyPixBtn = document.querySelector('.copy-pix');
    const pixKey = document.getElementById('pixKey');

    // Abrir modal ao clicar em Comprar
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
        const item = this.closest('.gift-item');
        const title = item.querySelector('.gift-title').textContent;
        const desc = item.querySelector('.gift-desc').textContent;
        const img = item.querySelector('.gift-thumb').src;
        const price = item.dataset.price || '—';
        const checkout = item.dataset.checkout || '#';

        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalDesc').textContent = desc;
        document.getElementById('modalImage').src = img;
        document.getElementById('modalPrice').textContent =
            `Seu presente: R$ ${Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

        // Atualiza o link do botão de pagamento
        document.getElementById('checkoutButton').href = checkout;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
});

    });

    // Fechar modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Copiar chave PIX
    copyPixBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(pixKey.textContent).then(() => {
            copyPixBtn.textContent = 'Copiado!';
            setTimeout(() => {
                copyPixBtn.textContent = 'Copiar Chave PIX';
            }, 2000);
        });
    });
});
// ==========================
// CONFIRMAÇÃO DE PRESENÇA
// ==========================

// URL do backend
const API_BASE_URL = "http://localhost:3000";

// Elementos
const guestInput = document.getElementById("guestInput");
const guestResult = document.getElementById("guestResult");
const guestNicknameEl = document.getElementById("guestNickname");
const rsvpMessageEl = document.getElementById("rsvpMessage");

const confirmBtn = document.getElementById("confirmButton");
const declineBtn = document.getElementById("declineButton");

let currentGuest = null;

// Remove acentos
function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// ==========================
// BUSCAR CONVIDADO
// ==========================
async function searchGuest() {
  const rawInput = guestInput.value.trim();

  if (rawInput.length < 3) {
    rsvpMessageEl.textContent = "Digite pelo menos 3 letras.";
    guestResult.classList.add("hidden");
    return;
  }

  rsvpMessageEl.textContent = "Buscando...";
  guestResult.classList.add("hidden");

  try {
    // ⚠️ Agora enviamos o nome exatamente como digitado
    const encoded = encodeURIComponent(rawInput);

    const response = await fetch(`${API_BASE_URL}/api/guest/${encoded}`);

    if (!response.ok) {
      rsvpMessageEl.textContent = "Convidado não encontrado 😢";
      currentGuest = null;
      return;
    }

    const data = await response.json();

    currentGuest = data.guest;

    // Preenche apelido do convidado
    guestNicknameEl.textContent = data.guest.apelido;

    // Mensagem enviada pelo backend ("Mariazinha é você!!")
    rsvpMessageEl.textContent = data.message;
    rsvpMessageEl.style.color = "black";

    guestResult.classList.remove("hidden");

    // Se já confirmou antes, esconde botões
    if (currentGuest.status !== "pending") {
      confirmBtn.style.display = "none";
      declineBtn.style.display = "none";
    } else {
      confirmBtn.style.display = "inline-block";
      declineBtn.style.display = "inline-block";
    }

  } catch (err) {
    console.error(err);
    rsvpMessageEl.textContent = "Erro ao conectar ao servidor.";
  }
}

// ==========================
// CONFIRMAR / DECLINAR
// ==========================
async function handleRsvpAction(status) {
  if (!currentGuest) return;

  rsvpMessageEl.textContent = "Enviando...";
  confirmBtn.disabled = true;
  declineBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: currentGuest.id,
        status
      })
    });

    const data = await response.json();

    if (!response.ok) {
      rsvpMessageEl.textContent = data.error || "Erro ao salvar.";
      return;
    }

    // Mensagem personalizada do backend
    rsvpMessageEl.textContent = data.finalMessage;
    rsvpMessageEl.style.color = status === "confirmed" ? "green" : "#b30000";

    // Esconde botões
    confirmBtn.style.display = "none";
    declineBtn.style.display = "none";

  } catch (err) {
    console.error(err);
    rsvpMessageEl.textContent = "Erro no servidor.";
  } finally {
    confirmBtn.disabled = false;
    declineBtn.disabled = false;
  }
}

// ==========================
// EVENTOS
// ==========================

// Busca quando o usuário aperta ENTER
guestInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchGuest();
  }
});

// Busca automática depois de parar de digitar
let typingTimer;
guestInput.addEventListener("input", () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(searchGuest, 500);
});

// Botões
confirmBtn.addEventListener("click", () => handleRsvpAction("confirmed"));
declineBtn.addEventListener("click", () => handleRsvpAction("declined"));
