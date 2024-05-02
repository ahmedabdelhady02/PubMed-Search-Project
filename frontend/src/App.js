import React, { useState } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import ResultsList from './ResultsList';

function App() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const fetchResults = async (query, page) => {
    const response = await axios.post('/search', { query, retstart: page * 20, retmax: 20 }); // send request to retreive list of ids
    const results = await axios.get(`/details?ids=${response.data.ids}&fields=['PMID', 'Title', 'PublicationYear']`); // get details for all ids retrieved
    setResults(results.data.details);
  };

  const handleSearch = (query) => {
    setQuery(query);
    setCurrentPage(0); // reset page count to 0 for pagination
    fetchResults(query, currentPage);
  };

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    setCurrentPage(newPage);
    fetchResults(query, newPage);
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} />
      {results && <ResultsList results={results} onPageChange={handlePageChange} currentPage={currentPage} />}
    </div>
  );
}

export default App;
