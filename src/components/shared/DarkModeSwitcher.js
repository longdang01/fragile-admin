const DarkModeSwitcher = () => {
  return (
    <>
      <div
        data-url="http://icewall.left4code.com/page/side-menu/dark/dashboard-overview-1"
        className="dark-mode-switcher cursor-pointer shadow-md fixed bottom-0 right-0 box border rounded-full w-40 h-12 flex items-center justify-center z-50 mb-10 mr-10"
      >
        <div className="mr-4 text-slate-600 dark:text-slate-200">Dark Mode</div>
        <div className="dark-mode-switcher__toggle border"></div>
      </div>
    </>
  );
};

export default DarkModeSwitcher;
