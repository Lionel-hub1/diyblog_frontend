import { useState } from "react";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    setEmail("");
  };
  return (
    <div className="flex flex-col ml-24 xl:ml-0 mr-24 mb-16 xl:max-w-[20rem] xl:mt-16 ">
      <div className="uppercase mb-10 border-b-[2px] text-[#454545] font-semibold">
        SUbscribe to our newsletter
      </div>
      <p className="mb-4">
        Subscribe for DIY tutorials, home decor inspiration and more in your
        inbox...
      </p>
      <form className="flex flex-row space-x-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="border-2 p-2 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-[#FF6000] text-white p-2">Subscribe</button>
      </form>
    </div>
  );
};

export default Subscribe;
