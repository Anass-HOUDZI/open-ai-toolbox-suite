
import React from "react";
import { Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="py-6 bg-transparent text-center">
    <span className="text-gray-600 text-sm flex flex-col md:flex-row items-center justify-center gap-2">
      <span className="mb-1 md:mb-0">
        Copyright © 2025 Anass Houdzi – Tous droits réservés.
      </span>
      <a
        href="https://www.linkedin.com/in/anasshoudzi/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-blue-600 font-semibold hover:underline hover:text-blue-700 text-base transition"
        style={{ marginLeft: '0.5em' }}
      >
        <Linkedin size={20} className="text-blue-600" />
        LinkedIn
      </a>
    </span>
  </footer>
);

export default Footer;
