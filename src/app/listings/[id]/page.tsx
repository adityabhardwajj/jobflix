import { notFound } from "next/navigation";

const mockProperties = [
  { id: 1, title: "Modern Apartment in City Center", price: "$1,200/mo", description: "A beautiful modern apartment located in the heart of the city, close to all amenities." },
  { id: 2, title: "Cozy Cottage by the Lake", price: "$950/mo", description: "Enjoy peaceful living in this cozy cottage with stunning lake views." },
  { id: 3, title: "Luxury Villa with Pool", price: "$3,500/mo", description: "Experience luxury in this spacious villa featuring a private pool and garden." },
];

export default function PropertyDetails({ params }: { params: { id: string } }) {
  const property = mockProperties.find(p => p.id === Number(params.id));
  if (!property) return notFound();

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <div className="text-xl text-gray-700 mb-2">{property.price}</div>
      <p className="mb-6">{property.description}</p>
      <a href="/listings" className="text-blue-600 hover:underline">← Back to Listings</a>
    </div>
  );
} 