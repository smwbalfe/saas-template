"use client";

import Link from 'next/link';
import { CheckCircle, ArrowRight, Settings } from 'lucide-react';

export default function SuccessPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border-t-4 border-t-purple-600">
                <div className="flex items-center mb-6">
                    <div className="bg-purple-600 p-3 rounded-full mr-4">
                        <CheckCircle size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Subscription Activated</h1>
                </div>

                <p className="text-gray-700 mb-6 text-lg">
                    Your premium access is now ready to use. All features have been unlocked.
                </p>

                <div className="bg-purple-50 rounded-lg p-5 mb-8 border-l-4 border-l-purple-600">
                    <h3 className="font-semibold text-purple-800 mb-3 text-lg">Your Premium Benefits:</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center text-gray-700">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mr-3"></div>
                            <span>Unlimited access to all content</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mr-3"></div>
                            <span>Priority customer support</span>
                        </li>
                        <li className="flex items-center text-gray-700">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mr-3"></div>
                            <span>Advanced analytics and reporting</span>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center py-3 px-6 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex-1"
                    >
                        <span>Go to Dashboard</span>
                        <ArrowRight className="ml-2" size={16} />
                    </Link>

                    <Link
                        href="/subscription"
                        className="flex items-center justify-center py-3 px-6 bg-white text-purple-600 border border-purple-200 rounded-lg font-medium hover:border-purple-300 transition-colors flex-1"
                    >
                        <span>Manage Subscription</span>
                        <Settings className="ml-2" size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}