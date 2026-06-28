import React from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#080B1A] border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Top */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="text-2xl font-bold text-indigo-400 mb-3">
                            Dev<span className="text-white">Mentor</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4">
                            India's real-time developer mentorship platform.
                            Learn from experts. Grow faster.
                        </p>
                        <div className="flex gap-3">
                            <a href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 transition text-sm">
                                in
                            </a>
                            <a href="https://github.com/nk1710"
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition text-sm">
                                gh
                            </a>
                            <a href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-600 transition text-sm">
                                tw
                            </a>
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            Platform
                        </h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Find Mentors', path: '/mentors' },
                                { label: 'Become a Mentor', path: '/register' },
                                { label: 'For Colleges', path: '/register' },
                                { label: 'Pricing', path: '/college-dashboard' },
                            ].map((link, i) => (
                                <p key={i}
                                    onClick={() => navigate(link.path)}
                                    className="text-slate-500 hover:text-white cursor-pointer text-sm transition">
                                    {link.label}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            Company
                        </h4>
                        <div className="space-y-3">
                            {[
                                { label: 'About Us', path: '/about' },
                                { label: 'Contact Us', path: '/contact' },
                                { label: 'Careers', path: '/contact' },
                                { label: 'Blog', path: '/' },
                            ].map((link, i) => (
                                <p key={i}
                                    onClick={() => navigate(link.path)}
                                    className="text-slate-500 hover:text-white cursor-pointer text-sm transition">
                                    {link.label}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                            Legal
                        </h4>
                        <div className="space-y-3">
                            {[
                                { label: 'Privacy Policy', path: '/privacy-policy' },
                                { label: 'Terms & Conditions', path: '/terms-and-conditions' },
                                { label: 'Refund Policy', path: '/refund-policy' },
                                { label: 'Cookie Policy', path: '/privacy-policy' },
                            ].map((link, i) => (
                                <p key={i}
                                    onClick={() => navigate(link.path)}
                                    className="text-slate-500 hover:text-white cursor-pointer text-sm transition">
                                    {link.label}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-10 p-6 bg-slate-800/30 rounded-2xl border border-slate-800">
                    {[
                        { number: '500+', label: 'Expert Mentors' },
                        { number: '10K+', label: 'Sessions Completed' },
                        { number: '4.9★', label: 'Average Rating' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl font-bold text-indigo-400">
                                {stat.number}
                            </div>
                            <div className="text-slate-500 text-sm mt-1">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 text-sm">
                        © {year} DevMentor. All rights reserved. Made with ❤️ in India
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <p className="text-slate-600 text-sm">
                            All systems operational
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;