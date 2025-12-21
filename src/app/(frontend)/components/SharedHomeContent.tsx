'use client'

import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'

export default function SharedHomeContent() {
    return (
        <>
            {/* Hero Section */}
            <section
                className="py-20 relative bg-gradient-to-br from-brand-primary to-brand-dark"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-white rounded-2xl p-8 max-w-3xl mx-auto mb-12 shadow-lg">
                        <div className="flex items-center justify-center">
                            <Image
                                src="/images/brand/logo.png"
                                alt="Meal PREPS Logo"
                                width={400}
                                height={160}
                                className="h-40 md:h-48 w-auto"
                            />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
                        Nutritious Meal Preps with Real Results
                    </h1>

                    <p className="text-xl text-white mb-12 max-w-4xl mx-auto leading-relaxed">
                        PR Meal Preps specializes in providing you the most delicious and perfectly portioned
                        meals. Our dietitian, Peggy, will ensure your tailored nutrient tier is precise for you
                        to help meet your goals. Whether you&apos;d like to work on managing your diabetes,
                        maintaining your gains, slimming down, or just being the healthiest version of yourself,
                        feel confident knowing you have an experienced registered dietitian managing your food
                        intake.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link
                            href="/order-now"
                            className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg flex items-center justify-center bg-brand-orange hover:bg-orange-600"
                        >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Build Your Plan
                        </Link>
                        <Link
                            href="/menu"
                            className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg border-2 border-white bg-transparent hover:bg-white/20"
                        >
                            View Menu
                        </Link>
                    </div>

                    <div className="flex justify-center space-x-8">
                        <div className="flex items-center text-white">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Locally Sourced</span>
                        </div>
                        <div className="flex items-center text-white">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Nutritionist Approved</span>
                        </div>
                        <div className="flex items-center text-white">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>Made Fresh Daily</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Expert Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:order-2 lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-brand-primary/10 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-w-sm mx-auto lg:max-w-none">
                                <Image
                                    src="/images/peggy.png"
                                    alt="Peggy Ramon-Rosales, MS, RD, LD"
                                    width={400}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                        <div className="lg:order-1 lg:w-1/2">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-sm mb-6">
                                Meet Our Dietitian
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Nutrition with a <br />
                                <span className="text-brand-primary">Personal Touch</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                                Peggy Ramon-Rosales is a Registered and Licensed Dietitian with a Master’s degree in Science and Human Sciences. She helps people find freedom from diets and chronic health conditions through the power of real food.
                            </p>
                            <blockquote className="border-l-4 border-brand-primary pl-4 italic text-gray-600 my-8">
                                "I want to inspire & motivate you to transform your health by using the Power of Food. You deserve to know how to feed your body right to wake-up each morning with a healthy spring in your step."
                            </blockquote>
                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg bg-white text-gray-900 border-2 border-gray-100 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5"
                            >
                                Read Full Bio
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Conditions We Treat Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Conditions We Treat</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our registered dietitians help you create a personalized meal plan that fits your lifestyle to manage and improve various health conditions.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[
                            'Weight Loss & Maintenance', 'Diabetes', 'Kidney Disease', 'Gastrointestinal Disorders',
                            'Pre Natal/ Post Natal', 'Sports Nutrition', 'Food Intolerances', 'Pediatric Weight Loss',
                            'Thyroid Disorders', 'Eating Disorders', 'Low Energy & Fatigue', 'Anxiety & Depression'
                        ].map((condition) => (
                            <div key={condition} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
                                <div className="w-2 h-2 bg-brand-primary rounded-full mr-3 flex-shrink-0"></div>
                                <span className="font-medium text-gray-900">{condition}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fit 3D Body Scan Section */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-brand-primary/10 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                <Image
                                    src="/images/fit3D/fit3d-proscanner-02.gif"
                                    alt="Fit3D ProScanner Demonstration"
                                    width={600}
                                    height={600}
                                    className="w-full h-auto object-cover"
                                    unoptimized // Required for GIFs to animate if not using an external loader that supports it
                                />
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-sm mb-6">
                                Visual Transformation Technology
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                See Your Progress <br />
                                <span className="text-brand-primary">Like Never Before</span>
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Stop guessing and start seeing real results. Our state-of-the-art Fit3D ProScanner
                                captures a precise 360° model of your body in just 40 seconds.
                            </p>

                            <ul className="space-y-4 mb-10">
                                <li className="flex items-center text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-brand-primary">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    Track muscle gain and fat loss accurately
                                </li>
                                <li className="flex items-center text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-brand-primary">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    Visualize body shape changes over time
                                </li>
                                <li className="flex items-center text-gray-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 text-brand-primary">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </div>
                                    Improve posture and balance
                                </li>
                            </ul>

                            <Link
                                href="/fit3d"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg bg-brand-primary text-white hover:bg-brand-dark hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Discover Fit3D
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse Our Meal Plans Button */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link
                        href="/menu"
                        className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg inline-block bg-brand-primary hover:bg-brand-dark"
                    >
                        Browse Our Meal Plans
                    </Link>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
                        <p className="text-xl text-gray-600">
                            Simple, flexible, and designed around your life.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="relative inline-block mb-6">
                                <div
                                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold bg-brand-primary"
                                >
                                    1
                                </div>
                                <div
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-brand-orange"
                                >
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Your Plan</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Answer a few quick questions about your goals. Choose your tier, frequency, and
                                add-ons.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="relative inline-block mb-6">
                                <div
                                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold bg-brand-primary"
                                >
                                    2
                                </div>
                                <div
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-brand-orange"
                                >
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pick Your Meals</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Browse our weekly menu and select your favorites. We accommodate all dietary needs.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="relative inline-block mb-6">
                                <div
                                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold bg-brand-primary"
                                >
                                    3
                                </div>
                                <div
                                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-brand-orange"
                                >
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Enjoy Fresh Meals</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Pick up your meals twice weekly. Freshly made, perfectly portioned, ready to heat
                                and eat.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">More Than Just Meal Prep</h2>
                        <p className="text-xl text-gray-600">
                            Comprehensive nutrition services to support your entire organization or personal journey.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-brand-primary mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Private Counseling</h3>
                            <p className="text-gray-600 mb-4">
                                One-on-one sessions to go over your complete medical, nutrition, and lifestyle history. Receive expert education, meal plans, and portion control guides.
                            </p>
                            <Link href="/about" className="text-brand-primary font-medium hover:underline">Learn more &rarr;</Link>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-brand-primary mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Business Consulting</h3>
                            <p className="text-gray-600 mb-4">
                                Corporate seminars, nutrition talks, and weight loss challenges designed for your employees. Available for big or small corporations.
                            </p>
                            <Link href="/about" className="text-brand-primary font-medium hover:underline">Learn more &rarr;</Link>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-brand-primary mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Menu Analysis</h3>
                            <p className="text-gray-600 mb-4">
                                Nutritional analysis and menu building for restaurants, day cares, and food service facilities. Calculation of calories, macros, and allergen flagging.
                            </p>
                            <Link href="/about" className="text-brand-primary font-medium hover:underline">Learn more &rarr;</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Flexible Plans for Your Lifestyle Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Flexible Plans for Your Lifestyle
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Everything you need to succeed on your health journey.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-primary/10"
                                >
                                    <svg
                                        className="w-6 h-6 text-brand-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Monthly Plans with Credits
                                    </h3>
                                    <p className="text-gray-600">
                                        Pay monthly, allocate credits across weeks. Skip one week per month and keep
                                        your credits.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-primary/10"
                                >
                                    <svg
                                        className="w-6 h-6 text-brand-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Dietary Accommodations
                                    </h3>
                                    <p className="text-gray-600">
                                        Set your allergies and dietary restrictions. We&apos;ll flag them on every order and
                                        customize accordingly.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-primary/10"
                                >
                                    <svg
                                        className="w-6 h-6 text-brand-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Extras Anytime</h3>
                                    <p className="text-gray-600">
                                        Go beyond your meal limit - extra meals, snacks, and add-ons available for
                                        additional cost.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-primary/10"
                                >
                                    <svg
                                        className="w-6 h-6 text-brand-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l5-10A1 1 0 0019 1H3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">A La Carte Available</h3>
                                    <p className="text-gray-600">
                                        No commitment needed - order individual meals whenever you want. Perfect for
                                        trying us out!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insurance Coverage Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Insurance Coverage</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                        Your health insurance may pay for your visits! We are an "In-Network" Preferred Provider with major carriers.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
                        {['BCBS', 'UHC', 'CIGNA', 'MEDICAID', 'AMBETTER', 'MEDICARE'].map((provider) => (
                            <div key={provider} className="text-2xl font-bold text-gray-400 border-2 border-gray-200 rounded-xl px-6 py-3 select-none">
                                {provider}
                            </div>
                        ))}
                    </div>
                    <div className="mt-12">
                        <Link href="/about" className="text-brand-primary font-medium hover:underline text-lg">
                            See full list of covered employers &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </>
    )
}
