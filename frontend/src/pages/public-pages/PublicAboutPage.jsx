import React from 'react';
import { Phone, Mail, MapPin, Globe, FileText, Clock, Users } from 'lucide-react';

const PublicAboutPage = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* About Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">About Customer Management System</h1>
            </div>
            
            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Company</h2>
                <p className="text-gray-600 mb-6 text-justify">
                    CustomerCRM was founded in 2020 with a mission to simplify customer relationship management for businesses of all sizes. 
                    Our team of experienced professionals is dedicated to providing an exceptional customer management experience 
                    through innovative technology and outstanding support.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="flex items-start">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium text-gray-800">Location</h3>
                            <p className="text-gray-600">Dap - Dap Legazpi CIty </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium text-gray-800">Phone</h3>
                            <p className="text-gray-600">(555) 123-4567</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium text-gray-800">Email</h3>
                            <p className="text-gray-600">cms@gmail.com</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Globe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium text-gray-800">Website</h3>
                            <p className="text-gray-600">localhost:5173</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Features Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="text-center p-4">
                        <div className="mx-auto p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-800 mb-2">Customer Profiles</h3>
                        <p className="text-gray-600 text-sm">
                            Create detailed customer profiles with complete history, preferences, and interactions
                        </p>
                    </div>
                    
                    <div className="text-center p-4">
                        <div className="mx-auto p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-800 mb-2">Document Management</h3>
                        <p className="text-gray-600 text-sm">
                            Store and organize all customer documents in one secure, accessible location
                        </p>
                    </div>
                    
                    <div className="text-center p-4">
                        <div className="mx-auto p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <Clock className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-800 mb-2">Activity Tracking</h3>
                        <p className="text-gray-600 text-sm">
                            Monitor all customer interactions and set follow-up reminders
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Team Section */}
            {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-600 mb-6">
                Meet the dedicated professionals behind CustomerCRM who are passionate about helping businesses improve their customer relationships.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-6">
                <div className="group relative text-center">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg">
                        <img 
                            src="/api/placeholder/96/96" 
                            alt="John Lenard Lorenzo"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <div className="flex space-x-3">
                                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-white hover:text-blue-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-800 text-lg">John Lenard Lorenzo</h3>
                    <p className="text-blue-600 text-sm mb-1">CEO & Founder</p>
                    <p className="text-gray-500 text-xs">Visionary leader with 10+ years in CRM solutions</p>
                </div>
                
                <div className="group relative text-center">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg">
                        <img 
                            src="/api/placeholder/96/96" 
                            alt="Ian James Villanueva"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <div className="flex space-x-3">
                                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                    {/* Instagram icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                                    {/* LinkedIn icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-500 transition-colors">
                                    {/* Twitter icon */}
                                </a>
                            </div>
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-800 text-lg">Ian James Villanueva</h3>
                    <p className="text-blue-600 text-sm mb-1">CTO</p>
                    <p className="text-gray-500 text-xs">Technology architect and innovation driver</p>
                </div>
                
                <div className="group relative text-center">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg">
                        <img 
                            src="/api/placeholder/96/96" 
                            alt="Kenneth Latonero"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <div className="flex space-x-3">
                                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                    {/* Instagram icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                                    {/* LinkedIn icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-500 transition-colors">
                                    {/* Twitter icon */}
                                </a>
                            </div>
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-800 text-lg">Kenneth Latonero</h3>
                    <p className="text-blue-600 text-sm mb-1">Head of Customer Success</p>
                    <p className="text-gray-500 text-xs">Customer experience specialist</p>
                </div>
                
                <div className="group relative text-center">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg">
                        <img 
                            src="/api/placeholder/96/96" 
                            alt="Tristan Seblario"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <div className="flex space-x-3">
                                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                    {/* Instagram icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                                    {/* LinkedIn icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-500 transition-colors">
                                    {/* Twitter icon */}
                                </a>
                            </div>
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-800 text-lg">Tristan Seblario</h3>
                    <p className="text-blue-600 text-sm mb-1">Head of Customer Success</p>
                    <p className="text-gray-500 text-xs">Client relations expert</p>
                </div>
                
                <div className="group relative text-center">
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg">
                        <img 
                            src="/cas.png" 
                            alt="Alexa Cas"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <div className="flex space-x-3">
                                <a href="#" className="text-white hover:text-blue-300 transition-colors">
                                    {/* Instagram icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-400 transition-colors">
                                    {/* LinkedIn icon */}
                                </a>
                                <a href="#" className="text-white hover:text-blue-500 transition-colors">
                                    {/* Twitter icon */}
                                </a>
                            </div>
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-800 text-lg">Alexa Cas</h3>
                    <p className="text-blue-600 text-sm mb-1">Head of Customer Success</p>
                    <p className="text-gray-500 text-xs">Customer onboarding specialist</p>
                </div>
            </div>
        </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-6">
                    Have questions about our Customer Management System? Reach out to our team and we'll be happy to assist you!
                </p>
                
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="company"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your Company Ltd."
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="How can we help you?"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                        </label>
                        <textarea
                            id="message"
                            rows={4}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Please provide details about your inquiry..."
                        />
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
            
            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
                
                <div className="space-y-4 mt-6">
                    <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-medium text-gray-800 mb-2">How can CustomerCRM help my business?</h3>
                        <p className="text-gray-600">
                            Our platform helps you centralize all customer information, track interactions, automate follow-ups, 
                            and analyze customer data to improve relationships and boost retention rates.
                        </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-medium text-gray-800 mb-2">Is CustomerCRM suitable for small businesses?</h3>
                        <p className="text-gray-600">
                            Absolutely! We offer flexible plans that scale with your business. Our platform is designed to be 
                            user-friendly and affordable for businesses of all sizes.
                        </p>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                        <h3 className="font-medium text-gray-800 mb-2">Can I import my existing customer data?</h3>
                        <p className="text-gray-600">
                            Yes, CustomerCRM supports importing data from CSV files, Excel spreadsheets, and several popular CRM systems.
                            Our support team can assist you with data migration.
                        </p>
                    </div>
                    
                    <div className="pb-2">
                        <h3 className="font-medium text-gray-800 mb-2">How secure is my customer data?</h3>
                        <p className="text-gray-600">
                            We take security seriously. CustomerCRM uses bank-level encryption, secure data centers, regular backups,
                            and strict access controls to keep your customer information safe and protected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicAboutPage;