import React from 'react';
import '../App.css';

/**
 * Skeleton loader component for better loading UX
 */
export const SkeletonCard = ({ height = '200px' }) => (
  <div className="skeleton-card" style={{ height }}>
    <div className="skeleton-shimmer"></div>
  </div>
);

export const SkeletonText = ({ width = '100%', height = '16px' }) => (
  <div className="skeleton-text" style={{ width, height }}>
    <div className="skeleton-shimmer"></div>
  </div>
);

export const SkeletonJobCard = () => (
  <div className="list-group-item skeleton-job-card">
    <div className="skeleton-content">
      <SkeletonText width="60%" height="24px" />
      <SkeletonText width="80%" height="16px" />
      <SkeletonText width="70%" height="16px" />
      <SkeletonText width="50%" height="16px" />
    </div>
    <div className="skeleton-button">
      <SkeletonText width="100px" height="44px" />
    </div>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="card stat-card shadow-sm h-100 border-0">
    <div className="card-body text-center">
      <SkeletonText width="60px" height="60px" style={{ margin: '0 auto 1rem' }} />
      <SkeletonText width="80%" height="20px" style={{ margin: '0 auto' }} />
    </div>
  </div>
);

export default SkeletonCard;
