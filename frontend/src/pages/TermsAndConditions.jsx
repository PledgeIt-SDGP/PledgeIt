import React from 'react';
import { Heart } from 'lucide-react';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                    <div className="flex items-center gap-2">
                        <Heart className="w-8 h-8" />
                        <h1 className="text-3xl font-bold">PledgeIt Terms and Conditions</h1>
                    </div>
                    <p className="mt-2 opacity-90">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                        <p className="text-gray-600 mb-4">
                            Welcome to PledgeIt! These Terms and Conditions govern your use of our volunteer platform
                            and services. By accessing or using PledgeIt, you agree to be bound by these terms.
                        </p>
                        <p className="text-gray-600">
                            PledgeIt connects volunteers with organizations in Sri Lanka to create positive community impact
                            through various events and initiatives.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. User Accounts</h2>
                        <p className="text-gray-600 mb-2">When creating an account with PledgeIt, you agree to:</p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Be at least 16 years of age or have parental consent</li>
                        </ul>
                        <p className="text-gray-600">
                            We reserve the right to suspend or terminate accounts that violate these terms or engage in
                            harmful activities.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Volunteer Participation</h2>
                        <p className="text-gray-600 mb-4">
                            By participating in events listed on PledgeIt, you agree to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                            <li>Follow all instructions provided by event organizers</li>
                            <li>Conduct yourself in a respectful and professional manner</li>
                            <li>Notify organizers if you cannot attend a registered event</li>
                            <li>Comply with all applicable laws and regulations</li>
                        </ul>
                        <p className="text-gray-600">
                            PledgeIt is not responsible for injuries or damages that occur during volunteer activities.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. XP Points System</h2>
                        <p className="text-gray-600 mb-4">
                            Our XP points and leaderboard system is designed to recognize volunteer contributions:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                            <li>Points are awarded based on event participation and duration</li>
                            <li>We reserve the right to adjust point values or remove points for violations</li>
                            <li>Leaderboard positions may change as new data is processed</li>
                            <li>Points have no cash value and cannot be transferred</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Content and Conduct</h2>
                        <p className="text-gray-600 mb-4">
                            Users must not:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                            <li>Post false or misleading information</li>
                            <li>Upload content that is unlawful, harmful, or offensive</li>
                            <li>Impersonate others or create fake accounts</li>
                            <li>Engage in spamming or unauthorized promotions</li>
                        </ul>
                        <p className="text-gray-600">
                            PledgeIt may remove content that violates these standards without notice.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Privacy</h2>
                        <p className="text-gray-600 mb-4">
                            Your privacy is important to us. Please review our Privacy Policy to understand how we collect,
                            use, and protect your personal information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Modifications</h2>
                        <p className="text-gray-600">
                            We may update these Terms and Conditions periodically. Continued use of PledgeIt after changes
                            constitutes acceptance of the new terms. We will notify users of significant changes through
                            our platform or email.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact Us</h2>
                        <p className="text-gray-600">
                            For questions about these Terms and Conditions, please contact us at{' '}
                            <a href="mailto:pledgeit6@gmail.com" className="text-orange-600 hover:underline">
                                pledgeit6@gmail.com
                            </a>.
                        </p>
                    </section>
                </div>

                {/* Footer Note */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                    <p className="text-center text-gray-500 text-sm">
                        Thank you for being part of PledgeIt and helping to make Sri Lanka a better place!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;