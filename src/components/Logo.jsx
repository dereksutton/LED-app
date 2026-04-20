"use client";

import { motion } from 'framer-motion';

const Logo = () => {
    return (
        <motion.img
            src="/images/LED-logo.png"
            alt="LED Custom Painting Logo"
            className="h-64 lg:h-80"
            initial={{ x: '-100vw' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 30 }}
        />
    );
};

export default Logo;
