const NoPage = () => {
  return (
    <div className="min-h-[100vh] bg-gray-100 flex flex-col text-center py-32">
      <span className="text-[#FF6000] text-xl font-bold">404</span>
      <span className="text-5xl font-black py-2">Page not found</span>
      <span className="text-lg text-[#454545]">
        Sorry! We couldn&apos;t find the page you&apos;re looking for.
      </span>
    </div>
  );
};

export default NoPage;
