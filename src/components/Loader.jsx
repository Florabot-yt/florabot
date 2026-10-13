export default function Loader({ text = "Memuat..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="spinner" />
      <p className="mt-4 text-gray-500 font-medium">{text}</p>
    </div>
  );
}
