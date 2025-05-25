'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/authContext'; // Add this line

const yearOptions = [
  'Freshman',
  'Sophomore',
  'Junior',
  'Senior',
  '5th+ Year',
  'Alumni/Graduate',
];

const locationOptions = [
  'UCI Campus',
  'Irvine',
  'Newport Beach',
  'Costa Mesa',
];

// Phone formatting helper
const countryCodes = [
  { code: '+1', label: 'US/Canada' },
  { code: '+44', label: 'UK' },
  { code: '+61', label: 'Australia' },
  { code: '+81', label: 'Japan' },
  { code: '+82', label: 'Korea' },
  { code: '+86', label: 'China' },
  // Add more as needed
];

function formatPhoneNumber(value) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export default function SignUp() {
  const router = useRouter();
  const { setUserEmail } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [finished, setFinished] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    year: '',
    location: '',
    phone: '',
    email: '',
    instagram: '',
    snapchat: '',
    tiktok: '',
    discord: '',
    twitter: '',
    // Step 3 fields
    talents: '',
    video: null,
    image: null,
    // Add to form state
    skillsOffered: [],
    skillsWanted: [],
    skillInputOffered: '',
    skillInputWanted: '',
    countryCode: '+1',
    password: '',
    confirmPassword: '',
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [skillsError, setSkillsError] = useState('');

  // Progress values for each step (now 7 steps)
  const stepProgress = [
    Math.round((1/7)*100), // Step 1: Basic Info
    Math.round((2/7)*100), // Step 2: Password
    Math.round((3/7)*100), // Step 3: Contact Info
    Math.round((4/7)*100), // Step 4: Skills
    Math.round((5/7)*100), // Step 5: Talents
    Math.round((6/7)*100), // Step 6: Social Media
    100, // Step 7: Finished
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadData = async (formValues) => {
    if (loading) return; // Prevent double submission
  setLoading(true);
  setError('');
  setSuccess(false);

  try {
    // Format the data according to backend requirements
    const userData = {
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        age: parseInt(formValues.age),
        location: formValues.location.trim(),
        year: formValues.year.trim(),
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
        phone: formValues.phone ? `${formValues.countryCode}${formValues.phone.replace(/\D/g, '')}` : undefined,
        instagram: formValues.instagram || '',
        snapchat: formValues.snapchat || '',
        tiktok: formValues.tiktok || '',
        discord: formValues.discord || '',
        twitter: formValues.twitter || '',
        skillsWanted: formValues.skillsWanted,
        skillsOffered: formValues.skillsOffered
      };

      // Debug log
      console.log('Sending user data:', userData);

    const response = await fetch('http://localhost:4000/api/users', {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    
    const responseData = await response.json();

    if (!response.ok) {
        if (response.status === 409) {
          throw new Error('This email address is already registered. Please use a different email or try logging in.');
        } else {
          throw new Error(responseData.error || 'Signup failed. Please check all required fields.');
        }
      }

      console.log('Success:', responseData);
    
    // Use AuthContext to set user email after successful signup
    setUserEmail(responseData.email);
      setSuccess(true);

    // Redirect to the main app page after successful signup
    router.push('/swipe');

      return responseData;
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message);
      throw error;
  } finally {
    setLoading(false);
  }
};

  // Simplified handleStartSwapping to just call uploadData
  const handleStartSwapping = async () => {
    try {
      await uploadData(form);
    } catch (error) {
      // Error is already handled in uploadData
      console.error('Start swapping failed:', error);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (name === 'video') {
      if (file.type !== 'video/mp4') {
        setError('Only .mp4 videos are allowed');
        return;
      }
      // Check video duration (max 30 sec)
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          setError('Video must be 30 seconds or less');
          setForm((prev) => ({ ...prev, video: null }));
          setVideoPreview(null);
        } else {
          setError('');
          setForm((prev) => ({ ...prev, video: file }));
          setVideoPreview(URL.createObjectURL(file));
        }
      };
      video.src = URL.createObjectURL(file);
    } else if (name === 'image') {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      setError('');
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add step for skills swap
  const handleSkillInput = (e, type) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      if (form[type].length >= 5) {
        setSkillsError('You can add up to 5 skills only.');
        return;
      }
      setForm((prev) => ({
        ...prev,
        [type]: [...prev[type], e.target.value.trim()],
        [type === 'skillsOffered' ? 'skillInputOffered' : 'skillInputWanted']: '',
      }));
      setSkillsError('');
      e.preventDefault();
    }
  };
  const removeSkill = (type, idx) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== idx),
    }));
    setSkillsError('');
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, phone: formatPhoneNumber(raw) }));
  };

  const handleCountryCodeChange = (e) => {
    setForm((prev) => ({ ...prev, countryCode: e.target.value }));
  };

  const handleNext = async () => {
    setError('');
    setSuccess(false);
    setFieldErrors({}); // Clear previous errors

    if (step === 1) {
      // Validate Step 1 fields
      const errors = {};
      if (!form.firstName) errors.firstName = 'First name is required';
      if (!form.lastName) errors.lastName = 'Last name is required';
      if (!form.age) errors.age = 'Age is required';
      if (!form.year) errors.year = 'Year in school is required';
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setStep(2);
      setProgress(stepProgress[1]);
      return;
    }
    if (step === 2) {
      // Validate Step 2 (Password) fields
      const errors = {};
      if (!form.password) errors.password = 'Password is required';
      if (!form.confirmPassword) errors.confirmPassword = 'Confirm password is required';
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }
      if (form.password && form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
      }

      if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
        return;
      }
      setStep(3);
      setProgress(stepProgress[2]);
      return;
    }
    if (step === 3) {
      // Validate Step 3 (Contact Info) fields
      if (!form.email) {
        setError('Email is required');
        return;
      }
      setStep(4);
      setProgress(stepProgress[3]);
      return;
    }
    if (step === 4) {
      // Skills validation (Step 4)
      if (form.skillsOffered.length === 0 || form.skillsWanted.length === 0) {
        setSkillsError('Please add at least one skill you are offering and one you are looking for.');
        return;
      }
      setSkillsError('');
      setStep(5);
      setProgress(stepProgress[4]);
      return;
    }
    if (step === 5) {
      // Talent Showcase (Step 5) - No validation needed
      setStep(6);
      setProgress(stepProgress[5]);
      return;
    }
    if (step === 6) {
      // Social Media (Step 6) - No validation needed
      setStep(7);
      setProgress(stepProgress[6]);
      return;
    }
    if (step === 7) {
      // Final step - Trigger upload
      setLoading(true);
      try {
        await uploadData(form);
        setSuccess(true);
        setProgress(100);
        setFinished(true);
      } catch (err) {
        // Error handled in uploadData
        setFinished(false); // Stay on the finished screen with error
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  // Add skip for now for talents showcase (Skip to Step 6 - Social Media)
  const handleSkipTalents = () => {
    setStep(6);
    setProgress(stepProgress[5]);
  };

  // Add skip for now for social media step (Skip to Step 7 - Finished)
  const handleSkipSocial = () => {
    setStep(7);
    setProgress(stepProgress[6]);
  };

  // Navigation/back logic for each step
  // Back button handlers for each step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(stepProgress[step - 2]);
      setSkillsError('');
      setFieldErrors({}); // Clear errors when going back
    }
  };

  // Add cleanup on component unmount
  React.useEffect(() => {
    return () => {
      setLoading(false);
      setError('');
      setSuccess(false);
    };
  }, []);

  return (
    <div className="w-[393px] h-[852px] bg-[#F7FAFC] dark:bg-gray-900 rounded-none shadow-none flex flex-col justify-between mx-auto p-0" style={{ minHeight: '852px', minWidth: '393px' }}>
      {/* Progress Bar with Fraction */}
      <div className="w-full flex flex-col items-center mb-6 pt-4 px-6">
        <span className="mb-1 text-sm font-semibold text-[#384959] dark:text-gray-300">{progress}%</span>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {/* Scrollable content container - takes remaining height */}
      <div className="flex-1 flex flex-col justify-center overflow-y-auto px-6 pb-2">
        {finished ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            {/* Animated green checkmark */}
            <svg className="mb-6 animate-bounce" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#22c55e" fillOpacity="0.2"/>
              <circle cx="40" cy="40" r="32" fill="#22c55e" />
              <path d="M28 42L37 51L54 34" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-3xl font-bold text-green-600 mb-2">You're In, Anteater!</h2>
            <p className="mb-8 text-gray-700 dark:text-gray-300 text-lg">Welcome to ZotSwap, We'll start matching you with other UCI students who are ready to swap skills!</p>
            {/* Buttons are now in the fixed bottom container */}
          </div>
        ) : step === 6 ? ( // Social Media step
          <>
            <h2 className="text-2xl font-bold mb-8 text-center text-[#384959] dark:text-white">Social Media</h2>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Instagram <span className="text-gray-400">(optional)</span></label>
            <div className="mb-4 flex items-center">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="instagram"
                value={form.instagram || ''}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <img src="/instagram.png" alt="Instagram" className="ml-2 w-6 h-6 object-contain" />
            </div>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Snapchat <span className="text-gray-400">(optional)</span></label>
            <div className="mb-4 flex items-center">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="snapchat"
                value={form.snapchat || ''}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <img src="/snapchat.png" alt="Snapchat" className="ml-2 w-6 h-6 object-contain" />
            </div>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">TikTok <span className="text-gray-400">(optional)</span></label>
            <div className="mb-4 flex items-center">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="tiktok"
                value={form.tiktok || ''}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <img src="/tiktok.png" alt="TikTok" className="ml-2 w-6 h-6 object-contain" />
            </div>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Discord <span className="text-gray-400">(optional)</span></label>
            <div className="mb-4 flex items-center">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="discord"
                value={form.discord || ''}
                onChange={handleChange}
                placeholder="username#1234"
                disabled={loading}
              />
              <img src="/discord.png" alt="Discord" className="ml-2 w-6 h-6 object-contain" />
            </div>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">X (Twitter) <span className="text-gray-400">(optional)</span></label>
            <div className="mb-4 flex items-center">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="twitter"
                value={form.twitter || ''}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <img src="/twitter.png" alt="Twitter" className="ml-2 w-6 h-6 object-contain" />
            </div>
            <div className="mb-2 text-center text-gray-500 dark:text-gray-400 text-xs">You can edit this later in your profile.</div>
            {/* Buttons are now in the fixed bottom container */}
          </>
        ) : step === 5 ? ( // Talent Showcase step
          <>
            <h2 className="text-2xl font-bold mb-8 text-center text-[#384959] dark:text-white">Show Off Your Talents!</h2>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Upload a Video <span className="text-gray-400">(optional, .mp4, max 30 sec)</span></label>
            <div className="mb-4 flex flex-col items-center">
              <input
                type="file"
                accept="video/mp4"
                name="video"
                onChange={handleFileChange}
                disabled={loading}
                className="mb-2 text-[#384959] dark:text-gray-200"
              />
              {videoPreview && (
                <video src={videoPreview} controls className="w-64 h-40 object-contain border border-blue-200 dark:border-blue-700 rounded" />
              )}
            </div>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Upload an Image <span className="text-gray-400">(optional)</span></label>
            <div className="mb-4 flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
                disabled={loading}
                className="mb-2 text-[#384959] dark:text-gray-200"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-64 h-40 object-contain border border-blue-200 dark:border-blue-700 rounded" />
              )}
            </div>
            <div className="mb-8 text-center text-gray-600 dark:text-gray-400 text-sm">
              "Adding a short video or image will help fellow Anteaters get to know you faster!"
            </div>
            {/* Buttons are now in the fixed bottom container */}
          </>
        ) : step === 4 ? ( // Skills step
          <>
            <h2 className="text-2xl font-bold mb-8 text-center text-[#384959] dark:text-white">What are you hoping to swap?</h2>
            <div className="mb-6">
              <div className="font-bold text-lg mb-3 text-[#384959] dark:text-gray-300">Skills You're Offering <span className="text-red-500">*</span></div>
              <div className="flex flex-wrap gap-2 mb-3 justify-center">
                {form.skillsOffered.map((skill, idx) => (
                  <span key={idx} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-800 dark:text-blue-200">
                    {skill}
                    <button type="button" className="ml-2 text-blue-500 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100" onClick={() => removeSkill('skillsOffered', idx)}>&times;</button>
                  </span>
                ))}
              </div>
              <input
                className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="skillInputOffered"
                value={form.skillInputOffered || ''}
                onChange={e => setForm(prev => ({ ...prev, skillInputOffered: e.target.value }))}
                onKeyDown={e => handleSkillInput(e, 'skillsOffered')}
                placeholder="Type a skill and press Enter"
                disabled={loading || form.skillsOffered.length >= 5}
              />
            </div>
            <div className="mb-8">
              <div className="font-bold text-lg mb-3 text-[#384959] dark:text-gray-300">Skills You're Looking For <span className="text-red-500">*</span></div>
              <div className="flex flex-wrap gap-2 mb-3 justify-center">
                {form.skillsWanted.map((skill, idx) => (
                  <span key={idx} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium dark:bg-blue-800 dark:text-blue-200">
                    {skill}
                    <button type="button" className="ml-2 text-blue-500 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100" onClick={() => removeSkill('skillsWanted', idx)}>&times;</button>
                  </span>
                ))}
              </div>
              <input
                className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="skillInputWanted"
                value={form.skillInputWanted}
                onChange={e => setForm(prev => ({ ...prev, skillInputWanted: e.target.value }))}
                onKeyDown={e => handleSkillInput(e, 'skillsWanted')}
                placeholder="Type a skill and press Enter"
                disabled={loading || form.skillsWanted.length >= 5}
              />
            </div>
            {skillsError && <div className="mb-4 text-red-500 text-center animate-pulse">{skillsError}</div>}
            {/* Buttons are now in the fixed bottom container */}
          </>
        ) : step === 3 ? ( // Contact Info step
          <>
            <h2 className="text-2xl font-bold mb-8 text-center text-[#384959] dark:text-white">Where can people contact you?</h2>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Location</label>
            <select
              className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="" disabled>Select location</option>
              {locationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Phone Number <span className="text-gray-400">(optional)</span></label>
            <div className="flex mb-4 gap-2">
              <select
                className="px-2 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                value={form.countryCode}
                onChange={handleCountryCodeChange}
                disabled={loading}
                style={{ minWidth: 90 }}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} {c.label}</option>
                ))}
              </select>
              <input
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
                name="phone"
                value={form.phone || ''}
                onChange={handlePhoneChange}
                placeholder="(XXX) XXX-XXXX"
                maxLength={14}
                disabled={loading}
              />
            </div>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Email <span className="text-red-500">*</span></label>
            <input
              className="mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200"
              name="email"
              value={form.email || ''}
              onChange={handleChange}
              placeholder="Enter your email"
              type="email"
              required
              disabled={loading}
            />
            {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
            {success && <div className="text-green-600 mb-2 text-center">Registration successful!</div>}
            {/* Buttons are now in the fixed bottom container */}
          </>
        ) : step === 2 ? ( // Password step
          <>
             <h2 className="text-2xl font-bold mb-8 text-center text-[#384959] dark:text-white">Set Your Password</h2>
             <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Password <span className="text-red-500">*</span></label>
             <input
               className={`mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200 ${fieldErrors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
               name="password"
               value={form.password || ''}
               onChange={handleChange}
               placeholder="Enter your password"
               type="password"
                disabled={loading}
             />
             {fieldErrors.password && <div className="mb-4 text-red-500 dark:text-red-400 text-sm animate-pulse">{fieldErrors.password}</div>}
             <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Confirm Password <span className="text-red-500">*</span></label>
             <input
               className={`mb-8 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200 ${fieldErrors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
               name="confirmPassword"
               value={form.confirmPassword || ''}
               onChange={handleChange}
               placeholder="Confirm your password"
               type="password"
                disabled={loading}
             />
              {fieldErrors.confirmPassword && <div className="mb-8 text-red-500 dark:text-red-400 text-sm animate-pulse">{fieldErrors.confirmPassword}</div>}
             {/* Buttons are now in the fixed bottom container */}
          </>
        ) : ( // Step 1: Basic Info
          <>
            <h2 className="text-2xl font-bold mb-8 text-center text-[#384959] dark:text-white">Let's Get You Started!</h2>
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">First Name <span className="text-red-500">*</span></label>
            <input
              className={`mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200 ${fieldErrors.firstName ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
              name="firstName"
              value={form.firstName || ''}
              onChange={handleChange}
              placeholder="Enter your first name"
              disabled={loading}
            />
            {fieldErrors.firstName && <div className="mb-4 text-red-500 dark:text-red-400 text-sm animate-pulse">{fieldErrors.firstName}</div>}
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Last Name <span className="text-red-500">*</span></label>
            <input
              className={`mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200 ${fieldErrors.lastName ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
              name="lastName"
              value={form.lastName || ''}
              onChange={handleChange}
              placeholder="Enter your last name"
              disabled={loading}
            />
            {fieldErrors.lastName && <div className="mb-4 text-red-500 dark:text-red-400 text-sm animate-pulse">{fieldErrors.lastName}</div>}
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Age <span className="text-red-500">*</span></label>
            <input
              className={`mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200 ${fieldErrors.age ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
              name="age"
              value={form.age || ''}
              onChange={handleChange}
              placeholder="Enter your age"
              type="number"
              min="0"
              disabled={loading}
            />
            {fieldErrors.age && <div className="mb-4 text-red-500 dark:text-red-400 text-sm animate-pulse">{fieldErrors.age}</div>}
            <label className="font-semibold mb-2 text-[#384959] dark:text-gray-300">Year in School <span className="text-red-500">*</span></label>
            <select
              className={`mb-8 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-700 bg-white dark:bg-gray-700 text-[#384959] dark:text-gray-200 ${fieldErrors.year ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'}`}
              name="year"
              value={form.year}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="" disabled>Select year</option>
              {yearOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {fieldErrors.year && <div className="mb-8 text-red-500 dark:text-red-400 text-sm animate-pulse">{fieldErrors.year}</div>}
            {/* Buttons are now in the fixed bottom container */}
          </>
        )}
      </div>
      {/* Fixed bottom button container */}
      <div className="w-full px-6 pb-6 bg-[#F7FAFC] dark:bg-gray-900">
        {finished ? (
           <div className="flex w-full gap-2 justify-center">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] dark:text-gray-300 font-medium bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                onClick={() => { setFinished(false); setStep(6); setProgress(stepProgress[5]); }}
                type="button"
              >
                Back
              </button>
              <button
                className="flex-[2] px-8 py-3 rounded-full bg-[#88BDF2] text-[#384959] dark:text-gray-900 font-semibold text-lg shadow hover:bg-[#6A89A7] dark:hover:bg-[#506b84] transition disabled:opacity-50"
                onClick={handleStartSwapping}
                type="button"
              >
                Start Swapping
              </button>
            </div>
        ) : step === 6 ? (
           <div className="flex w-full gap-2 mt-4">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] dark:text-gray-300 font-medium bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                onClick={handleBack}
                type="button"
                disabled={loading}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] dark:text-gray-900 font-medium bg-[#88BDF2] hover:bg-[#6A89A7] dark:hover:bg-[#506b84] transition flex items-center justify-center disabled:opacity-50"
                onClick={() => {
                  setFinished(true);
                  setProgress(100);
                  uploadData(form);
                }}
                type="button"
                disabled={loading}
              >
                Finished <span className="ml-2 text-xl">✔️</span>
              </button>
            </div>
        ) : step === 5 ? (
          <div className="flex w-full gap-2 mt-4">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] dark:text-gray-300 font-medium bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                onClick={handleBack}
                type="button"
                disabled={loading}
              >
                Back
              </button>
              {(!form.video && !form.image) && (
                <button
                  className="flex-1 py-3 rounded-full bg-[#F7B267] text-[#384959] dark:bg-yellow-600 dark:text-gray-900 font-medium hover:bg-opacity-90 transition disabled:opacity-50"
                  onClick={handleSkipTalents}
                  type="button"
                  disabled={loading}
                >
                  Skip for now
                </button>
              )}
              {(form.video || form.image) && (
                <button
                  className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] dark:text-gray-900 font-medium bg-[#88BDF2] hover:bg-[#6A89A7] dark:hover:bg-[#506b84] transition disabled:opacity-50"
                  onClick={handleNext}
                  type="button"
              disabled={loading}
                >
                  Next <span className="ml-2">→</span>
                </button>
              )}
            </div>
        ) : (
          <div className="flex w-full gap-2 mt-4">
              {step > 1 && (
                 <button
                   className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] dark:text-gray-300 font-medium bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50"
                   onClick={handleBack}
                   type="button"
              disabled={loading}
                 >
                   Back
                 </button>
              )}
              {/* Adjust flex-basis to account for the presence of the back button */}
            <button
                className={`${step > 1 ? 'flex-1' : 'flex-auto'} py-3 rounded-full border border-[#6A89A7] text-[#384959] dark:text-gray-900 font-medium bg-[#88BDF2] hover:bg-[#6A89A7] dark:hover:bg-[#506b84] transition disabled:opacity-50`}
              onClick={handleNext}
              type="button"
              disabled={loading}
            >
              Next <span className="ml-2">→</span>
            </button>
            </div>
        )}
      </div>
    </div>
  );
}