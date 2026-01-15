import GreetingAnimation from '@/components/GreetingAnimation';

export default function HomePage() {
  return (
    <main className="min-h-screen flex justify-center">
      <GreetingAnimation isDarkMode={true} />
    </main>
  );
}
