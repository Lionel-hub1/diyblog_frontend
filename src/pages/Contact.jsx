const Contact = () => {
  return (
    <div className="min-h-[100vh] bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Lionel</h1>
      <form className="max-w-md mx-auto" action="https://getform.io/f/lajkokqb" method="POST">
        <div className="mb-4 mx-4 sm:mx-0 hidden">
          <label htmlFor="source" className="block mb-2 font-medium text-gray-700">Source:</label>
          <input type="text" id="source" name="source" value={"This email is from DIY Blog"} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FFA559] focus:border-[#FFA559]" />
        </div>
        <div className="mb-4 mx-4 sm:mx-0">
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">Name:</label>
          <input type="text" id="name" name="name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FFA559] focus:border-[#FFA559]" />
        </div>

        <div className="mb-4 mx-4 sm:mx-0">
          <label htmlFor="email" className="block mb-2 font-medium text-gray-700">Email:</label>
          <input type="email" id="email" name="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FFA559] focus:border-[#FFA559]" />
        </div>

        <div className="mb-4 mx-4 sm:mx-0">
          <label htmlFor="message" className="block mb-2 font-medium text-gray-700">Message:</label>
          <textarea id="message" name="message" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#FFA559] focus:border-[#FFA559]"></textarea>
        </div>

        <div className="w-full px-4 sm:px-0">
          <button type="submit" className="w-full font-black bg-[#FFA559] text-white py-2 px-4 rounded-md hover:bg-[#d6894a]">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
