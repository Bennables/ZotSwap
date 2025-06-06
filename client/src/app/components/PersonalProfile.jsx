'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaSnapchat, FaTwitter, FaDiscord, FaCog } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useRouter } from 'next/navigation';

// Default profile image path - used when user hasn't uploaded their own image
const DEFAULT_PROFILE_IMAGE = '/images/default-profile.jpg';

/**
 * SocialIcon Component - Renders social media icons with links
 * @param {string} platform - The social media platform (instagram, tiktok, etc.)
 * @param {string} handle - The user's username on the platform
 * @returns {JSX.Element} A social media icon with link
 */
const SocialIcon = ({ platform, handle }) => {
  // Map of platform names to their respective icons
  const icons = {
    instagram: <FaInstagram className="w-6 h-6" />,
    tiktok: <FaTiktok className="w-6 h-6" />,
    snapchat: <FaSnapchat className="w-6 h-6" />,
    twitter: <FaTwitter className="w-6 h-6" />,
    discord: <FaDiscord className="w-6 h-6" />
  };

  return (
    <a 
      href={handle ? `https://${platform}.com/${handle}` : '#'} 
      target={handle ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`transition-colors ${handle 
        ? "text-[#6A89A7] hover:text-[#384959]" 
        : "text-gray-300 cursor-not-allowed"}`}
      onClick={e => !handle && e.preventDefault()}
    >
      {icons[platform]}
    </a>
  );
};

/**
 * PersonalProfile Component - Main profile page component
 * Displays user information in a mobile-like interface (393x852 pixels)
 * @returns {JSX.Element} The complete profile page
 */
export default function PersonalProfile() {
  // User profile data state
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get userEmail and isInitialLoad from AuthContext
  const { userEmail, isInitialLoad, setUserEmail } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Replace with your actual authenticated endpoint to fetch the current user's profile
        // Assuming user email is stored in localStorage or a context after login
        // const userEmail = localStorage.getItem('userEmail'); // Placeholder: Get email from localStorage

        // Wait for initial load from localStorage to complete in AuthContext
        if (isInitialLoad) {
          return;
        }

        if (!userEmail) {
          // Set error only after initial load is complete and no email is found
          setError('User email not found. Please log in.');
          setLoading(false);
          return;
        }

        // Clear error if email is found after a previous error
        if (error && userEmail) {
            setError(null);
        }

        const response = await fetch('http://localhost:4000/api/users/me', {
          headers: {
            'X-User-Email': userEmail // Send email in custom header
          }
        });

        if (!response.ok) {
          // Assuming backend sends { error: message } on failure
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user profile');
        }
        const data = await response.json();
        setUserProfile(data);
        console.log("Fetched user profile data:", data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Fetch profile only if userEmail is available AND initial load is complete
    if (!isInitialLoad && userEmail) {
        fetchUserProfile();
    } else if (!isInitialLoad && !userEmail) {
        // If initial load is done but no email is found, set loading to false
        setLoading(false);
    }

  }, [userEmail, isInitialLoad]); // Dependency array includes userEmail and isInitialLoad

  /**
   * Renders the skill demonstration section if available
   * @returns {JSX.Element|null} Skill demo section or null if no demo exists
   */
  const renderSkillDemo = () => {
    if (!userProfile.skillDemo) return null;
    
    return (
      <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-100">
        <h2 className="text-lg font-semibold text-[#384959] mb-2">Skill Demo</h2>
        <h3 className="text-md text-[#6A89A7] mb-2">{userProfile.skillDemo.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{userProfile.skillDemo.description}</p>
        {userProfile.skillDemo.type === 'video' ? (
          <video 
            controls 
            className="w-full rounded-lg"
            src={userProfile.skillDemo.url}
          />
        ) : (
          <img 
            src={userProfile.skillDemo.url}
            alt="Skill demonstration"
            className="w-full rounded-lg"
          />
        )}
      </div>
    );
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    router.push('/');
  };

  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-[393px] h-[852px] relative bg-white dark:bg-gray-800 overflow-hidden">
        {/* Scrollable content container */}
        <div className="absolute inset-0 overflow-y-auto bg-[#BDDDFC] dark:bg-gray-700">
          <div className="p-4">
            {/* Profile content wrapper */}
            <div className="mt-8 text-center relative">
              {/* Settings button with dropdown container */}
              <div className="absolute right-0 top-0 z-20">
                <button 
                  className="bg-[#384959] dark:bg-gray-600 p-2 rounded-full z-10 hover:bg-[#6A89A7] dark:hover:bg-gray-500 transition-colors duration-200"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-label="Settings"
                >
                  <FaCog className="w-6 h-6 text-white dark:text-gray-200" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <button 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left transition-colors duration-150"
                      onClick={() => { setIsDropdownOpen(false); router.push('/edit-profile'); }}
                    >
                      Edit Profile
                    </button>
                    <button 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left transition-colors duration-150"
                      onClick={() => { setIsDropdownOpen(false); router.push('/account-settings'); }}
                    >
                      Account Settings
                    </button>
                    <button 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left transition-colors duration-150"
                      onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {loading && <p className="text-center text-[#384959] dark:text-gray-300">Loading profile...</p>}
              {!loading && error && <p className="text-center text-red-500 dark:text-red-400">Error: {error}</p>}

              {userProfile && (
                <>
                  {/* Profile Picture Section */}
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <Image
                      src={userProfile.profilePicture || DEFAULT_PROFILE_IMAGE}
                      alt="Profile"
                      layout="fill"
                      className="rounded-full object-cover"
                      priority
                    />
                  </div>

                  {/* Name and Age Section */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold text-[#384959] dark:text-white">
                      {userProfile.firstName} {userProfile.lastName}
                    </h1>
                    <span className="text-lg text-[#6A89A7] dark:text-gray-400">{userProfile.age || ''}</span>
                  </div>

                  {/* Location and Year Section */}
                  <div className="text-[#384959] dark:text-gray-300 mb-6">
                    <p>{userProfile.location || 'Location'} • {userProfile.year || 'Year'}</p>
                  </div>

                  {/* Skills Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-100">
                    {/* Teaching Skills */}
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-[#384959] dark:text-white mb-2">Teaching</h2>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {userProfile.skillsOffered && userProfile.skillsOffered.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-[#6A89A7] text-white px-3 py-1 rounded-full text-sm dark:bg-[#506b84] dark:text-gray-200 cursor-pointer hover:scale-105 hover:bg-[#384959]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learning Skills */}
                    <div>
                      <h2 className="text-lg font-semibold text-[#384959] dark:text-white mb-2">Learning</h2>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {userProfile.skillsWanted && userProfile.skillsWanted.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-[#BDDDFC] text-[#384959] px-3 py-1 rounded-full text-sm dark:bg-blue-800 dark:text-blue-200 cursor-pointer hover:scale-105 hover:bg-[#A0C0D0]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Social Media Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-100">
                    <h2 className="text-lg font-semibold text-[#384959] dark:text-white mb-4">Social Media</h2>
                    <div className="flex justify-center space-x-6">
                      {/* Define supported platforms and map over them */}
                      {['instagram', 'tiktok', 'snapchat', 'twitter', 'discord'].map(platform => {
                        const handle = userProfile.socials ? userProfile.socials[platform] : '';
                        return (
                          <SocialIcon key={platform} platform={platform} handle={handle} />
                        );
                      })}
                    </div>
                  </div>

                  {/* About Me Section */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-100">
                    <h2 className="text-lg font-semibold text-[#384959] dark:text-white mb-2">About Me</h2>
                    <p className="text-[#6A89A7] dark:text-gray-400">{userProfile.aboutMe || 'Tell us about yourself...'}</p>
                  </div>

                  {/* Skill Demo Section */}
                  {userProfile.skillDemo && renderSkillDemo()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}