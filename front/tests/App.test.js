import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher le titre du forum', () => {
    axios.get.mockResolvedValue({ data: [] });

    const wrapper = mount(App);

    expect(wrapper.text()).toContain('Forum');
    expect(wrapper.text()).toContain('Docker');
  });

  it('devrait afficher le formulaire de message', () => {
    axios.get.mockResolvedValue({ data: [] });

    const wrapper = mount(App);

    expect(wrapper.find('input[id="pseudo"]').exists()).toBe(true);
    expect(wrapper.find('textarea[id="message"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('devrait afficher un message vide si aucun message', async () => {
    axios.get.mockResolvedValue({ data: [] });

    const wrapper = mount(App);

    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Aucun message pour le moment');
  });

  it('devrait afficher les messages récupérés', async () => {
    const mockMessages = [
      {
        id: 1,
        pseudo: 'TestUser',
        message: 'Message de test',
        created_at: '2024-01-13T10:00:00Z',
      },
    ];

    axios.get.mockResolvedValue({ data: mockMessages });

    const wrapper = mount(App);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(); // Attendre le fetchMessages

    expect(wrapper.text()).toContain('TestUser');
    expect(wrapper.text()).toContain('Message de test');
  });

  it('devrait envoyer un message quand le formulaire est soumis', async () => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({
      data: {
        id: 1,
        pseudo: 'NewUser',
        message: 'Nouveau message',
        created_at: '2024-01-13T10:00:00Z',
      },
    });

    const wrapper = mount(App);

    // Remplir le formulaire
    await wrapper.find('input[id="pseudo"]').setValue('NewUser');
    await wrapper.find('textarea[id="message"]').setValue('Nouveau message');

    // Soumettre le formulaire
    await wrapper.find('form').trigger('submit.prevent');

    // Attendre que les appels asynchrones se terminent
    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Vérifier que axios.post a été appelé
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/messages', {
      pseudo: 'NewUser',
      message: 'Nouveau message',
    });
  });

  it('devrait gérer les erreurs lors de la récupération des messages', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValue(new Error('Network error'));

    const wrapper = mount(App);

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("devrait gérer les erreurs lors de l'envoi d'un message", async () => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockRejectedValue(new Error('Network error'));

    const wrapper = mount(App);

    await wrapper.find('input[id="pseudo"]').setValue('User');
    await wrapper.find('textarea[id="message"]').setValue('Message');

    // Mock window.alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await wrapper.find('form').trigger('submit.prevent');

    await wrapper.vm.$nextTick();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(alertSpy).toHaveBeenCalledWith('Une erreur est survenue.');

    alertSpy.mockRestore();
  });
});
