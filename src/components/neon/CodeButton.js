import { Code } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ref, onValue, set, get } from 'firebase/database';
import { db } from '../../config/firebase.config';

export default function CodeButton() {
    const [isHovered, setIsHovered] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const buttonId = 'devsaura-github-code-button';

    useEffect(() => {
        const userClicked = localStorage.getItem(`userClicked_${buttonId}`) === 'true';
        setHasClicked(userClicked);

        const clicksRef = ref(db, `buttonClicks/${buttonId}`);
        const unsubscribe = onValue(clicksRef, (snapshot) => {
            const data = snapshot.val();
            setClickCount(data || 0);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleClick = async () => {
        if (!hasClicked && !isLoading) {
            try {
                const clicksRef = ref(db, `buttonClicks/${buttonId}`);
                const snapshot = await get(clicksRef);
                const currentClicks = snapshot.val() || 0;

                await set(clicksRef, currentClicks + 1);
                localStorage.setItem(`userClicked_${buttonId}`, 'true');
                setHasClicked(true);
            } catch (error) {
                console.error('Error updating click count:', error);
            }
        }
        window.open('https://github.com/saadaryf/devsaura', '_blank');
    };

    const buttonStyle = {
        position: 'fixed',
        bottom: '0.5rem',
        right: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border: '0',
        color: !isHovered ? 'rgba(223, 246, 250, 0.54)' : 'rgb(0, 217, 255)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        boxShadow: isHovered ? '0 0 15px rgba(34, 211, 238, 0.5)' : 'none',
        fontFamily: 'monospace',
        fontSize: '14px',
        outline: 'none',
        zIndex: 5
    };

    const iconStyle = {
        stroke: isHovered && 'rgb(0, 217, 255)',
    };

    const countStyle = {
        fontSize: '16px',
        opacity: 0.8,
        marginLeft: '4px',
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={buttonStyle}
        >
            <span style={countStyle}>
                {isLoading ? '...' : clickCount}
            </span>
            <Code
                size={20}
                style={iconStyle}
            />
            <span>Code</span>
        </button>
    );
}