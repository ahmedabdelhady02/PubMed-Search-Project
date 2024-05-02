import React, { useState } from 'react';

function ResultsList({ results, onPageChange, currentPage }) {
  const [selectedDetail, setSelectedDetail] = useState(null);

  const handleViewDetails = async (id) => {
    // Fetch details for the selected publication
    const response = await fetch(`/details?ids=${id}`);
    const data = await response.json();
    setSelectedDetail(data.details[0]);
  };

  return (
    <div>
      {results.map((result) => (
        <div key={result.PMID}>
          <h4>
            {result.Title} ({result.PublicationYear})<br></br>PMID: {result.PMID}
          </h4>
          <button onClick={() => handleViewDetails(result.PMID)}>View Details</button>
          {selectedDetail && selectedDetail.PMID === result.PMID && (
            <div>
              <h3>{selectedDetail.Title}</h3>
              <p>{selectedDetail.Abstract}</p>
              <p>Authors: {selectedDetail.AuthorList}</p>
              <p>
                Published in: {selectedDetail.Journal}, {selectedDetail.PublicationYear}
              </p>
              {selectedDetail.MeSHTerms.length > 0 ? (
                <p>MeSH Terms: {selectedDetail.MeSHTerms.join(', ')}</p>
              ) : (
                <p>No MeSH terms available for this publication.</p>
              )}
              <a href={`https://pubmed.ncbi.nlm.nih.gov/${selectedDetail.PMID}/`}>View on PubMed</a>
            </div>
          )}
        </div>
      ))}
      {onPageChange && ( // conditionally render Previous button
        <button disabled={currentPage === 0} onClick={() => onPageChange('prev')}>
          Previous
        </button>
      )}
      <button onClick={() => onPageChange('next')}>Next</button>
    </div>
  );
}

export default ResultsList;
