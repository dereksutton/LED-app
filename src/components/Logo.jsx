const Logo = () => {
    return (
        <img
            src="/images/LED-logo-640.webp"
            srcSet="/images/LED-logo-320.webp 320w, /images/LED-logo-640.webp 640w"
            sizes="(min-width: 1024px) 320px, 256px"
            alt="LED Custom Painting Logo"
            width="320"
            height="320"
            className="h-64 w-64 lg:h-80 lg:w-80"
        />
    );
};

export default Logo;
