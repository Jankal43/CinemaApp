export default function ArrowButton({
                                        onClick,
                                        direction,
                                    }: {
    onClick?: () => void;
    direction?: 'left' | 'right';
}) {
    return (
        <button
            className={`absolute ${
                direction === 'left'
                    ? 'left-0 -translate-x-12'
                    : 'right-0 translate-x-12'
            } top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center`}
            aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
            onClick={onClick}
        >
            <div
                className={`arrow ${direction} border-white hover:border-gray-300 transition-colors`}
            ></div>
        </button>
    );
}
