const FooterLion = () => {
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    return (
        <footer className="text-gray-600 body-font bg-[#454545] mt-5">
            <div className="container mx-auto py-4 px-14 flex flex-wrap flex-col">
                <p className="text-[#FFE6C7] text-sm text-center">
                    © {getCurrentYear()} DIY Blog —
                    <a
                        href="mailto:ndabagajeanlionel@gmail.com"
                        className="text-[#FFA559] ml-1"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        @lionel
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default FooterLion