// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-4">Have questions or want to schedule a viewing? Reach out to us!</p>
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