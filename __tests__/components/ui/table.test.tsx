/**
 * Tests for Table UI components
 * Tests semantic HTML table elements with custom styling
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table'

describe('Table Components', () => {
  describe('Table', () => {
    it('should render table element', () => {
      render(<Table />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('should wrap table in overflow container', () => {
      const { container } = render(<Table />)

      const wrapper = container.querySelector('.overflow-auto')
      expect(wrapper).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Table className="custom-table" />)

      const table = screen.getByRole('table')
      expect(table).toHaveClass('custom-table')
    })

    it('should have base styling classes', () => {
      render(<Table />)

      const table = screen.getByRole('table')
      expect(table).toHaveClass('w-full')
      expect(table).toHaveClass('caption-bottom')
      expect(table).toHaveClass('text-sm')
    })

    it('should forward ref', () => {
      const ref = React.createRef<HTMLTableElement>()
      render(<Table ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLTableElement)
    })

    it('should accept children', () => {
      render(
        <Table>
          <tbody>
            <tr>
              <td>Test Cell</td>
            </tr>
          </tbody>
        </Table>
      )

      expect(screen.getByText('Test Cell')).toBeInTheDocument()
    })
  })

  describe('TableHeader', () => {
    it('should render thead element', () => {
      const { container } = render(
        <table>
          <TableHeader />
        </table>
      )

      const thead = container.querySelector('thead')
      expect(thead).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableHeader className="custom-header" />
        </table>
      )

      const thead = container.querySelector('thead')
      expect(thead).toHaveClass('custom-header')
    })

    it('should have border styling for rows', () => {
      const { container } = render(
        <table>
          <TableHeader className="test-header" />
        </table>
      )

      const thead = container.querySelector('thead')
      expect(thead).toHaveClass('[&_tr]:border-b')
    })

    it('should accept children', () => {
      render(
        <table>
          <TableHeader>
            <tr>
              <th>Header Cell</th>
            </tr>
          </TableHeader>
        </table>
      )

      expect(screen.getByText('Header Cell')).toBeInTheDocument()
    })
  })

  describe('TableBody', () => {
    it('should render tbody element', () => {
      const { container } = render(
        <table>
          <TableBody />
        </table>
      )

      const tbody = container.querySelector('tbody')
      expect(tbody).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableBody className="custom-body" />
        </table>
      )

      const tbody = container.querySelector('tbody')
      expect(tbody).toHaveClass('custom-body')
    })

    it('should have last row border styling', () => {
      const { container } = render(
        <table>
          <TableBody />
        </table>
      )

      const tbody = container.querySelector('tbody')
      expect(tbody).toHaveClass('[&_tr:last-child]:border-0')
    })

    it('should accept children', () => {
      render(
        <table>
          <TableBody>
            <tr>
              <td>Body Cell</td>
            </tr>
          </TableBody>
        </table>
      )

      expect(screen.getByText('Body Cell')).toBeInTheDocument()
    })
  })

  describe('TableFooter', () => {
    it('should render tfoot element', () => {
      const { container } = render(
        <table>
          <TableFooter />
        </table>
      )

      const tfoot = container.querySelector('tfoot')
      expect(tfoot).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableFooter className="custom-footer" />
        </table>
      )

      const tfoot = container.querySelector('tfoot')
      expect(tfoot).toHaveClass('custom-footer')
    })

    it('should have footer styling classes', () => {
      const { container } = render(
        <table>
          <TableFooter />
        </table>
      )

      const tfoot = container.querySelector('tfoot')
      expect(tfoot).toHaveClass('border-t')
      expect(tfoot).toHaveClass('bg-muted/50')
      expect(tfoot).toHaveClass('font-medium')
    })

    it('should accept children', () => {
      render(
        <table>
          <TableFooter>
            <tr>
              <td>Footer Cell</td>
            </tr>
          </TableFooter>
        </table>
      )

      expect(screen.getByText('Footer Cell')).toBeInTheDocument()
    })
  })

  describe('TableRow', () => {
    it('should render tr element', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>
      )

      const tr = container.querySelector('tr')
      expect(tr).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow className="custom-row" />
          </tbody>
        </table>
      )

      const tr = container.querySelector('tr')
      expect(tr).toHaveClass('custom-row')
    })

    it('should have row styling classes', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>
      )

      const tr = container.querySelector('tr')
      expect(tr).toHaveClass('border-b')
      expect(tr).toHaveClass('transition-colors')
      expect(tr).toHaveClass('hover:bg-muted/50')
    })

    it('should support selected state', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow data-state="selected" />
          </tbody>
        </table>
      )

      const tr = container.querySelector('tr')
      expect(tr).toHaveClass('data-[state=selected]:bg-muted')
    })

    it('should accept children', () => {
      render(
        <table>
          <tbody>
            <TableRow>
              <td>Row Cell</td>
            </TableRow>
          </tbody>
        </table>
      )

      expect(screen.getByText('Row Cell')).toBeInTheDocument()
    })
  })

  describe('TableHead', () => {
    it('should render th element', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </thead>
        </table>
      )

      const th = screen.getByRole('columnheader', { name: 'Header' })
      expect(th).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead className="custom-head">Header</TableHead>
            </tr>
          </thead>
        </table>
      )

      const th = screen.getByRole('columnheader')
      expect(th).toHaveClass('custom-head')
    })

    it('should have header styling classes', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </thead>
        </table>
      )

      const th = screen.getByRole('columnheader')
      expect(th).toHaveClass('h-12')
      expect(th).toHaveClass('px-4')
      expect(th).toHaveClass('text-left')
      expect(th).toHaveClass('align-middle')
      expect(th).toHaveClass('font-medium')
    })

    it('should accept children', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Name</TableHead>
            </tr>
          </thead>
        </table>
      )

      expect(screen.getByText('Name')).toBeInTheDocument()
    })

    it('should support scope attribute', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead scope="col">Column Header</TableHead>
            </tr>
          </thead>
        </table>
      )

      const th = screen.getByRole('columnheader')
      expect(th).toHaveAttribute('scope', 'col')
    })
  })

  describe('TableCell', () => {
    it('should render td element', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell Content</TableCell>
            </tr>
          </tbody>
        </table>
      )

      const td = screen.getByRole('cell', { name: 'Cell Content' })
      expect(td).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell className="custom-cell">Content</TableCell>
            </tr>
          </tbody>
        </table>
      )

      const td = screen.getByRole('cell')
      expect(td).toHaveClass('custom-cell')
    })

    it('should have cell styling classes', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Content</TableCell>
            </tr>
          </tbody>
        </table>
      )

      const td = screen.getByRole('cell')
      expect(td).toHaveClass('p-4')
      expect(td).toHaveClass('align-middle')
    })

    it('should accept children', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Test Data</TableCell>
            </tr>
          </tbody>
        </table>
      )

      expect(screen.getByText('Test Data')).toBeInTheDocument()
    })

    it('should support colSpan attribute', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell colSpan={2}>Spanned Cell</TableCell>
            </tr>
          </tbody>
        </table>
      )

      const td = screen.getByRole('cell')
      expect(td).toHaveAttribute('colSpan', '2')
    })

    it('should support rowSpan attribute', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell rowSpan={2}>Spanned Cell</TableCell>
            </tr>
          </tbody>
        </table>
      )

      const td = screen.getByRole('cell')
      expect(td).toHaveAttribute('rowSpan', '2')
    })
  })

  describe('TableCaption', () => {
    it('should render caption element', () => {
      const { container } = render(
        <table>
          <TableCaption>Table Caption</TableCaption>
        </table>
      )

      const caption = container.querySelector('caption')
      expect(caption).toBeInTheDocument()
      expect(caption).toHaveTextContent('Table Caption')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableCaption className="custom-caption">Caption</TableCaption>
        </table>
      )

      const caption = container.querySelector('caption')
      expect(caption).toHaveClass('custom-caption')
    })

    it('should have caption styling classes', () => {
      const { container } = render(
        <table>
          <TableCaption>Caption Text</TableCaption>
        </table>
      )

      const caption = container.querySelector('caption')
      expect(caption).toHaveClass('mt-4')
      expect(caption).toHaveClass('text-sm')
      expect(caption).toHaveClass('text-muted-foreground')
    })

    it('should accept children', () => {
      render(
        <table>
          <TableCaption>User List</TableCaption>
        </table>
      )

      expect(screen.getByText('User List')).toBeInTheDocument()
    })
  })

  describe('Complete Table Structure', () => {
    it('should render a complete table', () => {
      render(
        <Table>
          <TableCaption>A list of users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>jane@example.com</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>2 users total</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('A list of users')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('2 users total')).toBeInTheDocument()
    })

    it('should maintain semantic HTML structure', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )

      const table = container.querySelector('table')
      const thead = container.querySelector('thead')
      const tbody = container.querySelector('tbody')
      const tfoot = container.querySelector('tfoot')

      expect(table).toContainElement(thead)
      expect(table).toContainElement(tbody)
      expect(table).toContainElement(tfoot)
    })
  })

  describe('Accessibility', () => {
    it('should have accessible table role', () => {
      render(<Table />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('should have accessible column headers', () => {
      render(
        <table>
          <thead>
            <tr>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
            </tr>
          </thead>
        </table>
      )

      const headers = screen.getAllByRole('columnheader')
      expect(headers).toHaveLength(2)
    })

    it('should have accessible cells', () => {
      render(
        <table>
          <tbody>
            <tr>
              <TableCell>Data 1</TableCell>
              <TableCell>Data 2</TableCell>
            </tr>
          </tbody>
        </table>
      )

      const cells = screen.getAllByRole('cell')
      expect(cells).toHaveLength(2)
    })

    it('should support aria-label on table', () => {
      render(<Table aria-label="User data table" />)

      const table = screen.getByLabelText('User data table')
      expect(table).toBeInTheDocument()
    })
  })
})
