'use client';

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FaInstagram, FaTiktok, FaSnapchat, FaTwitter, FaDiscord, 
  FaCog, FaEdit, FaSignOutAut, FaUserCog 
} from 'react-icons/fa';
import { AuthContext } from '../context/authContext';
import DefaultAvatar from './DefaultAvatar';

const DEFAULT_PROFILE_IMAGE = '/images/default-avatar.png';

// Reusable components
const ProfileSection = ({ title, children, className = "" }) => (
  <div className={`
    bg-white rounded-lg p-4 mb-4 
    shadow-md hover:shadow-lg 
    transition-shadow duration-200
    ${className}
  `}>
    <h2 className="text-lg font-semibold text-[#384959] mb-2">{title}</h2>
    {children}
  </div>
);

const SkillTag = ({ skill, type = "teaching" }) => (
  <span className={`
    px-3 py-1 rounded-full text-sm font-medium
    transition-all duration-200 hover:scale-105
    ${type === "teaching" 
      ? "bg-[#6A89A7] text-white hover:bg-[#88BDF2]" 
      : "bg-[#BDDDFC] text-[#384959] hover:bg-[#88BDF2]/70"}
  `}>
    {skill}
  </span>
);

const SocialIcon = ({ platform, handle }) => {
  const icons = {
    instagram: <FaInstagram className="w-6 h-6" />,
    tiktok: <FaTiktok className="w-6 h-6" />,
    snapchat: <FaSnapchat className="w-6 h-6" />,
    twitter: <FaTwitter className="w-6 h-6" />,
    discord: <FaDiscord className="w-6 h-6" />
  };

  return handle ? (
    <a 
      href={`https://${platform}.com/${handle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-all duration-200 text-[#6A89A7] hover:text-[#384959] hover:scale-110"
    >
      {icons[platform]}
    </a>
  ) : null;
};

export default function PersonalProfile() {
  const router = useRouter();
  const { userEmail, isInitialLoad } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      icon: <FaSignOutAut />, 
      label: 'Sign Out',
      action: () => {
        // Add cleanup logic here (clear tokens, context, etc.)
        router.push('/');
      }
    }
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isInitialLoad || !userEmail) return;

      try {
        const response = await fetch('http://localhost:4000/api/users/me', {
          headers: { 'X-User-Email': userEmail }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userEmail, isInitialLoad]);

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6A89A7] border-t-transparent"/>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="text-red-500 text-center">
        <p className="text-xl font-semibold mb-2">Oops!</p>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!userProfile) return null;

  return (
    <div className="fixed inset-0 flex justify-center bg-gray-100">
      <div className="w-[393px] h-[852px] relative bg-white overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto bg-[#BDDDFC]">
          <div className="p-4">
            <div className="mt-8 text-center relative">
              {/* Settings Menu */}
              <div className="absolute right-6 top-2 z-20">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-[#384959] p-2.5 rounded-full hover:bg-[#6A89A7] 
                    transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <FaCog className="w-5 h-5 text-white" />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg 
                    bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                    {menuOptions.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          option.action();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-[#384959] hover:bg-[#BDDDFC] 
                          flex items-center gap-2 transition-colors duration-200"
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Content */}
              <ProfileSection>
                {userProfile.profilePicture ? (
                  <Image
                    src={userProfile.profilePicture}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full mx-auto mb-4 border-4 border-[#6A89A7]"
                    priority
                    onError={() => <DefaultAvatar />}
                  />
                ) : (
                  <DefaultAvatar />
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
              <ProfileSection title="Skills I'm Teaching">
                <div className="flex flex-wrap gap-2 justify-center">
                  {userProfile.skillsTeaching?.map((skill, index) => (
                    <SkillTag key={index} skill={skill} type="teaching" />
                  ))}
                </div>
              </ProfileSection>

              <ProfileSection title="Skills I'm Learning">
                <div className="flex flex-wrap gap-2 justify-center">
                  {userProfile.skillsLearning?.map((skill, index) => (
                    <SkillTag key={index} skill={skill} type="learning" />
                  ))}
                </div>
              </ProfileSection>

              {/* Social Media Section */}
              <ProfileSection title="Social Media">
                <div className="flex justify-center space-x-6">
                  {Object.entries(userProfile.socials || {}).map(([platform, handle]) => (
                    handle && <SocialIcon key={platform} platform={platform} handle={handle} />
                  ))}
                </div>
              </ProfileSection>

              {/* About Me Section */}
              <ProfileSection title="About Me">
                <p className="text-[#6A89A7] leading-relaxed">
                  {userProfile.aboutMe || 'No bio yet...'}
                </p>
              </ProfileSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}