import React from 'react';
import { Users, Shield, BarChart3, Clock, MessageCircle, Check } from 'lucide-react';

const PublicHomePages = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="py-16 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Customer Management System
          </h1>
          <p className="text-m md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Simplify customer relationships and boost your business growth
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow border border-blue-200 hover:bg-gray-50 transition-colors">
              Request Demo
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
            <p className="text-gray-600">
              Store and manage all your customer data in one centralized location
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Support Ticketing</h3>
            <p className="text-gray-600">
              Track and resolve customer issues efficiently with our ticketing system
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
            <p className="text-gray-600">
              Gain insights with comprehensive reporting and analytics
            </p>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Trusted by innovative companies</h2>
          <div className="flex flex-wrap justify-center gap-10 opacity-60">
            <div className="text-gray-500 font-bold text-2xl">COMPANY A</div>
            <div className="text-gray-500 font-bold text-2xl">COMPANY B</div>
            <div className="text-gray-500 font-bold text-2xl">COMPANY C</div>
            <div className="text-gray-500 font-bold text-2xl">COMPANY D</div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why choose CustomerCRM?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Easy to Use</h3>
                <p className="text-gray-600">Intuitive interface designed for teams of all sizes</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Fast Implementation</h3>
                <p className="text-gray-600">Get up and running in minutes, not weeks</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Secure & Reliable</h3>
                <p className="text-gray-600">Your data is protected with enterprise-grade security</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">24/7 Support</h3>
                <p className="text-gray-600">Our team is always available to help you succeed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 bg-blue-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your customer experience?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of businesses already growing with CustomerCRM</p>
          <button className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg inline-block hover:bg-blue-50 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicHomePages;