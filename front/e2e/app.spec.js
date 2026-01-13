// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Forum Docker - Tests E2E (Mocked)', () => {
  // On simule une petite base de données pour les tests
  let mockMessages = [
    {
      id: 1,
      pseudo: 'Alice',
      message: 'Bienvenue sur le forum !',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      pseudo: 'Bob',
      message: "Docker c'est cool",
      created_at: new Date().toISOString(),
    },
  ];

  test.beforeEach(async ({ page }) => {
    // 拦截 (Interceptor) l'API pour ne pas dépendre du vrai backend
    // On capture toutes les requêtes vers /messages (ou api/messages)
    await page.route('**/messages', async (route) => {
      const method = route.request().method();

      if (method === 'GET') {
        // SIMULATION GET : On renvoie la liste actuelle
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockMessages),
        });
      } else if (method === 'POST') {
        // SIMULATION POST : On ajoute le message à notre fausse liste
        const postData = route.request().postDataJSON();
        const newMessage = {
          id: mockMessages.length + 1,
          pseudo: postData.pseudo,
          message: postData.message,
          created_at: new Date().toISOString(),
        };

        // On met à jour la "fausse DB" pour que le prochain GET renvoie le nouveau message
        mockMessages.push(newMessage);

        // On répond que c'est créé (201)
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newMessage),
        });
      }
    });

    // Aller sur la page du forum après avoir configuré les mocks
    await page.goto('/');
  });

  // Réinitialiser la "DB" après chaque test pour éviter les effets de bord
  test.afterEach(() => {
    mockMessages = [
      {
        id: 1,
        pseudo: 'Alice',
        message: 'Bienvenue sur le forum !',
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        pseudo: 'Bob',
        message: "Docker c'est cool",
        created_at: new Date().toISOString(),
      },
    ];
  });

  test('devrait afficher le titre et le sous-titre du forum', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Forum.*Docker/i })).toBeVisible(); // Regex insensible à la casse
    // Note: Utilise une partie du texte si le texte exact change souvent
    await expect(page.getByText('anonyme')).toBeVisible();
  });

  test('devrait afficher le formulaire de message', async ({ page }) => {
    const pseudoInput = page.getByLabel(/Pseudo/i); // Regex plus souple
    await expect(pseudoInput).toBeVisible();

    const messageTextarea = page.getByLabel(/Message/i);
    await expect(messageTextarea).toBeVisible();

    const submitButton = page.getByRole('button', { name: /Publier/i });
    await expect(submitButton).toBeVisible();
  });

  test("devrait gérer l'état vide (si aucun message)", async ({ page }) => {
    // Surcharge du Mock juste pour ce test : on force une liste vide
    await page.route('**/messages', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 200, body: JSON.stringify([]) });
      }
    });

    // On recharge la page pour appliquer le mock vide
    await page.reload();

    // Vérifie que le message "Aucun message" est visible
    // Adapte le sélecteur selon ton code (classe .empty-state ou texte spécifique)
    await expect(page.locator('body')).toContainText(/Aucun message/i);
  });

  test('devrait permettre de poster un message et de le voir', async ({ page }) => {
    const pseudo = `TestUser_${Date.now()}`;
    const message = `Ceci est un test E2E ${Date.now()}`;

    // 1. Remplir le formulaire
    await page.getByLabel(/Pseudo/i).fill(pseudo);
    await page.getByLabel(/Message/i).fill(message);

    // 2. Soumettre
    await page.getByRole('button', { name: /Publier/i }).click();

    // 3. Attendre que le POST soit terminé et que le GET suivant soit fait
    // L'application appelle fetchMessages() après le POST, donc on attend que le message apparaisse
    await expect(page.getByText(message)).toBeVisible({ timeout: 5000 });

    // 4. Vérifier que les champs sont vidés (signe que le POST a réussi)
    await expect(page.getByLabel(/Message/i)).toHaveValue('');

    // 5. Vérifier que le pseudo apparaît aussi dans la liste
    await expect(page.getByText(pseudo)).toBeVisible();
  });
});
