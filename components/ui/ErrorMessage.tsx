export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-red-600 bg-red-100 p-4 rounded">
      <p>Error: {message}</p>
    </div>
  );
}
