const Loader = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="animate-spin h-8 w-8 border-2 border-brand-600 border-t-transparent rounded-full" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-12">{spinner}</div>;
};

export default Loader;
