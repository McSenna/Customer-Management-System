import React from 'react';
import { Phone, Mail, MapPin, Globe, FileText, Clock, Users } from 'lucide-react';

const PublicAboutPage = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* About Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">About Customer Management System</h1>
                <p className="mt-4 text-lg text-gray-600">
                    Streamline your customer relationships with our powerful yet intuitive management platform
                </p>
            </div>
            
            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Company</h2>
                <p className="text-gray-600 mb-6">
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
                            <p className="text-gray-600">123 Business Avenue, Tech City, ST 12345</p>
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
                            <p className="text-gray-600">support@customercrm.com</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Globe className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium text-gray-800">Website</h3>
                            <p className="text-gray-600">www.customercrm.com</p>
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Team</h2>
                <p className="text-gray-600 mb-6">
                    Meet the dedicated professionals behind CustomerCRM who are passionate about helping businesses improve their customer relationships.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-500">JLL</span>
                        </div>
                        <h3 className="font-medium text-gray-800">John Lenard Lorenzo</h3>
                        <p className="text-gray-500 text-sm">CEO & Founder</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-500">IJV</span>
                        </div>
                        <h3 className="font-medium text-gray-800">Ian James Villanueva</h3>
                        <p className="text-gray-500 text-sm">CTO</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-500">KL</span>
                        </div>
                        <h3 className="font-medium text-gray-800">Kenneth latonero</h3>
                        <p className="text-gray-500 text-sm">Head of Customer Success</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-500">TS</span>
                        </div>
                        <h3 className="font-medium text-gray-800">Tristan Seblario</h3>
                        <p className="text-gray-500 text-sm">Head of Customer Success</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl font-bold text-gray-500">AC</span>
                        </div>
                        <h3 className="font-medium text-gray-800">Alexa Cas</h3>
                        <p className="text-gray-500 text-sm">Head of Customer Success</p>
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