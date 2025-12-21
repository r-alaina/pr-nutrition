import React from 'react'
import Footer from '@/components/Footer'

export default function Contact() {
    return (
        <div className="min-h-screen bg-white">
            <main className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-600">We&apos;d love to hear from you!</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h3>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    <strong className="block text-gray-900">Address:</strong>
                                    8025 North 10th Street Ste 160<br />
                                    McAllen, Texas 78504
                                </p>
                                <p>
                                    <strong className="block text-gray-900">Phone:</strong>
                                    <a href="tel:9564242274" className="text-brand-primary hover:underline">(956) 424-2274</a>
                                </p>
                                <p>
                                    <strong className="block text-gray-900">Email:</strong>
                                    <a href="mailto:Info@prdietitian.com" className="text-brand-primary hover:underline">Info@prdietitian.com</a>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Hours</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
                                <div>Mon</div><div>10:00 am – 06:00 pm</div>
                                <div>Tue</div><div>10:00 am – 06:00 pm</div>
                                <div>Wed</div><div>10:00 am – 06:00 pm</div>
                                <div>Thu</div><div>10:00 am – 06:00 pm</div>
                                <div>Fri</div><div>10:00 am – 05:00 pm</div>
                                <div>Sat</div><div>By Appointment</div>
                                <div>Sun</div><div>03:00 pm – 06:00 pm</div>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 italic">
                                Closed major holidays! Open Sundays for meal prep pick up only from 3-6pm.
                            </p>
                        </div>
                    </div>

                    <div className="h-96 bg-gray-200 rounded-lg overflow-hidden relative">
                        {/* Google Maps Embed */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.6424783324675!2d-98.23696562458421!3d26.338304977011116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665a3d066347109%3A0xacc6718a38148b5!2s8025%20N%2010th%20St%20STE%20160%2C%20McAllen%2C%20TX%2078504!5e0!3m2!1sen!2sus!4v1703180000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
