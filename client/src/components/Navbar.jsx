function Navbar({ appName }) {
  return (
    <nav>
      <h2>{appName}</h2>

      <div>
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Get Started</a>
      </div>
    </nav>
  );
}

export default Navbar;