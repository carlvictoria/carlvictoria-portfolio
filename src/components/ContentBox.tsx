export default function ContentBox() {
  return (
   <div className="mt-8 p-8 border border-black-600 rounded-lg w-full min-w-5xl min-h-[400px]" style={{ backgroundColor: 'var(--cmd-background)'}}>
      <p style={{color: 'var(--cmd-title)', fontFamily: 'var(--font-terminal)'}} className="text-lg">
        Welcome to my portfolio
      </p>
    </div>
  );
}
