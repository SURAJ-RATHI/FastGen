import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import axios from "axios"

const SignUpPage = () => {
  const { signInWithGoogle, signInWithEmail, isSignedIn, isLoading } = useAuth()
  const [showManualForm, setShowManualForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Initialize Google OAuth
  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '887137562653-q092j43greip16g706ggmb0006n3s5rr.apps.googleusercontent.com',
          callback: handleGoogleSignIn
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large', width: 400 }
        );
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Redirect if already signed in
  if (isSignedIn && !isLoading) {
    navigate('/onBoard')
    return null
  }

  const handleGoogleSignIn = async (response) => {
    try {
      const result = await signInWithGoogle(response.credential);
      if (result.success) {
        navigate('/onBoard');
      } else {
        setError(result.error || 'Google sign in failed');
      }
    } catch {
      setError('Google sign in failed. Please try again.');
    }
  };

  const handleManualSignUp = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Create user in database
      const response = await axios.post(`${import.meta.env.VITE_APP_BE_BASEURL}/user/manual-signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      if (response.data.success) {
        // Sign in the user with the returned token
        const result = await signInWithEmail(formData.email, formData.password);
        if (result.success) {
          navigate('/onBoard');
        } else {
          setError(result.error || 'Sign in failed after signup');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/bg2.svg')] bg-no-repeat bg-cover text-white">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg2.svg')] bg-no-repeat bg-cover text-white">
      <div className="w-full max-w-md bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Welcome to FastGen ✨</h2>
        <p className="text-gray-300 mb-6">Create your account to get started</p>

        {!showManualForm ? (
          <>
            <div id="google-signin-button" className="w-full mt-4"></div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/40 text-gray-400">or</span>
              </div>
            </div>

            <button
              onClick={() => setShowManualForm(true)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Sign up with Email
            </button>
          </>
        ) : (
          <form onSubmit={handleManualSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-gray-950 text-white rounded-lg border border-gray-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                required
                minLength={8}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Back to Google Sign Up
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate('/signIn')}
            className="text-blue-400 hover:underline cursor-pointer"
            disabled={isSubmitting}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage