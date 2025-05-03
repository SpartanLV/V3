import React, { useContext } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css'; // Custom styles for Sidebar (create this file)

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  let links = [];

  if (user?.role === 'admin') {
    links = [
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/courses', label: 'Courses' },
      { path: '/admin/bookings', label: 'Bookings' },
      { path: '/admin/notifications', label: 'Send Notification' },
      { path: '/admin/reports', label: 'Reports' },
      { path: '/messages', label: 'Messages', icon: '✉️' },
      { path: '/chat/:recipientId', label: 'Chat', icon: '💬' },
      { path: '/courses', label: 'Browse Courses', icon: '📚' }, // Added Browse Courses link
    ];
  } else if (user?.role === 'faculty') {
    links = [
      { path: '/faculty/dashboard', label: 'Dashboard' },
      { path: '/faculty/profile', label: 'Profile' },
      { path: '/payment', label: 'Make Payment', icon: '💳' },
      { path: '/messages', label: 'Messages', icon: '✉️' },
      { path: '/chat/:recipientId', label: 'Chat', icon: '💬' },
      { path: '/courses', label: 'Browse Courses', icon: '📚' }, // Added Browse Courses link
    ];
  } else if (user?.role === 'student') {
    links = [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/student/profile', label: 'Profile' },
      { path: '/payment', label: 'Make Payment', icon: '💳' },
      { path: '/messages', label: 'Messages', icon: '✉️' },
      { path: '/chat/:recipientId', label: 'Chat', icon: '💬' },
      { path: '/student/courses', label: 'My Courses', icon: '📖' } ,
    ];
  }

  return (
    <Nav className="flex-column sidebar bg-light vh-100 p-3" style={{ width: 220 }}>
      {links.map(({ path, label, icon }) => (
        <Nav.Item key={path} className="mb-2">
          <Nav.Link
            as={Link}
            to={path}
            active={pathname === path || pathname.startsWith(path + '/')}
            className="sidebar-link"
          >
            {icon && <span className="me-2">{icon}</span>}
            {label}
          </Nav.Link>
        </Nav.Item>
      ))}

      <hr />

      {/* External Link */}
      <Nav.Item className="mb-2">
        <a
          href="https://library.bracu.ac.bd/"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar-link"
        >
          📚 Library Services
        </a>
      </Nav.Item>

      {/* Beautified Accordion */}
      <Accordion defaultActiveKey={null} alwaysOpen className="sidebar-accordion">
        <Accordion.Item eventKey="0" className="accordion-item-custom">
          <Accordion.Header className="accordion-header-custom">🎉 Clubs</Accordion.Header>
          <Accordion.Body className="accordion-body-custom">
            <Nav className="flex-column">
              <Nav.Item>
                <a
                  href="https://bracurobu.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-sublink"
                >
                  🏫 Clubs Services
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  href="https://www.bracucc.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-sublink"
                >
                  💻 Computer Club
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fbizbee.official%3Ffbclid%3DIwZXh0bgNhZW0CMTAAAR6c6Kif5VXapK2eEYqj0Ns6amo_3hQnCaojJaKC-kTQra34H34lOVEt85YMkQ_aem_VyfPEhkLiTzS-kmsvDzsjA&h=AT3qgZaCF99lzXjcNYJdsoY4CptYAjaywOG5ai2DrOxwtpoLQHPWBz6PDciC7uXzyi16doHtYZamkwcEc3_jrX7rhE4hhsciYF7uhOHf4PQ3IjBHMvBOOsolYvpwieHEo04D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-sublink"
                >
                  📈 Business Club
                </a>
              </Nav.Item>
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Nav>
  );
}
