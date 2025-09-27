// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact Me</h1>
      <div className="mb-6 space-y-4">
        <p className="mb-4">Have questions about JobFlix or want to connect? Reach out to me!</p>
        
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-medium">Email:</span>
              <a href="mailto:aadityabhardwaj5cs@gmail.com" className="text-primary hover:underline">
                aadityabhardwaj5cs@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium">LinkedIn:</span>
              <a href="https://www.linkedin.com/in/aditya-bhardwaj-961198232/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Connect with me on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input type="text" className="w-full border rounded px-3 py-2" placeholder="Your Name" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" placeholder="you@email.com" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea className="w-full border rounded px-3 py-2" placeholder="How can we help you?" rows={4}></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
      </form>
    </div>
  );
} 