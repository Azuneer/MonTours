export function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Chargement de la carte...</p>
      </div>
    </div>
  );
}
