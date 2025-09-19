import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useEffect, useState } from "react";

const SignInPage = () => {
  const { signInWithGoogle, signInWithEmail, isSignedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSignedIn && !isLoading) {
      navigate("/main");
    }
  }, [isSignedIn, isLoading, navigate]);

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
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleGoogleSignIn = async (response) => {
    try {
      const result = await signInWithGoogle(response.credential);
      if (result.success) {
        navigate("/main");
      } else {
        setError(result.error || "Google sign in failed");
      }
    } catch {
      setError("Google sign in failed. Please try again.");
    }
  };

  const handleManualSignIn = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await signInWithEmail(formData.email, formData.password);
      if (result.success) {
        navigate("/main");
      } else {
        setError(result.error || "Sign in failed");
      }
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = () => {
    navigate("/signUp");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[url('/bg2.svg')] bg-no-repeat bg-cover text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-[url('/bg2.svg')] bg-no-repeat bg-cover">
      <div className="min-h-screen flex items-center justify-center bg-transparent text-white px-4 py-8">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Welcome Back 👋</h2>
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            Sign in to continue to FastGen
          </p>

          {!showManualForm ? (
            <>
              <div id="google-signin-button" className="w-full mt-4 google-button-container"></div>

              <div className="relative my-4 sm:my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/40 text-gray-400">or</span>
                </div>
              </div>

              <button
                onClick={() => setShowManualForm(true)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                Sign in with Email
              </button>
            </>
          ) : (
            <form onSubmit={handleManualSignIn} className="space-y-3 sm:space-y-4">
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
                />
              </div>

              {error && <div className="text-red-400 text-sm text-center">{error}</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Back to Google Sign In
              </button>
            </form>
          )}

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-400">
            Don't have an account?{" "}
            <button onClick={handleSignUp} className="text-blue-400 cursor-pointer hover:underline">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
