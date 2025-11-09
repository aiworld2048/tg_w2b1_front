import React, { useState } from 'react';
import { message } from 'antd';

const CredentialsDisplay = ({ username, password, onClose }) => {
    const [copied, setCopied] = useState(false);

    const copyCredentials = async () => {
        const credentials = `Username: ${username}\nPassword: ${password}`;
        try {
            await navigator.clipboard.writeText(credentials);
            setCopied(true);
            message.success('Credentials copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            message.error('Failed to copy credentials');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Account Created Successfully!</h3>
                        <p className="text-sm text-gray-600">Your guest account is ready to use</p>
                    </div>
                </div>

                {/* Credentials Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-gray-700">Your Login Credentials</span>
                        <button
                            onClick={copyCredentials}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                copied 
                                    ? 'bg-green-100 text-green-700 border border-green-300' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
                            }`}
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy All
                                </>
                            )}
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Username:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded border">
                                    {username}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(username);
                                        message.success('Username copied!');
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">Password:</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded border">
                                    {password}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(password);
                                        message.success('Password copied!');
                                    }}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div className="text-sm text-yellow-800">
                            <p className="font-medium">Save your credentials!</p>
                            <p className="text-yellow-700">You'll need these to log in later. This is the only time they'll be shown.</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Start Playing
                    </button>
                    <button
                        onClick={copyCredentials}
                        className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                        Copy & Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CredentialsDisplay;
