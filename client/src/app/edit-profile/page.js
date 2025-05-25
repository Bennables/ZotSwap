'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaCamera, FaVideo } from 'react-icons/fa'; // Assuming these might be useful for file inputs
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

const yearOptions = [
  'Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Faculty', 'Staff', 'Alumni', 'Other'
];

export default function EditProfile() {
  const router = useRouter();
  const { userEmail } = useContext(AuthContext); // Get user email from context

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    location: '',
    year: '',
    aboutMe: '',
    skillsOffered: [],
    skillsWanted: [],
    socials: {
      instagram: '',
      tiktok: '',
      snapchat: '',
      twitter: '',
      discord: '',
    },
    profilePicture: null, // For new file upload
    skillDemo: null, // For new file upload
    skillDemoTitle: '',
    skillDemoDescription: '',
    // Add other fields as needed (e.g., major)
  });

  // State to hold existing file URLs
  const [existingFiles, setExistingFiles] = useState({
    profilePictureUrl: null,
    skillDemoUrl: null,
    skillDemoType: null, // 'video' or 'image'
  });


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
   // State to store the full fetched user profile
  const [userProfile, setUserProfile] = useState(null);


  // Fetch current user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userEmail) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:4000/api/users/me', {
           headers: {
            'X-User-Email': userEmail // Send email in custom header
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch profile data');
        }
        const data = await response.json();
        setUserProfile(data); // Store fetched user profile
        // Map fetched data to form state, handling potential differences in field names
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          age: data.age || '',
          location: data.location || '',
          year: data.year || '',
          aboutMe: data.aboutMe || '',
          skillsOffered: Array.isArray(data.skillsOffered) ? data.skillsOffered : [],
          skillsWanted: Array.isArray(data.skillsWanted) ? data.skillsWanted : [],
          socials: {
            instagram: data.socials?.instagram || '',
            tiktok: data.socials?.tiktok || '',
            snapchat: data.socials?.snapchat || '',
            twitter: data.socials?.twitter || '',
            discord: data.socials?.discord || '',
          },
          profilePicture: null, // This will hold the *new* file to upload
          skillDemo: null,     // This will hold the *new* file to upload
          skillDemoTitle: data.skillDemo?.title || '',
          skillDemoDescription: data.skillDemo?.description || '',
          // ... map other fields
        });
         // Set initial existing file URLs from fetched data
        setExistingFiles({
          profilePictureUrl: data.profilePicture || null,
          skillDemoUrl: data.skillDemo?.url || null,
          skillDemoType: data.skillDemo?.type || null,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userEmail) {
       fetchProfile();
    } else {
       setLoading(false); // Stop loading if no user email
    }

  }, [userEmail]); // Re-run if userEmail changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value
      }
    }));
  };

   const handleSkillChange = (type) => (e) => {
    const value = e.target.value;
    // Split comma-separated string into an array, trim whitespace
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill !== '');
    setForm(prev => ({ ...prev, [type]: skillsArray }));
  };

  const handleFileChange = (type) => (e) => {
      const file = e.target.files[0];
      if (file) {
          setForm(prev => ({ ...prev, [type]: file }));
      }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Prepare data for submission
    const formData = new FormData(); // Use FormData for file uploads

    // Append text/basic fields
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('age', form.age);
    formData.append('location', form.location);
    formData.append('year', form.year);
    formData.append('aboutMe', form.aboutMe);
    formData.append('skillsOffered', JSON.stringify(form.skillsOffered)); // Send as JSON string
    formData.append('skillsWanted', JSON.stringify(form.skillsWanted)); // Send as JSON string
    formData.append('socials', JSON.stringify(form.socials)); // Send as JSON string
     formData.append('skillDemoTitle', form.skillDemoTitle);
    formData.append('skillDemoDescription', form.skillDemoDescription);


    // Append files if they exist (backend needs to handle receiving these)
    if (form.profilePicture) {
      formData.append('profilePicture', form.profilePicture);
    }
     if (form.skillDemo) {
        // You might need to determine the type (video/image) and append accordingly
         formData.append('skillDemo', form.skillDemo);
     }

    // You might also need to append the user identifier (email or ID)
     if (userEmail) {
         formData.append('userEmail', userEmail);
     }


    try {
      // Replace with your actual backend endpoint for updating profile
      const response = await fetch('http://localhost:4000/api/users/me', {
        method: 'PUT', // Or POST, depending on your API
        // When using FormData, the 'Content-Type' header is automatically set
        // to 'multipart/form-data' with the correct boundary, so don't set it manually.
        // headers: { 'Content-Type': 'application/json' }, // REMOVE this line if using FormData
        body: formData, // Send FormData object
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      console.log('Profile updated successfully:', data);
      router.push('/profile'); // Navigate back to profile page on success

    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile'); // Navigate back without saving
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center h-screen bg-[#F7FAFC] dark:bg-[#384959]">
        <p className="text-[#384959] dark:text-[#F7FAFC]">Loading profile data...</p>
      </div>
    );
  }

  if (error && !userEmail) { // Show error if no user email and not just a fetch error after initial load
       return (
        <div className="fixed inset-0 flex items-center justify-center h-screen bg-[#F7FAFC] dark:bg-[#384959]">
           <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        </div>
       );
  }


  return (
    <div className="fixed inset-0 flex justify-center bg-[#F7FAFC] dark:bg-[#384959] p-4 overflow-y-auto">
       <div className="w-full max-w-md bg-white dark:bg-[#6A89A7] rounded-3xl shadow-lg border border-[#6A89A7] dark:border-[#F7FAFC] flex flex-col md:h-auto min-h-full"> {/* Removed my-8, Added min-h-full */}
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#384959] dark:text-[#F7FAFC] mb-6 text-center">Edit Profile</h1>

             {error && <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div>
                <label htmlFor="firstName" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">First Name</label>
                <input type="text" id="firstName" name="firstName" value={form.firstName} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
              </div>
               <div>
                <label htmlFor="lastName" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={form.lastName} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
              </div>
               <div>
                <label htmlFor="age" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Age</label>
                <input type="number" id="age" name="age" value={form.age} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
              </div>
              <div>
                <label htmlFor="location" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Location</label>
                <input type="text" id="location" name="location" value={form.location} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
              </div>
               <div>
                <label htmlFor="year" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Year in School</label>
                <select id="year" name="year" value={form.year} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]">
                  <option value="">Select Year</option>
                  {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>

              {/* About Me */}
              <div>
                <label htmlFor="aboutMe" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">About Me</label>
                <textarea id="aboutMe" name="aboutMe" value={form.aboutMe} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959] h-32" placeholder="Tell us about yourself..."></textarea>
              </div>

              {/* Skills */}
              <div>
                <label htmlFor="skillsOffered" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Skills Offered (comma-separated)</label>
                <input type="text" id="skillsOffered" name="skillsOffered" value={form.skillsOffered.join(', ')} onChange={handleSkillChange('skillsOffered')} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
              </div>
              <div>
                <label htmlFor="skillsWanted" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Skills Wanted (comma-separated)</label>
                <input type="text" id="skillsWanted" name="skillsWanted" value={form.skillsWanted.join(', ')} onChange={handleSkillChange('skillsWanted')} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
              </div>

              {/* Social Media Handles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="instagram" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Instagram Handle</label>
                  <input type="text" id="instagram" name="instagram" value={form.socials.instagram} onChange={handleSocialChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
                </div>
                <div>
                  <label htmlFor="tiktok" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">TikTok Handle</label>
                  <input type="text" id="tiktok" name="tiktok" value={form.socials.tiktok} onChange={handleSocialChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
                </div>
                 <div>
                  <label htmlFor="snapchat" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Snapchat Handle</label>
                  <input type="text" id="snapchat" name="snapchat" value={form.socials.snapchat} onChange={handleSocialChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
                </div>
                 <div>
                  <label htmlFor="twitter" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Twitter Handle</label>
                  <input type="text" id="twitter" name="twitter" value={form.socials.twitter} onChange={handleSocialChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
                </div>
                 <div>
                  <label htmlFor="discord" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Discord Handle</label>
                  <input type="text" id="discord" name="discord" value={form.socials.discord} onChange={handleSocialChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
                </div>
              </div>

              {/* File Uploads (Profile Picture and Skill Demo) - Basic Input Fields */}
               <div>
                <label htmlFor="profilePicture" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Update Profile Picture</label>
                {existingFiles.profilePictureUrl && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Current:</p>
                    <img src={existingFiles.profilePictureUrl} alt="Current Profile" className="w-20 h-20 rounded-full object-cover" />
                  </div>
                )}
                <input type="file" id="profilePicture" name="profilePicture" accept="image/*" onChange={handleFileChange('profilePicture')} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
                 {form.profilePicture && <p className="mt-2 text-green-600 dark:text-green-400 text-sm">Selected: {form.profilePicture.name}</p>}
              </div>
               <div>
                <label htmlFor="skillDemo" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Update Skill Demo (Video or Image)</label>
                {existingFiles.skillDemoUrl && (
                   <div className="mb-2">
                     <p className="text-sm text-gray-600 dark:text-gray-300">Current:</p>
                     {existingFiles.skillDemoType === 'video' ? (
                       <video controls src={existingFiles.skillDemoUrl} className="w-full max-h-40 object-cover rounded" />
                     ) : (
                       <img src={existingFiles.skillDemoUrl} alt="Current Skill Demo" className="w-full max-h-40 object-cover rounded" />
                     )}
                   </div>
                )}
                <input type="file" id="skillDemo" name="skillDemo" accept="video/*,image/*" onChange={handleFileChange('skillDemo')} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" />
                 {form.skillDemo && <p className="mt-2 text-green-600 dark:text-green-400 text-sm">Selected: {form.skillDemo.name}</p>}
              </div>
               {(form.skillDemo || form.skillDemoTitle || form.skillDemoDescription || existingFiles.skillDemoUrl) && ( // Show fields if a file is selected or existing data exists OR existing skill demo exists
                 <>
                   <div>
                     <label htmlFor="skillDemoTitle" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Title for Demo</label>
                     <input type="text" id="skillDemoTitle" name="skillDemoTitle" value={form.skillDemoTitle} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959]" placeholder="e.g. My Guitar Solo" />
                   </div>
                  <div>
                    <label htmlFor="skillDemoDescription" className="block text-[#384959] dark:text-[#F7FAFC] text-sm font-semibold mb-2">Description for Demo</label>
                    <textarea id="skillDemoDescription" name="skillDemoDescription" value={form.skillDemoDescription} onChange={handleChange} className="shadow appearance-none border border-[#6A89A7] dark:border-[#F7FAFC] rounded w-full py-2 px-3 text-[#384959] dark:text-[#F7FAFC] leading-tight focus:outline-none focus:shadow-outline dark:bg-[#384959] h-24" placeholder="Briefly describe your demo"></textarea>
                  </div>
                 </>
               )}


              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button type="button" onClick={handleCancel} className="w-1/2 mr-2 py-3 rounded-full border border-[#6A89A7] dark:border-[#F7FAFC] text-[#384959] dark:text-[#F7FAFC] font-medium bg-[#F7FAFC] hover:bg-gray-100 transition dark:bg-[#384959] dark:hover:bg-opacity-90">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="w-1/2 ml-2 py-3 rounded-full border border-[#6A89A7] dark:border-[#F7FAFC] text-[#384959] dark:text-[#F7FAFC] font-medium bg-[#88BDF2] hover:bg-[#6A89A7] transition disabled:opacity-50 dark:bg-[#F7B267] dark:hover:bg-opacity-90">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
       </div>
    </div>
  );
} 