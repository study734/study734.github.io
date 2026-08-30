import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, test } from 'vitest'
import { Header } from './Header'

afterEach(() => cleanup())

describe('Header', () => {
  test('opens an accessible mobile navigation menu', () => {
    render(<Header />)

    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))

    const dialog = screen.getByRole('dialog')
    const navigation = within(dialog).getByRole('navigation', { name: 'Mobile portfolio navigation' })

    expect(within(navigation).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
    expect(within(navigation).getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience')
    expect(within(navigation).getByRole('link', { name: 'Stack' })).toHaveAttribute('href', '#stack')
  })
})
