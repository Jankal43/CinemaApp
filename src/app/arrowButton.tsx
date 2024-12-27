export default function ArrowButton({
                                        onClick,
                                        className,
                                        direction,
                                    }: {
    onClick?: () => void;
    className?: string;
    direction?: 'left' | 'right';
}) {
    return (
        <button
            className={className}
            aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
            onClick={onClick}
        >
            <div
                className={`arrow ${direction} border-white hover:border-gray-300 transition-colors`}
            ></div>
        </button>
    );
}
