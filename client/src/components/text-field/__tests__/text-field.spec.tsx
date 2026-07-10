import { render, screen } from '@testing-library/react'
import { TextField } from '../text-field'

describe('TextField', () => {
    test('example', () => {
        const { container } = render(<TextField label="Name" />)
        expect(container).toMatchSnapshot()

        expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument()
    })
})
