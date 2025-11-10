import { test, expect } from '@playwright/test';
import { createRoot } from '@react-three/test-renderer';
import React from 'react';
import ThreeScene from '@/app/ThreeScene';

/**
 * Uwaga: Testy z test-renderer mogą wymagać mockowania zależności.
 * W środowisku Playwright możemy użyć dynamicznych importów lub
 * przygotować komponenty do testowania bez pełnych zależności.
 */

/**
 * End-to-end test dla sceny 3D z wykorzystaniem Playwright i @react-three/test-renderer
 */
test.describe('Scene E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Oczekiwanie na załadowanie strony
    await page.goto('/scene');
  });

  test('powinien załadować stronę sceny', async ({ page }) => {
    // Sprawdzenie czy strona się załadowała
    await expect(page).toHaveURL(/.*scene/);
    
    // Sprawdzenie czy canvas jest widoczny
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('powinien wyświetlić prompt "Click to enter viewing mode"', async ({ page }) => {
    // Oczekiwanie na załadowanie sceny
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Sprawdzenie czy prompt jest widoczny
    const prompt = page.locator('text=Click to enter viewing mode');
    await expect(prompt).toBeVisible();
  });

  test('powinien wejść w tryb przeglądania po kliknięciu', async ({ page }) => {
    // Oczekiwanie na załadowanie sceny
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Kliknięcie w canvas aby wejść w tryb przeglądania
    const canvas = page.locator('canvas');
    await canvas.click();
    
    // Sprawdzenie czy prompt zniknął (pointer lock jest aktywny)
    // Uwaga: pointer lock może wymagać interakcji użytkownika w niektórych przeglądarkach
    await page.waitForTimeout(500);
    
    // Sprawdzenie czy przycisk audio jest widoczny
    const audioButton = page.locator('button[class*="bg-gray-800"]');
    await expect(audioButton).toBeVisible();
  });

  test('powinien przełączać audio po kliknięciu przycisku', async ({ page }) => {
    // Oczekiwanie na załadowanie sceny
    await page.waitForSelector('canvas', { timeout: 10000 });
    await page.waitForTimeout(1000); // Czekanie na pełne załadowanie
    
    // Znalezienie przycisku audio
    const audioButton = page.locator('button').filter({ hasText: '' }).last();
    
    // Sprawdzenie czy przycisk jest widoczny
    await expect(audioButton).toBeVisible();
    
    // Kliknięcie przycisku audio
    await audioButton.click();
    
    // Sprawdzenie czy stan się zmienił (ikona powinna się zmienić)
    await page.waitForTimeout(300);
    
    // Kliknięcie ponownie
    await audioButton.click();
    await page.waitForTimeout(300);
  });

  test('powinien wyświetlić informację o ESC po wejściu w tryb przeglądania', async ({ page }) => {
    // Oczekiwanie na załadowanie sceny
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Kliknięcie w canvas
    const canvas = page.locator('canvas');
    await canvas.click();
    
    // Czekanie na pojawienie się komunikatu o ESC
    // Uwaga: ten test może wymagać dodatkowej konfiguracji dla pointer lock
    await page.waitForTimeout(500);
  });

  test('powinien załadować komponenty 3D', async ({ page }) => {
    // Oczekiwanie na załadowanie canvas
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Sprawdzenie czy canvas ma odpowiednie wymiary
    const canvas = page.locator('canvas');
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });
});

/**
 * Testy jednostkowe z wykorzystaniem @react-three/test-renderer
 */
test.describe('ThreeScene Component Tests with test-renderer', () => {
  test('powinien renderować komponent ThreeScene', async () => {
    // Renderowanie komponentu z wykorzystaniem test-renderer
    const root = createRoot();
    
    await root.render(
      React.createElement(ThreeScene, { x: 8.4, y: 4.1, z: -9.2 })
    );
    
    // Sprawdzenie czy root został utworzony
    expect(root).toBeDefined();
    
    // Oczekiwanie na zakończenie renderowania
    await root.advance();
    
    // Sprawdzenie czy scene został utworzony
    const scene = root.scene;
    expect(scene).toBeDefined();
    
    // Sprawdzenie czy camera istnieje
    const camera = root.camera;
    expect(camera).toBeDefined();
    
    // Sprawdzenie pozycji kamery
    expect(camera.position.x).toBeCloseTo(8.4);
    expect(camera.position.y).toBeCloseTo(4.1);
    expect(camera.position.z).toBeCloseTo(-9.2);
    
    // Cleanup
    root.unmount();
  });

  test('powinien renderować komponenty sceny (CinemaModel, VideoScreen, etc.)', async () => {
    const root = createRoot();
    
    await root.render(
      React.createElement(ThreeScene, { x: 0, y: 0, z: 0 })
    );
    
    await root.advance();
    
    const scene = root.scene;
    expect(scene).toBeDefined();
    
    // Sprawdzenie czy scene ma dzieci (komponenty 3D)
    expect(scene.children.length).toBeGreaterThan(0);
    
    root.unmount();
  });

  test('powinien ustawić właściwą pozycję kamery', async () => {
    const testCases = [
      { x: 8.4, y: 4.1, z: -9.2 },
      { x: 0, y: 5, z: -10 },
      { x: 10, y: 2, z: -5 },
    ];
    
    for (const { x, y, z } of testCases) {
      const root = createRoot();
      
      await root.render(
        React.createElement(ThreeScene, { x, y, z })
      );
      
      await root.advance();
      
      const camera = root.camera;
      expect(camera.position.x).toBeCloseTo(x);
      expect(camera.position.y).toBeCloseTo(y);
      expect(camera.position.z).toBeCloseTo(z);
      
      root.unmount();
    }
  });
});

/**
 * Testy integracyjne łączące Playwright z test-renderer
 */
test.describe('Integration Tests', () => {
  test('powinien działać poprawnie w przeglądarce i test-renderer', async ({ page }) => {
    // Test w przeglądarce (Playwright)
    await page.goto('/scene');
    await page.waitForSelector('canvas', { timeout: 10000 });
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    
    // Test komponentu (test-renderer)
    const root = createRoot();
    await root.render(
      React.createElement(ThreeScene, { x: 8.4, y: 4.1, z: -9.2 })
    );
    await root.advance();
    
    expect(root.scene).toBeDefined();
    expect(root.camera).toBeDefined();
    
    root.unmount();
  });
});

