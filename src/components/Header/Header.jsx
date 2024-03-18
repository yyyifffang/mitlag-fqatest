'use client'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavItem from 'react-bootstrap/NavItem'
import NavLink from 'react-bootstrap/NavLink'
import Dropdown from 'react-bootstrap/Dropdown'
import Link from 'next/link'

const style = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  minHeight: "65px",
}

export default function Header() {
  return (
    <Navbar expand="md" className="navbar-dark bg-dark" style={style}>
      <Container>
        <Navbar.Brand as={Link} href="/">MIT Lab</Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse>
          <Nav>
            <Nav.Link as={Link} href="/jsleu">關於教授</Nav.Link>
            <Nav.Link as={Link} href="/articles?tag=research-area">研究方向</Nav.Link>
            <Dropdown as={NavItem}>
              <Dropdown.Toggle as={NavLink}>實驗室</Dropdown.Toggle>
              <Dropdown.Menu variant="dark">
                <Dropdown.Item as={Link} href="/members">成員</Dropdown.Item>
                <Dropdown.Item as={Link} href="/articles?tag=life-records">生活紀錄</Dropdown.Item>
                <Dropdown.Item as={Link} href="/award">特殊榮譽</Dropdown.Item>
                <Dropdown.Item as={Link} href="/publications">論文/專題</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link as={Link} href="/contact">聯絡我們</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
