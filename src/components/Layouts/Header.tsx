const Header = () => {
  return (
    <header className="relative bg-linear-to-r from-orange-400 via-red-500 to-pink-500 shrink-0">
      <div className="absolute inset-0 bg-[url(/images.jpg)] bg-cover bg-center opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center py-6 sm:py-8 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2 text-center">
          🍳 Pantry Chef
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg drop-shadow-md text-center">
          Your Smart Kitchen Companion
        </p>
      </div>
    </header>
  );
};

export default Header;