import { Link } from "react-router-dom";

function HomePage() {
    return (
    <div className="home">
      <h1>Benvenuto su Pegaspay</h1>
      <p>Piattaforma per lo scambio e trasferimento di fondi tra utenti.</p>
      <Link to="/dashboard">Vai alla Dashboard</Link>
    </div>
  );
}

export default HomePage;