"use client";

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer id="contact" className="bg-black border-t-2 text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* O nas / Informacje */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-red-500">CINEMA PLANET</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Twoje miejsce na najlepsze filmy. Doświadcz magii kina w nowoczesnej przestrzeni.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Facebook">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Twitter">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Instagram">
                                <FaInstagram size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Szybkie linki */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Szybkie linki</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button 
                                    onClick={() => {
                                        const element = document.getElementById('home');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Home
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => {
                                        const element = document.getElementById('airing');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Airing
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => {
                                        const element = document.getElementById('upcoming');
                                        element?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Upcoming
                                </button>
                            </li>
                            <li>
                                <Link href="/cinemaLayout" className="text-gray-400 hover:text-white transition-colors">
                                    Rezerwacja miejsc
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Informacje */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Informacje</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    O nas
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Regulamin
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    Polityka prywatności
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kontakt */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-gray-400">
                                <FaMapMarkerAlt className="text-red-500" />
                                <span>ul. Kino 123, 00-000 Kraków</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <FaPhone className="text-red-500" />
                                <a href="tel:+48123456789" className="hover:text-white transition-colors">
                                    +48 123 456 789
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <FaEnvelope className="text-red-500" />
                                <a href="mailto:kontakt@cinemaplanet.pl" className="hover:text-white transition-colors">
                                    kontakt@cinemaplanet.pl
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} CINEMA PLANET. Wszystkie prawa zastrzeżone.</p>
                </div>
            </div>
        </footer>
    );
}
