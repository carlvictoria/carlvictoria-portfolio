export default function ContentBox() {
  return (
   <div className="mt-8 border border-black-600 rounded-lg w-full min-w-5xl min-h-[800px] overflow-hidden" style={{ backgroundColor: 'var(--cmd-background)'}}>
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-600">
        <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-center">
          CMD
        </p>
      </div>
      <div className="p-8">
        {/* Content goes here */}
      </div>
    </div>
  );
}
