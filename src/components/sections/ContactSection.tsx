import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact_number: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const { error } = await supabase.from('contacts').insert([formData]);

      if (error) {
        throw error;
      }

      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        contact_number: '',
        message: '',
      });
    } catch (error: any) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
            We'd love to hear from you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-foreground">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-card-dark border border-primary/20 rounded-md shadow-sm placeholder-secondary-foreground/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-foreground">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-card-dark border border-primary/20 rounded-md shadow-sm placeholder-secondary-foreground/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="contact_number" className="block text-sm font-medium text-secondary-foreground">
                Contact Number
              </label>
              <input
                type="text"
                name="contact_number"
                id="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-card-dark border border-primary/20 rounded-md shadow-sm placeholder-secondary-foreground/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-secondary-foreground">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-card-dark border border-primary/20 rounded-md shadow-sm placeholder-secondary-foreground/50 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
            {submitMessage && (
              <p className="text-center text-secondary-foreground/80">
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
