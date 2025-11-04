import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/LED-logo.png';

const Logo = () => {
    return (
        <motion.img
            src={logo}
            alt="LED Custom Painting Logo"
            className="h-64 lg:h-80"
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 30 }}
        />
    );
};

export default Logo;