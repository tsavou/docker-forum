<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

// --- État ---
const pseudo = ref('');
const message = ref('');
const messages = ref([]);
const isSending = ref(false); // Pour gérer l'état du bouton

// --- Actions ---

const fetchMessages = async () => {
  try {
    const response = await axios.get('http://localhost:3000/messages');
    // On inverse l'ordre pour voir les nouveaux messages en haut (optionnel)
    messages.value = response.data.reverse();
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
  }
};

const sendMessage = async () => {
  if (!pseudo.value.trim() || !message.value.trim()) return;

  isSending.value = true;
  try {
    await axios.post('http://localhost:3000/messages', {
      pseudo: pseudo.value,
      message: message.value,
    });

    message.value = '';

    await fetchMessages();
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    alert('Une erreur est survenue.');
  } finally {
    isSending.value = false;
  }
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// --- Cycle de vie ---
onMounted(() => {
  fetchMessages();
});
</script>

<template>
  <div class="page-wrapper">
    <div class="forum-container">
      <header class="header">
        <h1>💬 Forum <span class="highlight">Docker</span></h1>
        <p class="subtitle">Espace de discussion anonyme et sécurisé</p>
      </header>

      <section class="card input-card">
        <form class="message-form" @submit.prevent="sendMessage">
          <div class="input-group">
            <label for="pseudo">Pseudo</label>
            <input
              id="pseudo"
              v-model="pseudo"
              type="text"
              placeholder="Ex: John Doe"
              required
              class="input-field"
            />
          </div>
          <div class="input-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="message"
              placeholder="Qu'avez-vous à partager ?"
              required
              rows="3"
              class="input-field textarea-field"
              @keydown="handleKeyDown"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button" :disabled="isSending">
              <span v-if="isSending">Envoi...</span>
              <span v-else>Publier le message</span>
            </button>
          </div>
        </form>
      </section>

      <section class="feed-section">
        <h2 class="feed-title">Messages récents</h2>

        <div v-if="messages.length === 0" class="empty-state">
          Aucun message pour le moment. Soyez le premier !
        </div>

        <ul v-else class="message-list">
          <li v-for="msg in messages" :key="msg.id" class="message-card">
            <div class="message-header">
              <div class="avatar-placeholder">
                {{ msg.pseudo.charAt(0).toUpperCase() }}
              </div>
              <div class="meta-info">
                <strong class="pseudo">{{ msg.pseudo }}</strong>
                <span class="date">{{ formatDate(msg.created_at) }}</span>
              </div>
            </div>
            <p class="message-content">{{ msg.message }}</p>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* --- Variables & Reset --- */
.page-wrapper {
  background-color: #f3f4f6; /* Gris très clair moderne */
  min-height: 100vh;
  padding: 40px 20px;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  color: #1f2937;
}

.forum-container {
  max-width: 700px;
  margin: 0 auto;
}

/* --- Header --- */
.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.025em;
  margin: 0;
  color: #111827;
}

.highlight {
  color: #4f46e5; /* Indigo moderne */
}

.subtitle {
  color: #6b7280;
  margin-top: 5px;
}

/* --- Cards General --- */
.card {
  background: white;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 24px;
  margin-bottom: 30px;
}

/* --- Formulaire --- */
.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  background-color: #f9fafb;
  box-sizing: border-box; /* Important pour ne pas casser la layout */
}

.input-field:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background-color: white;
}

.textarea-field {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.submit-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.submit-button:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-button:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}

/* --- Feed --- */
.feed-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #374151;
}

.message-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  font-size: 1.1rem;
}

.meta-info {
  display: flex;
  flex-direction: column;
}

.pseudo {
  font-weight: 700;
  color: #111827;
}

.date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.message-content {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap; /* Préserve les retours à la ligne */
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-style: italic;
  background: white;
  border-radius: 12px;
  border: 1px dashed #d1d5db;
}
</style>
