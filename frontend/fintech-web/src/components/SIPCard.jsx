export default function SIPCard({ sip }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h4 className="font-semibold text-lg mb-2">{sip.name}</h4>
      <p>Category: {sip.category}</p>
    </div>
  );
}
