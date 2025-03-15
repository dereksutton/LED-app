import React from 'react';
import FacebookIcon from '../assets/facebook_icon.png';
import InstagramIcon from '../assets/instagram_icon.png';

const Footer = () => {
    return (
        <footer className="bg-slate-500 text-white py-4">
            <div className="container mx-auto text-center px-4">
                <p className="poppins-semibold brand-gold text-3xl">Follow Us On Social Media!</p>
                    <ul className="flex justify-center space-x-12 mt-4">
                        <li>
                            <a href="https://www.facebook.com/ledcustompainting?mibextid=kFxxJD" className="hover:text-gray-400">
                                <img src={FacebookIcon} alt="Facebook Icon" className="w-16 h-16 inline-block" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/led_custom_painting?igsh=MXMxczJ2NXp3anAxdA==" className="hover:text-gray-400">
                            <img src={InstagramIcon} alt="Instagram Icon" className="w-16 h-16 inline-block" />
                            </a>
                        </li>
                    </ul>
                <p className="poppins-regular brand-gold text-2xl mt-10">&copy; {new Date().getFullYear()} LED Custom Painting & More. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;