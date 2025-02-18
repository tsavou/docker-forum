<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const messages = ref([]);

const fetchMessages = async () => {
  try {
   const response = await axios.get('http://localhost:3000/messages');
   messages.value = response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

onMounted(() => {
  fetchMessages();
});


</script>

<template>
  <div class="forum-container">
    <h1 class="forum-title">Messages du Forum</h1>
    <ul class="message-list">
      <li v-for="message in messages" :key="message.id" class="message-item">
        <strong class="pseudo">{{ message.pseudo }}:</strong> {{ message.message }}
        <br>
        <span class="date">{{ formatDate(message.created_at) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.forum-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.forum-title {
  text-align: center;
  color: #333;
}

.message-list {
  list-style-type: none;
  padding: 0;
}

.message-item {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
}

.message-item:hover {
  background-color: #f9f9f9;
}

.pseudo {
  color: #007bff;
}

.date {
  font-size: 0.9em;
  color: #777;
}
</style>