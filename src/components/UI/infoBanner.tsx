"use client";
const InfoBanner = () => {
  return (
    <div
      className="relative bg-yellow-200 border border-yellow-400 text-gray-800 p-6 w-full max-w-xs h-auto shadow-lg rounded transform rotate-2 m-6"
      aria-labelledby="info-banner-heading">
      <div
        className="absolute top-0 left-0 w-full h-full bg-yellow-100 transform rotate-1 -z-10"
        aria-hidden="true"
      />
      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        TEMPORARY NOTE
      </div>
      <h3 id="info-banner-heading" className="font-bold text-lg mb-2">
        Login Instructions
      </h3>
      <p className="text-sm">
        <strong>Admin:</strong>
        <br />
        Email: admin@gmail.com
        <br />
        Password: 123456789
      </p>
      <p className="text-sm mt-4">
        <strong>User:</strong>
        <br />
        Email: user1@gmail.com
        <br />
        Password: 123456789
      </p>
      <p className="text-sm mt-4">
        <strong>User:</strong>
        <br />
        Email: user3@gmail.com
        <br />
        Password: 123456789
      </p>
    </div>
  );
};

export default InfoBanner;
