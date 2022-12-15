import Menu from 'assets/svgs/menu.svg';
import { FC, useState } from 'react';
import useMedia from 'use-media';
import Logo from '../../assets/svgs/bunzz-logo.svg';
import LeftArrow from '../../assets/svgs/left-arrow.svg';
import './Header.css';

const links = [
  {
    name: 'ABOUT',
    href: '#about',
  },
  {
    name: 'MINT',
    href: '#mint',
  },
  {
    name: 'ROADMAP',
    href: '#roadmap',
  },
  {
    name: 'TEAM',
    href: '#team',
  },
  {
    name: 'FAQ',
    href: '#faq',
  },
];

export const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isLarge = useMedia({ minWidth: '1024px' });

  return (
    <>
      {isOpen && <MobileMenuList setIsOpen={setIsOpen} />}
      <header className="header">
        <img src={Logo} alt="logo" />

        {isLarge ? (
          <nav className="menu-list">
            {links.map((link) => (
              <a key={link.name} href={link.href} className="menu-list-item">
                {link.name}
              </a>
            ))}
          </nav>
        ) : (
          <button className="menu-button" onClick={() => setIsOpen(true)}>
            <img src={Menu} alt="logo" />
          </button>
        )}
      </header>
    </>
  );
};

type MobileMenuListProps = {
  setIsOpen: (isOpen: boolean) => void;
};

const MobileMenuList: FC<MobileMenuListProps> = ({ setIsOpen }) => {
  return (
    <div className="mobile-menu-wrapper">
      <button
        className="menu-button back-button"
        onClick={() => setIsOpen(false)}
      >
        <img src={LeftArrow} alt="logo" />
      </button>

      <div className="mobile-menu-list">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>

        <div className="menu-list-items">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="menu-list-item"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
