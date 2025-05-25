'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaSnapchat, FaTwitter, FaDiscord, FaCog } from 'react-icons/fa';

// Default profile image path - used when user hasn't uploaded their own image
const DEFAULT_PROFILE_IMAGE = '/images/temporary-profile-picture.jpg';

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
  const [userProfile] = useState({
    name: "John Doe",
    year: "Junior",
    age: 20,
    location: "Irvine, CA",
    profilePicture: DEFAULT_PROFILE_IMAGE,
    skillsTeaching: ["Piano", "Python", "Spanish", "Photography", "Cooking", "Chess"],
    skillsLearning: ["Guitar", "React", "Korean", "Drawing", "Skateboarding", "Tennis"],
    socials: {
      instagram: "johndoe",
      tiktok: "",
      snapchat: "johndoe",
      twitter: "",
      discord: "johndoe#1234"
    },
    aboutMe: "Hey! I'm a UCI student passionate about learning and teaching new skills. I love sharing my knowledge of music and programming while exploring new hobbies!",
    skillDemo: {
      type: "video",
      url: "https://www.w3schools.com/tags/movie.mp4",
      title: "Piano Performance",
      description: "A short demonstration of my piano skills"
    }
  });

  /**
   * Renders the skill demonstration section if available
   * @returns {JSX.Element|null} Skill demo section or null if no demo exists
   */
  const renderSkillDemo = () => {
    if (!userProfile.skillDemo) return null;
    
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
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

  return (
    // Main container with fixed mobile dimensions
    <div className="fixed inset-0 flex justify-center bg-gray-100">
      <div className="w-[393px] h-[852px] relative bg-white overflow-hidden">
        {/* Scrollable content container */}
        <div className="absolute inset-0 overflow-y-auto bg-[#BDDDFC]">
          <div className="p-4">
            {/* Profile content wrapper */}
            <div className="mt-8 text-center relative">
              {/* Settings button - positioned absolutely */}
              <button className="absolute right-0 top-0 bg-[#384959] p-2 rounded-full z-10">
                <FaCog className="w-6 h-6 text-white" />
              </button>

              {/* Profile Picture Section */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={userProfile.profilePicture}
                  alt="Profile"
                  layout="fill"
                  className="rounded-full object-cover"
                  priority
                />
              </div>
              
              {/* Name and Age Section */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-[#384959]">{userProfile.name}</h1>
                <span className="text-lg text-[#6A89A7]">{userProfile.age}</span>
              </div>

              {/* Location and Year Section */}
              <div className="text-[#384959] mb-6">
                <p>{userProfile.location} • {userProfile.year}</p>
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
                {/* Teaching Skills */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-[#384959] mb-2">Teaching</h2>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {userProfile.skillsTeaching.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-[#6A89A7] text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Skills */}
                <div>
                  <h2 className="text-lg font-semibold text-[#384959] mb-2">Learning</h2>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {userProfile.skillsLearning.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-[#BDDDFC] text-[#384959] px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
                <h2 className="text-lg font-semibold text-[#384959] mb-4">Social Media</h2>
                <div className="flex justify-center space-x-6">
                  {Object.entries({
                    instagram: userProfile.socials.instagram,
                    tiktok: userProfile.socials.tiktok,
                    snapchat: userProfile.socials.snapchat,
                    twitter: userProfile.socials.twitter,
                    discord: userProfile.socials.discord
                  }).map(([platform, handle]) => (
                    <SocialIcon key={platform} platform={platform} handle={handle} />
                  ))}
                </div>
              </div>

              {/* About Me Section */}
              <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
                <h2 className="text-lg font-semibold text-[#384959] mb-2">About Me</h2>
                <p className="text-[#6A89A7]">{userProfile.aboutMe}</p>
              </div>

              {/* Skill Demo Section */}
              {renderSkillDemo()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}