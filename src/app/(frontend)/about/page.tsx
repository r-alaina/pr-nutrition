import React from 'react'
import Image from 'next/image'
import Footer from '@/components/Footer'

export default function About() {
    return (
        <div className="min-h-screen bg-white">
            <main className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">About PR Nutrition Consulting & PR Meal PReps</h1>

                    {/* Philosophy Section */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold text-brand-primary mb-4">Our Philosophy</h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="mb-4">
                                At PR Nutrition Consulting & PR Meal PReps, we believe that health is not just the absence of disease, but a state of complete physical, mental, and social well-being. We strive to promote this holistic approach to health by one on one nutritional consulting with one of our expert Registered and Licensed Dietitians.
                            </p>
                            <p>
                                My Food and Nutrition Philosophy is simple: Wholesome and nourishing foods are magic. The right foods have the power to improve all the cells in your body to help you look healthy and feel strong and alive.
                            </p>
                        </div>
                    </section>

                    {/* Dietitian Section */}
                    <section className="mb-16 grid md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-1 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                            <Image
                                src="/images/peggy.png"
                                alt="Peggy Ramon-Rosales, MS, RD, LD"
                                width={400}
                                height={500}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-semibold text-brand-primary mb-4">MEET THE DIETITIANS</h2>
                            <div className="prose prose-lg text-gray-600">
                                <p className="mb-4">
                                    Peggy is a Registered and Licensed Dietitian with a Master’s degree in Science and Human Sciences from Texas A&M University-Kingsville and holds a Bachelor’s degree in Family and Consumer Sciences with a concentration in nutrition from Texas State University. She completed her internship at Texas A&M University-Kingsville and trained with highly specialized physicians and dietitians in the area of diabetes, kidney disease and weight management. Peggy helps people find freedom from diets and chronic health conditions through the power of real food.
                                </p>
                                <p className="mb-4">
                                    Peggy is affiliated with Academy of Nutrition and Dietetics and Board for Diabetes Educators and a member of Diabetes Care in Education.
                                </p>
                                <p>
                                    “I want to inspire & motivate you to transform your health by using the Power of Food. You deserve to know how to feed your body right to wake-up each morning with a healthy spring in your step.” - Peggy
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conditions We Treat */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold text-brand-primary mb-6">Conditions We Treat</h2>
                        <div className="bg-green-50 rounded-2xl p-8">
                            <p className="text-gray-700 mb-6">
                                Mrs. Rosales works with a diverse group of clients and specializes in the following areas:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-gray-700 font-medium">
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Weight Loss & Maintenance</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Diabetes</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Kidney Disease (CKD non-dialysis, ESRD on dialysis)</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Gastrointestinal Disorders (IBS, IBD, gastritis)</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Pre Natal/ Post Natal</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Sports nutrition</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Food intolerances/allergies</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Pediatric weight loss</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Thyroid disorders</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Eating Disorders</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Low Energy & Fatigue</div>
                                <div className="flex items-center"><span className="w-2 h-2 bg-brand-primary rounded-full mr-3"></span>Anxiety & Depression</div>
                            </div>
                        </div>
                    </section>

                    {/* What We Do / Services */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold text-brand-primary mb-6">What We Do</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Private Nutrition Counseling</h3>
                                <p className="text-gray-600 mb-2">
                                    <strong>Initial Visit:</strong> During this session we will go over your complete medical, nutrition, weight and lifestyle history. By the end of the visit you will leave with expert nutrition education, meal plan, portion control booklet to help make healthy substitutions, and a sample menu. If needed, you will also receive a general exercise plan, advice on supplements and referrals for other testing.
                                </p>
                                <p className="text-gray-600">
                                    <strong>Follow-Up Visits:</strong> These visits are essential to guarantee success, monitor progress (weights, body fat, etc.), review food records, modify meal plans as needed or answer any questions. Sessions are available privately in person or on the phone.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Business Nutrition Consulting</h3>
                                <p className="text-gray-600">
                                    Corporate Seminars are 30 minute nutrition talks provided during lunch hours or any time of day for big or small corporations. Seminar topics are modified to fit each type of business environment and employee’s needs. Corporate weight loss challenges can also be provided to increase participation and effectiveness.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Menu Building & Analysis</h3>
                                <p className="text-gray-600">
                                    Restaurant Menu Building, Home Health/Day Care & Nutritional Analysis can be offered for any type of food service facility. Nutrition analysis includes calculation of calories, fat, carbohydrates and protein of each food item. Specific Meal Plans can be designed using menu items and labeled as “Weight Loss”, “Diabetes Friendly”, “Gluten-Free” or “Muscle-Building” meal plans.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Insurance Coverage */}
                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold text-brand-primary mb-6">Insurance Coverage</h2>
                        <div className="prose prose-lg text-gray-600">
                            <p className="mb-4">
                                Did you know that your health insurance may pay for you to see a dietitian? You may have limited visits per year or unlimited visits up to your maximum medical nutrition therapy or prevention and wellness benefit limit.
                            </p>
                            <p className="mb-4">
                                A referral from your doctor may be needed; however, most health insurance plans do not require a referral when you see a provider who is “In-Network.” All Medicare and Medicaid patients need to have referral prior to their appointment.
                            </p>

                            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">We’re an “In Network” Preferred Provider with:</h3>
                            <ul className="list-disc pl-5 space-y-1 mb-6">
                                <li>BCBS</li>
                                <li>UHC</li>
                                <li>CIGNA</li>
                                <li>MEDICAID (Superior, Driscoll)</li>
                                <li>Ambetter</li>
                                <li>Medicare (covers diabetes and renal disease only)</li>
                            </ul>

                            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3">Covered Employers Include:</h3>
                            <ul className="grid md:grid-cols-2 gap-2 text-sm">
                                <li>Spikes Ford</li>
                                <li>HEB (6 visits per year, no copay)</li>
                                <li>Bert Ogden</li>
                                <li>McAllen/Mission/La Joya CISD</li>
                                <li>Edinburg CISD (diabetes only, with copay)</li>
                                <li>Hidalgo County Irrigation</li>
                                <li>GE Capital Electric</li>
                                <li>US Border Patrol</li>
                                <li>US Postal Service</li>
                                <li>Walmart</li>
                            </ul>

                            <p className="mt-8 text-sm italic">
                                * Coverage for dietitians varies between plans. Please check with your insurance carrier or with our office for coverage details prior to making an appointment. Plans do update without notice yearly.
                            </p>
                        </div>
                    </section>

                </div>
            </main>
            <Footer />
        </div>
    )
}
