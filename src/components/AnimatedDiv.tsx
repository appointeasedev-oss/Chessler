import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface AnimatedDivProps {
    children: ReactNode;
    className?: string;
    delay?: number; // delay in ms
}

const AnimatedDiv: FC<AnimatedDivProps> = ({ children, className, delay = 0 }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: delay / 1000 }} // convert ms to s
        >
            {children}
        </motion.div>
    );
};

export default AnimatedDiv;
