<script setup>
import { ref } from 'vue';
import axios from 'axios';


const pseudo = ref('');
const message = ref('');

const sendMessage = async () => {
  try {
    await axios.post('http://api:3000/messages', {
      pseudo: pseudo.value,
      message: message.value,
    });
    pseudo.value = '';
    message.value = '';
    alert('Message envoyé avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
  }
};

</script>


<template>
  <div id="app">
    <h1 class="title">Envoyer un message</h1>
    <form @submit.prevent="sendMessage" class="message-form">
      <div class="form-group">
        <label for="pseudo">Pseudo</label>
        <input
            v-model="pseudo"
            type="text"
            id="pseudo"
            placeholder="Votre pseudo"
            required
        />
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea
            v-model="message"
            id="message"
            placeholder="Votre message"
            required
        ></textarea>
      </div>
      <button type="submit" class="submit-button">Envoyer</button>
    </form>
  </div>
</template>


<style scoped>
#app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.title {
  color: #333;
  margin-bottom: 20px;
}

.message-form {
  display: flex;
  flex-direction: column;
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #218838;
}
</style>
