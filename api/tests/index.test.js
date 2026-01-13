import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app, { pool } from '../index.js';

// Mock de la base de données
const mockMessages = [];
let messageIdCounter = 1;

describe('API Forum', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    mockMessages.length = 0;
    messageIdCounter = 1;
    
    // Créer un nouveau mock pool pour chaque test
    pool.query = vi.fn((query, params) => {
      if (query.includes('INSERT INTO messages')) {
        const [pseudo, message] = params || [];
        if (!pseudo || !message) {
          return Promise.reject(new Error('Pseudo and message are required'));
        }
        const newMessage = {
          id: messageIdCounter++,
          pseudo,
          message,
          created_at: new Date().toISOString(),
        };
        mockMessages.push(newMessage);
        return Promise.resolve({ rows: [newMessage] });
      }
      if (query.includes('SELECT * FROM messages')) {
        return Promise.resolve({ rows: [...mockMessages] });
      }
      return Promise.resolve({ rows: [] });
    });
  });

  describe('GET /', () => {
    it('devrait retourner "API is running"', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('API is running');
    });
  });

  describe('POST /messages', () => {
    it('devrait créer un nouveau message avec pseudo et message valides', async () => {
      const messageData = {
        pseudo: 'TestUser',
        message: 'Ceci est un message de test',
      };

      const response = await request(app)
        .post('/messages')
        .send(messageData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.pseudo).toBe(messageData.pseudo);
      expect(response.body.message).toBe(messageData.message);
      expect(response.body).toHaveProperty('created_at');
    });

    it('devrait retourner une erreur 500 si pseudo est manquant', async () => {
      await request(app)
        .post('/messages')
        .send({ message: 'Message sans pseudo' })
        .expect(500);
    });

    it('devrait retourner une erreur 500 si message est manquant', async () => {
      await request(app)
        .post('/messages')
        .send({ pseudo: 'User' })
        .expect(500);
    });
  });

  describe('GET /messages', () => {
    it('devrait retourner une liste de messages', async () => {
      // Créer un message d'abord pour s'assurer qu'il y en a au moins un
      await request(app)
        .post('/messages')
        .send({ pseudo: 'User1', message: 'Message de test pour GET' });

      const response = await request(app)
        .get('/messages')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('pseudo');
      expect(response.body[0]).toHaveProperty('message');
      expect(response.body[0]).toHaveProperty('created_at');
    });
  });
});
