import { Link } from "react-router-dom";

const Services = () => {
    const services = [
        {
            title: "DIY Project Planning",
            description: "Get personalized project plans tailored to your space, skills, and budget. We'll help you break down complex projects into manageable steps.",
            icon: "📋",
        },
        {
            title: "Material Selection",
            description: "Expert guidance on choosing the right materials for your project, balancing quality, cost, and sustainability.",
            icon: "🧰",
        },
        {
            title: "Video Tutorials",
            description: "Step-by-step video guides for various DIY projects, from basic repairs to advanced home renovations.",
            icon: "🎥",
        },
        {
            title: "Tool Recommendations",
            description: "Honest reviews and recommendations for DIY tools at every price point, helping you make informed purchases.",
            icon: "🔨",
        },
        {
            title: "Online Consultations",
            description: "Book a virtual session with our DIY experts to troubleshoot problems or get project advice in real-time.",
            icon: "💻",
        },
        {
            title: "DIY Community",
            description: "Join our community of DIY enthusiasts to share projects, get feedback, and connect with like-minded makers.",
            icon: "👥",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#454545] to-[#333333] py-16 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#FFE6C7] mb-4">
                        Our DIY Services
                    </h1>
                    <p className="text-lg text-[#FFE6C7]/80 max-w-3xl mx-auto">
                        We offer a range of services to help you succeed in your DIY projects, whether you're a beginner or experienced creator.
                    </p>
                    <Link to="/contact" className="mt-6 inline-block bg-[#FFA559] hover:bg-[#ff9233] font-bold text-white px-6 py-3 rounded-md shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-b-4 border-[#FFA559]"
                        >
                            <div className="text-4xl mb-4">{service.icon}</div>
                            <h3 className="text-xl font-bold text-[#454545] mb-3">{service.title}</h3>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                            <Link
                                to="/contact"
                                className="text-[#FFA559] font-medium inline-flex items-center hover:text-[#ff9233] transition-colors"
                            >
                                Learn more
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-[#454545] py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#FFE6C7] mb-4">
                        Ready to Start Your Next DIY Project?
                    </h2>
                    <p className="text-[#FFE6C7]/80 mb-6 max-w-2xl mx-auto">
                        Contact us today to discuss your ideas and how we can help bring your vision to life.
                    </p>
                    <Link to="/contact" className="bg-[#FFA559] hover:bg-[#ff9233] font-bold text-white px-6 py-3 rounded-md shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Services;