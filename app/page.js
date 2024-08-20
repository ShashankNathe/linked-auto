import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Welcome to LinkedIn Post Scheduler</h1>
      <p>Schedule your LinkedIn posts easily and efficiently.</p>

      <Link href="/auth/login">Login</Link>
      <Link href="/auth/register">Register</Link>
    </div>
  );
}
