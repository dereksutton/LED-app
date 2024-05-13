import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center px-4">
                <p>&copy; {new Date().getFullYear()} Local Painting Co. All rights reserved.</p>
                <ul className="flex justify-center space-x-4 mt-4">
                    <li><a href="https://www.facebook.com/" className="hover:text-gray-400">Facebook</a></li>
                    <li><a href="https://www.instagram.com/" className="hover:text-gray-400">Instagram</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;