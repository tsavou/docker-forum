import { vi } from 'vitest';

// Configuration globale pour les tests Vitest
// Ce fichier est exécuté avant chaque fichier de test

// Mock global de window.alert pour éviter les popups pendant les tests
// (peut être surchargé dans les tests individuels si nécessaire)
global.alert = vi.fn();

// Configuration de l'environnement pour les tests
process.env.NODE_ENV = 'test';
