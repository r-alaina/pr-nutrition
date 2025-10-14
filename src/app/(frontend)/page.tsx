import Link from 'next/link'

export default function Home() {
  return (
    <div className="home">
      <div className="content">
        <h1>Welcome to your new project.</h1>
      </div>

      <div className="links">
        <Link href="/admin" className="admin">
          Admin
        </Link>
        <a
          href="https://payloadcms.com/docs"
          className="docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
      </div>
    </div>
  )
}