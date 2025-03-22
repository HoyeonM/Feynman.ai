import { Link } from 'react-router-dom';

export const Navbar = () => {

  return (
    <nav className="py-6 w-full animate-fade-in">
      <div className="layout-container">
        <div className="flex items-center justify-between">
          {/*Logo*/}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-medium transition-opacity hover:opacity-80"
            > 
              Feynman.ai ⭐️
            </Link>
          </div>
          
          {/*Sign Out*/}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link 
              to="/recharging" 
              className="btn-secondary py-2 px-4"
            >
              Log Out
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
