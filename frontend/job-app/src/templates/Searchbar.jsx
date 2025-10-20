function Searchbar(){
  return(
    <div className="container mt-4">
      <h2 className="text-center mb-4">Search your next opportunity...</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search for jobs..."
              aria-label="Search for jobs"
            />
            <button className="btn btn-primary" type="button">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Searchbar;