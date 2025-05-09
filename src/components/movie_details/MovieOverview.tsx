import React from 'react';

interface MovieOverviewProps {
  overview: string;
}

const MovieOverview: React.FC<MovieOverviewProps> = ({ overview }) => {
  return (
    <div className="movie-overview">
      <h2>Overview</h2>
      <p>{overview}</p>
    </div>
  );
};

export default MovieOverview;