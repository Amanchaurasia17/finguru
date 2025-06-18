export default function IPOCard({ ipo }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h4 className="font-semibold text-lg mb-2">{ipo.name}</h4>
      <p>Open Date: {ipo.openDate}</p>
      <p>Expected Gain: {ipo.expectedGain}</p>
    </div>
  );
}
