import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Main from '../Main';
import '@testing-library/jest-dom/extend-expect';

// Мокаем Apollo Client
jest.mock('../apollo', () => ({
  query: jest.fn(),
}));

// Мокаем FontAwesomeIcon, чтобы избежать ошибки в тесте
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span>Icon</span>,
}));

describe('Main Component', () => {
  test('renders the component with initial state', () => {
    render(<Main />);
    
    // Проверяем, что заголовок компонента существует
    expect(screen.getByText('Data Sources')).toBe;

    // Проверяем, что иконка меню отображается
    expect(screen.getByText('Icon')).toBeVisible();

    // Проверяем, что текст "To data" отображается, если данных нет
    expect(screen.getByText('To data')).toBeInTheDocument();
  });

  test('opens and closes the menu when icon is clicked', async () => {
    render(<Main />);

    // Проверяем, что меню закрыто
    expect(screen.queryByText('Choose columns:')).toBeNull();

    // Кликаем по иконке
    fireEvent.click(screen.getByText('Icon'));

    // Ждем, пока меню откроется
    await waitFor(() => {
      expect(screen.getByText('Choose columns:')).toBeInTheDocument();
    });

    // Кликаем по иконке еще раз
    fireEvent.click(screen.getByText('Icon'));

    // Ждем, пока меню закроется
    await waitFor(() => {
      expect(screen.queryByText('Choose columns:')).toBeNull();
    });
  });
});