import HomeHeader from "./HomeHeader";
import { useState, useEffect } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear any existing status messages when component mounts
  useEffect(() => {
    setSubmitStatus('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData); // Debug log
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BE_BASEURL}/api/email/send-email`,
        {
          to: 'kodr.test@gmail.com',
          subject: `FastGen Contact Form - ${formData.name}`,
          message: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\nTimestamp: ${new Date().toISOString()}`
        },
        { withCredentials: true }
      );
      
      setSubmitStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <HomeHeader />
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Contact Us
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Have questions about FastGen? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">Get in Touch</h3>
              <div className="space-y-4 text-gray-300">
                <div>
                  <p className="font-medium text-white">Email:</p>
                  <p>support@fastgen.com</p>
                </div>
                <div>
                  <p className="font-medium text-white">Phone:</p>
                  <p>+1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="font-medium text-white">Address:</p>
                  <p>123 AI Street, Tech City, TC 12345</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-white mb-4">Send Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message"
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  required
                ></textarea>
                
                {submitStatus && (
                  <div className={`text-center p-3 rounded-lg ${submitStatus.includes('success') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                    {submitStatus}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
