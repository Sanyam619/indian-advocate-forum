import { useRefreshRedirect } from '../hooks/useRefreshRedirect';

/**
 * Component that handles page refresh redirect to home page
 */
export const RefreshHandler: React.FC = () => {
  // Use the custom hook to handle refresh redirects
  useRefreshRedirect();

  return null; // This component doesn't render anything
};

export default RefreshHandler;