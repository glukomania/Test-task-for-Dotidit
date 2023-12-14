import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Menu from '../Menu';

const headersMock = [
  { Header: 'Column1', accessor: 'col1', isVisible: true },
  { Header: 'Column2', accessor: 'col2', isVisible: false },
  { Header: 'Column3', accessor: 'col3', isVisible: true },
];

describe('Menu component', () => {
  it('renders without crashing', () => {
    render(
      <Menu
        headers={headersMock}
        setHeaders={() => {}}
        header="Test Header"
        setIsMenuOpen={() => {}}
        isMenuOpen={false}
      />
    );
  });

  it('renders the correct number of checkboxes', () => {
    const { container } = render(
      <Menu
        headers={headersMock}
        setHeaders={() => {}}
        header="Test Header"
        setIsMenuOpen={() => {}}
        isMenuOpen={false}
      />
    );

    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(headersMock.length);
  });

  it('toggles the visibility of a column on checkbox change', () => {
    const setHeadersMock = jest.fn();
    const { getByText } = render(
      <Menu
        headers={headersMock}
        setHeaders={setHeadersMock}
        header="Test Header"
        setIsMenuOpen={() => {}}
        isMenuOpen={false}
      />
    );

    fireEvent.click(getByText('Column2').closest('label'));

    expect(setHeadersMock).toHaveBeenCalledWith([
      { Header: 'Column1', accessor: 'col1', isVisible: true },
      { Header: 'Column2', accessor: 'col2', isVisible: true },
      { Header: 'Column3', accessor: 'col3', isVisible: true },
    ]);
  });

  it('does not toggle visibility if only one column is visible', () => {
    const setHeadersMock = jest.fn();
    const { getByText } = render(
      <Menu
        headers={[{ Header: 'Column1', accessor: 'col1', isVisible: true }]}
        setHeaders={setHeadersMock}
        header="Test Header"
        setIsMenuOpen={() => {}}
        isMenuOpen={false}
      />
    );

    fireEvent.click(getByText('Column1').closest('label'));

    expect(setHeadersMock).not.toHaveBeenCalled();
  });
});