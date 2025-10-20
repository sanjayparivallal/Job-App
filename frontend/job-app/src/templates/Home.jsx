import Navbar from "./Navbar";
import Jobs from "./Jobs";
import Searchbar from "./Searchbar";
import Dashboard from "./Dashboard";
import Createjob from "./Createjob";

function Home({ onLogout }) {
  return (
    <>
      <Navbar onLogout={onLogout} />
      <div>
        <Createjob />
        <Searchbar />
        <Jobs />
      </div>
    </>
  );
}

export default Home;
