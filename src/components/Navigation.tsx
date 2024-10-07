import Link from 'next/link';

const Navigation = () => {
  return (
    <nav>
      <Link href="/feelings">Feelings</Link>
      <Link href="/chat">Chat</Link>
      <Link href="/goals">Goals</Link>
      {/* <Link href="/profile">Profile</Link> */}
    </nav>
  );
};

export default Navigation;