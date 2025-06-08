export default function Contact() {
  return (
    <footer id="contact" className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
          <p className="text-gray-400 max-w-md">
            We'd love to hear from you. Reach out to us via email or follow us on social media.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p><strong>Email:</strong> contact@yourwebsite.com</p>
          <p><strong>Phone:</strong> +91 9876543210</p>
          <p><strong>Location:</strong> Hyderabad, India</p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Your Website Name. All rights reserved.
      </div>
    </footer>
  );
}
