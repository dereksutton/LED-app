import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-700 text-white py-4">
            <div className="container mx-auto text-center px-4">
                <p className="poppins-regular brand-gold">&copy; {new Date().getFullYear()} LED Custom Painting & More. All rights reserved.</p>
                <ul className="flex justify-center space-x-4 mt-4">
                    <li><a href="https://www.facebook.com/" className="hover:text-gray-400">Facebook</a></li>
                    <li><a href="https://www.instagram.com/" className="hover:text-gray-400">Instagram</a></li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;