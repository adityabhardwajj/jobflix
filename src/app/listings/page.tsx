import Link from "next/link";

const mockProperties = [
  { id: 1, title: "Modern Apartment in City Center", price: "$1,200/mo" },
  { id: 2, title: "Cozy Cottage by the Lake", price: "$950/mo" },
  { id: 3, title: "Luxury Villa with Pool", price: "$3,500/mo" },
];

export default function Listings() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Property Listings</h1>
      <ul className="space-y-4">
        {mockProperties.map((property) => (
          <li key={property.id} className="border p-4 rounded shadow-sm flex justify-between items-center">
            <div>
              <div className="font-semibold">{property.title}</div>
              <div className="text-gray-500">{property.price}</div>
            </div>
            <Link href={`/listings/${property.id}`} className="text-blue-600 hover:underline">View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 