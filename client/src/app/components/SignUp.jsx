'use client';

import React, { useState, useContext, use } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/authContext'; // Add this line

const yearOptions = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  'alumni/graduate',
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
 const { setEmail } = useContext(AuthContext);
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
    
  });
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [skillsError, setSkillsError] = useState('');

  // Progress values for each step (now 6 steps)
  const stepProgress = [Math.round((1/6)*100), Math.round((2/6)*100), Math.round((3/6)*100), Math.round((4/6)*100), Math.round((5/6)*100), 100];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleStartSwapping = () => {
  setEmail(form.email);
  localStorage.setItem('loggedInEmail', form.email); // Add this line
  router.push('/swipe');
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
    if (step === 1) {
      // Validate all fields
      const errors = {};
      if (!form.firstName) errors.firstName = 'First name is required';
      if (!form.lastName) errors.lastName = 'Last name is required';
      if (!form.age) errors.age = 'Age is required';
      if (!form.year) errors.year = 'Year in school is required';
      setFieldErrors(errors);
      if (Object.keys(errors).length > 0) return;
      setFieldErrors({});
      setStep(2);
      setProgress(stepProgress[1]);
      return;
    }
    if (step === 2) {
      if (!form.email) {
        setError('Email is required');
        return;
      }
      setStep(3);
      setProgress(stepProgress[2]);
      return;
    }
    if (step === 3) {
      // Skills validation
      if (form.skillsOffered.length === 0 || form.skillsWanted.length === 0) {
        setSkillsError('Please add at least one skill you are offering and one you are looking for.');
        return;
      }
      setSkillsError('');
      setStep(4);
      setProgress(stepProgress[3]);
      return;
    }
    if (step === 4) {
      setStep(5);
      setProgress(stepProgress[4]);
      return;
    }
    if (step === 5) {
      setStep(6);
      setProgress(stepProgress[5]);
      return;
    }
    if (step === 6) {
      setLoading(true);
      try {
        setSuccess(true);
        setProgress(100);
        setFinished(true);
      } catch (err) {
        setError('Submission failed');
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  // Add skip for now for talents showcase
  const handleSkipTalents = () => {
    setStep(5);
    setProgress(stepProgress[4]);
  };

  // Add skip for now for social media step
  const handleSkipSocial = () => {
    setStep(5);
    setProgress(stepProgress[4]);
  };

  // Navigation/back logic for each step
  // Back button handlers for each step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setProgress(stepProgress[step - 2]);
      setSkillsError('');
    }
  };

  return (
    <div className="w-[393px] h-[852px] bg-white rounded-none shadow-none flex flex-col justify-between mx-auto p-0" style={{ minHeight: '852px', minWidth: '393px' }}>
      {/* Progress Bar with Fraction */}
      <div className="w-full flex flex-col items-center mb-6 pt-4">
        <span className="mb-1 text-sm font-semibold text-[#384959]">{progress}%</span>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-start overflow-y-auto px-6 pb-4">
        {finished ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            {/* Animated green checkmark */}
            <svg className="mb-6 animate-bounce" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#22c55e" fillOpacity="0.2"/>
              <circle cx="40" cy="40" r="32" fill="#22c55e" />
              <path d="M28 42L37 51L54 34" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="text-3xl font-bold text-green-600 mb-2">You're In, Anteater!</h2>
            <p className="mb-8 text-gray-700 text-lg">Welcome to ZotSwap, We'll start matching you with other UCI students who are ready to swap skills!</p>
            <div className="flex w-full gap-2 justify-center mb-4">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50"
                onClick={() => { setFinished(false); setStep(5); setProgress(stepProgress[4]); }}
                type="button"
              >
                Back
              </button>
              <button 
  className="flex-[2] px-8 py-3 rounded-full bg-[#88BDF2] text-[#384959] font-semibold text-lg shadow hover:bg-[#6A89A7] transition"
  onClick={handleStartSwapping}
  type="button"
>
  Start Swapping
</button>
            </div>
          </div>
        ) : step === 5 ? (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">Social Media</h2>
            <label className="font-semibold mb-1">Social Media <span className="text-gray-400">(optional)</span></label>
            <div className="mb-2 flex items-center">
              <span className="mr-2">Instagram</span>
              <input
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <span className="ml-2 text-2xl">📸</span>
            </div>
            <div className="mb-2 flex items-center">
              <span className="mr-2">Snapchat</span>
              <input
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="snapchat"
                value={form.snapchat}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <span className="ml-2 text-2xl">👻</span>
            </div>
            <div className="mb-2 flex items-center">
              <span className="mr-2">TikTok</span>
              <input
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="tiktok"
                value={form.tiktok}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <span className="ml-2 text-2xl">🎵</span>
            </div>
            <div className="mb-2 flex items-center">
              <span className="mr-2">Discord</span>
              <input
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="discord"
                value={form.discord}
                onChange={handleChange}
                placeholder="username#1234"
                disabled={loading}
              />
              <span className="ml-2 text-2xl">💬</span>
            </div>
            <div className="mb-4 flex items-center">
              <span className="mr-2">X (Twitter)</span>
              <input
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                placeholder="@username"
                disabled={loading}
              />
              <span className="ml-2 text-2xl">🐦</span>
            </div>
            <div className="mb-2 text-center text-gray-500 text-xs">You can edit this later in your profile.</div>
            <div className="flex w-full gap-2 mt-4">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50"
                onClick={handleBack}
                type="button"
                disabled={loading}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#88BDF2] hover:bg-[#6A89A7] transition flex items-center justify-center disabled:opacity-50"
                onClick={() => {
                  setFinished(true);
                  setProgress(100);
                }}
                type="button"
                disabled={loading}
              >
                Finished <span className="ml-2 text-xl">✔️</span>
              </button>
            </div>
          </>
        ) : step === 4 ? (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">Show Off Your Talents!</h2>
            <label className="font-semibold mb-1">Upload a Video <span className="text-gray-400">(optional, .mp4, max 30 sec)</span></label>
            <div className="mb-4 flex flex-col items-center">
              <input
                type="file"
                accept="video/mp4"
                name="video"
                onChange={handleFileChange}
                disabled={loading}
                className="mb-2"
              />
              {videoPreview && (
                <video src={videoPreview} controls className="w-64 h-40 object-contain border border-blue-200 rounded" />
              )}
            </div>
            <label className="font-semibold mb-1">Upload an Image <span className="text-gray-400">(optional)</span></label>
            <div className="mb-4 flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
                disabled={loading}
                className="mb-2"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-64 h-40 object-contain border border-blue-200 rounded" />
              )}
            </div>
            <div className="mb-8 text-center text-gray-600 text-sm">
              "Adding a short video or image will help fellow anteaters get to know you faster!"
            </div>
            <div className="flex w-full gap-2 mt-4">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50"
                onClick={handleBack}
                type="button"
                disabled={loading}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 rounded-full border border-gray-300 text-gray-500 font-medium bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                onClick={handleSkipTalents}
                type="button"
                disabled={loading}
              >
                Skip for now
              </button>
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#88BDF2] hover:bg-[#6A89A7] transition disabled:opacity-50"
                onClick={handleNext}
                type="button"
                disabled={loading}
              >
                Next <span className="ml-2">→</span>
              </button>
            </div>
          </>
        ) : step === 3 ? (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">What are you hoping to swap?</h2>
            <div className="mb-6">
              <div className="font-bold text-lg mb-2">Skills You're Offering</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skillsOffered.map((skill, idx) => (
                  <span key={idx} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                    <button type="button" className="ml-2 text-blue-500 hover:text-blue-800" onClick={() => removeSkill('skillsOffered', idx)}>&times;</button>
                  </span>
                ))}
              </div>
              <input
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="skillInputOffered"
                value={form.skillInputOffered}
                onChange={e => setForm(prev => ({ ...prev, skillInputOffered: e.target.value }))}
                onKeyDown={e => handleSkillInput(e, 'skillsOffered')}
                placeholder="Type a skill and press Enter"
                disabled={loading || form.skillsOffered.length >= 5}
              />
            </div>
            <div className="mb-8">
              <div className="font-bold text-lg mb-2">Skills You're Looking For</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skillsWanted.map((skill, idx) => (
                  <span key={idx} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                    <button type="button" className="ml-2 text-blue-500 hover:text-blue-800" onClick={() => removeSkill('skillsWanted', idx)}>&times;</button>
                  </span>
                ))}
              </div>
              <input
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="skillInputWanted"
                value={form.skillInputWanted}
                onChange={e => setForm(prev => ({ ...prev, skillInputWanted: e.target.value }))}
                onKeyDown={e => handleSkillInput(e, 'skillsWanted')}
                placeholder="Type a skill and press Enter"
                disabled={loading || form.skillsWanted.length >= 5}
              />
            </div>
            {skillsError && <div className="mb-4 text-red-500 text-center animate-pulse">{skillsError}</div>}
            <div className="flex w-full gap-2 mt-4">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50"
                onClick={handleBack}
                type="button"
                disabled={loading}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#88BDF2] hover:bg-[#6A89A7] transition flex items-center justify-center disabled:opacity-50"
                onClick={handleNext}
                type="button"
                disabled={loading}
              >
                Next <span className="ml-2">→</span>
              </button>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">Where can people contact you?</h2>
            <label className="font-semibold mb-1">Location</label>
            <select
              className="mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
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
            <label className="font-semibold mb-1">Phone Number <span className="text-gray-400">(optional)</span></label>
            <div className="flex mb-4 gap-2">
              <select
                className="px-2 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="(XXX) XXX-XXXX"
                maxLength={14}
                disabled={loading}
              />
            </div>
            <label className="font-semibold mb-1">Email <span className="text-gray-400">(required)</span></label>
            <input
              className="mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              type="email"
              required
              disabled={loading}
            />
            {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
            {success && <div className="text-green-600 mb-2 text-center">Registration successful!</div>}
            <div className="flex w-full gap-2">
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-white hover:bg-gray-100 transition disabled:opacity-50"
                onClick={() => { setStep(1); setProgress(stepProgress[0]); }}
                type="button"
                disabled={loading}
              >
                Back
              </button>
              <button
                className="flex-1 py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#88BDF2] hover:bg-[#6A89A7] transition disabled:opacity-50"
                onClick={handleNext}
                type="button"
                disabled={loading}
              >
                Next <span className="ml-2">→</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">Let's Get You Started!</h2>
            <label className="font-semibold mb-1">First Name</label>
            <input
              className={`mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${fieldErrors.firstName ? 'border-red-500' : ''}`}
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              disabled={loading}
            />
            {fieldErrors.firstName && <div className="mb-3 text-red-500 text-sm animate-pulse">{fieldErrors.firstName}</div>}
            <label className="font-semibold mb-1">Last Name</label>
            <input
              className={`mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${fieldErrors.lastName ? 'border-red-500' : ''}`}
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              disabled={loading}
            />
            {fieldErrors.lastName && <div className="mb-3 text-red-500 text-sm animate-pulse">{fieldErrors.lastName}</div>}
            <label className="font-semibold mb-1">Age</label>
            <input
              className={`mb-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${fieldErrors.age ? 'border-red-500' : ''}`}
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter your age"
              type="number"
              min="0"
              disabled={loading}
            />
            {fieldErrors.age && <div className="mb-3 text-red-500 text-sm animate-pulse">{fieldErrors.age}</div>}
            <label className="font-semibold mb-1">Year in School</label>
            <select
              className={`mb-8 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${fieldErrors.year ? 'border-red-500' : ''}`}
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
            {fieldErrors.year && <div className="mb-3 text-red-500 text-sm animate-pulse">{fieldErrors.year}</div>}
            <button
              className="w-full py-3 rounded-full border border-[#6A89A7] text-[#384959] font-medium bg-[#88BDF2] hover:bg-[#6A89A7] transition flex items-center justify-center disabled:opacity-50"
              onClick={handleNext}
              type="button"
              disabled={loading}
            >
              Next <span className="ml-2">→</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}