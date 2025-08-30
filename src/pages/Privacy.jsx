/** @format */

import React from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useState } from "react";

const Privacy = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#0B2A4A] text-white px-6 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <img
          src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
          alt="Valmo Logo"
          className="w-32"
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li className="hover:text-blue-300 cursor-pointer">Home</li>
          <li className="hover:text-blue-300 cursor-pointer">Track Order</li>
          <li className="hover:text-blue-300 cursor-pointer">About</li>
          <li className="hover:text-blue-300 cursor-pointer">Contact Us</li>
          <li className="hover:text-blue-300 cursor-pointer">
            Customer Dashboard
          </li>
        </ul>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#0B2A4A] md:hidden shadow-md py-4 z-20">
            <ul className="flex flex-col items-center gap-4 font-medium text-base">
              <li className="hover:text-blue-300 cursor-pointer">Home</li>
              <li className="hover:text-blue-300 cursor-pointer">
                Track Order
              </li>
              <li className="hover:text-blue-300 cursor-pointer">About</li>
              <li className="hover:text-blue-300 cursor-pointer">Contact Us</li>
              <li className="hover:text-blue-300 cursor-pointer">
                Customer Dashboard
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 text-gray-300">
        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-6 text-center">
            PRIVACY POLICY
          </h1>

          <div className="space-y-4">
            <p className="text-sm">Last Updated on [29 July 2025]</p>

            <p className="text-sm">
              Please read this privacy policy ("Privacy Policy") carefully
              before accessing or using Valmo's website "valmo.in", any of the
              offline businesses run under the brand name Valmo, mobile
              application and any of the platforms/tools developed by us from
              time to time (together referred to as "Platform").
            </p>

            <p className="text-sm">
              This Privacy Policy along with the Terms and Conditions published
              on our website ("Terms and Conditions") and other policies (as may
              be notified/displayed/published on our website/mobile application
              or any other tool or platform as may be notified to you)
              constitutes a legally binding contract between you and the
              Company.
            </p>

            <p className="text-sm">
              By use of our Platform, you agree to be bound by this Privacy
              Policy and any other policies as mentioned above as updated from
              time to time.
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
              What is Valmo and who operates it?
            </h2>
            <p className="text-sm">
              Valmo is a brand where registered delivery executives and delivery
              partners (together, "Partners") can offer to provide their
              logistics services.
            </p>

            <p className="text-sm">
              The Platform provided under the brand name "Valmo" are run by
              Meesho Limited (formerly Meesho Private Limited and Fashnear
              Technologies Private Limited) ("Company").
            </p>

            <p className="text-sm">
              The Company does not own, sell, resell, furnish or provide any
              logistics services. Company's role is limited to facilitating the
              services and associated marketing, facilitating payment
              collections, fulfillment, enquiry management and other incidental
              services to enable the transactions between Partners and
              end-users.
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
              When is this Privacy Policy applicable and binding on Users?
            </h2>
            <p className="text-sm">
              This Privacy Policy and other Company policies as published on our
              websites and/or other tools or platforms are applicable to any
              person when they install, download any tool, visit or access the
              website or any of the tools/platforms of Valmo, or utilize our
              online or offline Platform, which include without limitation
              browsers, Suppliers, merchants, purchasers or contributors of
              content and onboarded Partners (collectively, "User/You").
            </p>

            <p className="text-sm">
              This Privacy Policy is applicable from the date on which any of
              our tool or application is downloaded/website is accessed or
              online or offline services are utilized or signed up for and/or
              the date on which Privacy Policy (i.e., our Privacy Policy and any
              other Valmo policies) is updated, creating a legally binding
              arrangement between the User and the Company.
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
              Whether this Privacy Policy or any other Valmo policies can be
              modified?
            </h2>
            <p className="text-sm">
              Users can review the most current version of this Privacy Policy
              and any other Valmo policies at any time on Valmo website. Company
              reserves the right to unilaterally update, change or replace them
              at any time and such amended provisions of this Privacy Policy or
              any other Valmo policy shall be effective immediately upon being
              posted on the website.
            </p>

            <p className="text-sm">
              It is the responsibility of the Users to check this page
              periodically for changes. The Users' continued use of or access to
              the Platform following the posting of any changes constitutes
              acceptance of those changes.
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
              What if this Privacy Policy is not acceptable to the User?
            </h2>
            <p className="text-sm">
              If the User does not agree with this Privacy Policy or the terms
              of any other agreement executed between them and the Company, the
              User is advised to refrain from using the Platform. By use of the
              Platform, it is signified that the User agrees to abide by all our
              Privacy Policy and/or policies (as updated from time to time).
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
              Eligibility
            </h2>
            <p className="text-sm">
              You may use the Platform in accordance with our contractual
              arrangement with you and/or as per this Privacy Policy. You must
              be over the age of eighteen (18) years and able to understand and
              agree to the terms set forth in this Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
              What details are required from Users?
            </h2>
            <p className="text-sm">
              The Users are required to share their personal details including
              name, address, phone number, payment information along with other
              details as mentioned in the form or otherwise requested at the
              time of onboarding or registration, as further detailed under this
              Privacy Policy. By such registration, User consents to be
              contacted by Company via phone calls, SMS notifications, WhatsApp
              communications, e-mails, instant messages or other such means of
              communication inter alia for subscription/services/promotional
              updates etc.
            </p>

            <p className="text-sm">
              It is the responsibility of the Users to provide the correct
              contact details so that the Company can communicate with the
              Users. The Users understand and agree that if the Company sends
              any communication, including an SMS or reaches out otherwise, but
              the Users do not receive it because the Users' contact details are
              incorrect, outdated or blocked by the User's service provider, or
              the Users are otherwise unable to receive such communication, the
              Company shall be deemed to have provided the communication to the
              Users effectively.
            </p>

            <p className="text-sm">
              It is the User's responsibility to provide accurate, current and
              complete information during the onboarding process and to update
              such information to keep it accurate, current and complete.
            </p>

            <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
              What information is collected from the User? How does the Company
              deal with the information provided to it by a User?
            </h2>
            <p className="text-sm">
              Company collects various types of information, some information is
              non-personal information and some is personal information.
            </p>

            <p className="text-sm">
              All information about Users that are collected, stored, or
              transmitted is processed for facilitating various operations in
              relation to the Platform and logistics services, including
              registration, order placement, listing, delivery, or payments.
            </p>

            <p className="text-sm">
              For a more comprehensive understanding, Users are encouraged to
              view the Valmo's Privacy Policy available on the website.
            </p>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm">
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <p className="text-sm mt-2">
                FASHNEAR TECHNOLOGIES PRIVATE LIMITED
                <br />
                3rd Floor, Wing-E, Helios Business Park, Kadubeesanahalli
                Village, Varthur Hobli, Outer Ring Road Bellandur, Bangalore,
                Bangalore South, Karnataka, India, 560103
                <br />
                CIN: U74900KA2015PTC082263
                <br />
                Email: hello@valmo.in
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2A4A] text-white mt-20 pt-10 pb-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          {/* Left Side */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-20">
            {/* Logo */}
            <img
              src="https://www.valmo.in/static-assets/valmo-web/valmo-logo-white.svg"
              alt="Valmo Logo"
              className="w-32 md:w-48 md:mb-24"
            />

            {/* Address and Email */}
            <div>
              <h4 className="text-lg font-semibold mb-2">
                Fashnear Technologies Private Limited
              </h4>

              {/* Location */}
              <div className="flex items-start text-sm text-gray-200 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mt-1 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <circle cx="12" cy="11" r="3" fill="currentColor" />
                </svg>
                <p className="leading-relaxed">
                  Fashnear Technologies Private Limited,
                  <br />
                  CIN: U74900KA2015PTC082263
                  <br />
                  3rd Floor, Wing-E, Helios Business Park,
                  <br />
                  Kadubeesanahalli Village, Varthur Hobli,
                  <br />
                  Outer Ring Road Bellandur, Bangalore South,
                  <br />
                  Karnataka, India, 560103
                </p>
              </div>

              {/* Email */}
              <div className="flex items-center text-sm text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12H8m0 0l4-4m-4 4l4 4"
                  />
                </svg>
                <span>hello@valmodeliver.in</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="mt-8 md:mt-3 md:mr-10">
            <ul className="text-xl text-gray-200 font-semibold space-y-2">
              <li className="hover:underline cursor-pointer">
                <span>Legal</span>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">
                  Terms of use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="max-w-7xl mx-auto mt-6 border-t border-gray-500 pt-4 text-xs text-gray-300">
          <p className="italic">
            Disclaimer: Any official communication for business related
            formalities will be sent by Valmo using our authorised official
            email addresses (@hello@valmodeliver.in or @meesho.com). Kindly DO
            NOT interact with any communications or requests for payments from
            any other sources or share any personal information.
          </p>
          <p className="mt-4">&copy; Copyright © 2024. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
