'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FaInstagram, FaTiktok, FaSnapchat, FaTwitter, FaDiscord, 
  FaCog, FaEdit, FaSignOutAlt, FaUserCog 
} from 'react-icons/fa';
import DefaultAvatar from './DefaultAvatar';

// Update the default image constant
const DEFAULT_PROFILE_IMAGE = '/images/default-avatar.png';

/**
 * Reusable ProfileSection Component - Renders a section of the profile
 * @param {string} title - The title of the section
 * @param {JSX.Element} children - The content of the section
 * @param {string} className - Additional classes for customization
 * @returns {JSX.Element} A styled profile section
 */
const ProfileSection = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow ${className}`}>
    <h2 className="text-lg font-semibold text-[#384959] mb-2">{title}</h2>
    {children}
  </div>
);

/**
 * SkillTag Component - Renders a tag for a skill
 * @param {string} skill - The skill to display
 * @param {string} type - The type of skill (teaching or learning)
 * @returns {JSX.Element} A styled tag for the skill
 */
const SkillTag = ({ skill, type = "teaching" }) => (
  <span className={`
    px-3 py-1 rounded-full text-sm
    transition-all duration-200 hover:scale-105
    ${type === "teaching" 
      ? "bg-[#6A89A7] text-white hover:bg-[#88BDF2]" 
      : "bg-[#BDDDFC] text-[#384959] hover:bg-[#88BDF2]/70"}
  `}>
    {skill}
  </span>
);

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
      className={`
        transition-all duration-200 
        ${handle 
          ? "text-[#6A89A7] hover:text-[#384959] hover:scale-110" 
          : "text-gray-300 cursor-not-allowed"}
      `}
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
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
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

  // Settings menu options
  const menuOptions = [
    { 
      icon: <FaEdit />, 
      label: 'Edit Profile',
      action: () => router.push('/profile/edit')
    },
    { 
      icon: <FaUserCog />, 
      label: 'Account Settings',
      action: () => router.push('/profile/settings')
    },
    { 
      icon: <FaSignOutAlt />, 
      label: 'Sign Out',
      action: () => {
        // Add any cleanup logic here (clear tokens, etc.)
        router.push('/');
      }
    }
  ];

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
          <Image
            src={userProfile.skillDemo.url}
            alt="Skill demonstration"
            width={350}
            height={200}
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
              {/* Settings Menu */}
              <div className="absolute right-4 top-4 z-20"> {/* Updated positioning */}
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-[#384959] p-2.5 rounded-full hover:bg-[#6A89A7] 
                    transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <FaCog className="w-5 h-5 text-white" />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu">
                      {menuOptions.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            option.action();
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-sm text-[#384959] hover:bg-[#BDDDFC] flex items-center gap-2"
                        >
                          {option.icon}
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Content */}
              <ProfileSection className="relative">
                {userProfile.profilePicture ? (
                  <Image
                    src={userProfile.profilePicture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full mx-auto mb-4 border-4 border-[#6A89A7]"
                    priority
                    onError={() => {
                      return <DefaultAvatar className="w-32 h-32 mx-auto mb-4" />;
                    }}
                  />
                ) : (
                  <div className="mx-auto mb-4">
                    <DefaultAvatar />
                  </div>
                )}
                
                <h1 className="text-2xl font-bold text-[#384959]">
                  {userProfile.name}
                  <span className="text-lg text-[#6A89A7] ml-2">{userProfile.age}</span>
                </h1>
                
                <p className="text-[#384959] mt-2">
                  {userProfile.location} • {userProfile.year}
                </p>
              </ProfileSection>

              {/* Skills Section */}
              <ProfileSection title="Teaching">
                <div className="flex flex-wrap gap-2 justify-center">
                  {userProfile.skillsTeaching.map((skill, index) => (
                    <SkillTag key={index} skill={skill} type="teaching" />
                  ))}
                </div>
              </ProfileSection>

              <ProfileSection title="Learning">
                <div className="flex flex-wrap gap-2 justify-center">
                  {userProfile.skillsLearning.map((skill, index) => (
                    <SkillTag key={index} skill={skill} type="learning" />
                  ))}
                </div>
              </ProfileSection>

              {/* Social Media Section */}
              <ProfileSection title="Social Media">
                <div className="flex justify-center space-x-6">
                  {Object.entries(userProfile.socials).map(([platform, handle]) => (
                    <SocialIcon key={platform} platform={platform} handle={handle} />
                  ))}
                </div>
              </ProfileSection>

              {/* About Me Section */}
              <ProfileSection title="About Me">
                <p className="text-[#6A89A7] leading-relaxed">
                  {userProfile.aboutMe}
                </p>
              </ProfileSection>

              {/* Skill Demo Section */}
              {renderSkillDemo()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}