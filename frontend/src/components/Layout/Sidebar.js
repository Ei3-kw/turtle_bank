// src/components/Layout/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <nav className="w-64 bg-background-paper shadow-lg">
            <ul className="py-4">
                {['Dashboard', 'Goals', 'Analysis'].map((item) => (
                    <li key={item}>
                        <Link
                            to={item === 'Dashboard' ? '/' : `/${item.toLowerCase()}`}
                            className="block px-4 py-2 text-text-primary hover:bg-primary-light hover:text-background-paper"
                        >
                            {item}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Sidebar;