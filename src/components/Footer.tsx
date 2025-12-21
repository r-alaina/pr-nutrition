import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="bg-brand-dark text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center mb-4">
                            <Image
                                src="/images/brand/logo.png"
                                alt="Meal PREPS Logo"
                                width={200}
                                height={64}
                                className="h-16 w-auto"
                            />
                        </div>
                        <p className="text-gray-300 text-sm">
                            Nutritious meal preps crafted by Registered Dietitian Peggy Ramon-Rosales, MS, RD, LD
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                            <p>8025 North 10th Street Ste 160</p>
                            <p>McAllen, Texas 78504</p>
                            <p>
                                <a href="tel:9564242274" className="hover:text-white transition-colors">
                                    (956) 424-2274
                                </a>
                            </p>
                            <p>
                                <a href="mailto:Info@prdietitian.com" className="hover:text-white transition-colors">
                                    Info@prdietitian.com
                                </a>
                            </p>
                            <div className="flex space-x-4 mt-4">
                                <a href="https://www.facebook.com/Peggydietitian" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    Facebook
                                </a>
                                <a href="https://www.instagram.com/Prnutritionconsulting" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <div className="space-y-2">
                            <Link
                                href="/"
                                className="block text-gray-300 transition-colors hover:text-white"
                            >
                                Home
                            </Link>
                            <Link
                                href="/menu"
                                className="block text-gray-300 transition-colors hover:text-white"
                            >
                                Menu
                            </Link>
                            <Link
                                href="/order-now"
                                className="block text-gray-300 transition-colors hover:text-white"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/about"
                                className="block text-gray-300 transition-colors hover:text-white"
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="block text-gray-300 transition-colors hover:text-white"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()}, PR Nutrition Consulting & PR Meal PReps. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
