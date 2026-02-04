// import React from 'react';
// import { Moon, Sun, LogOut, Cloud } from 'lucide-react';
// import { useTheme } from '@/contexts/ThemeContext';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';

// const Navbar: React.FC = () => {
//   const { theme, toggleTheme } = useTheme();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate('/login');
//   };

//   return (
//     <nav className="glass-card sticky top-0 z-50 px-6 py-4">
//       <div className="container mx-auto flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
//             <Cloud className="h-5 w-5 text-primary-foreground" />
//           </div>
//           <h1 className="text-xl font-semibold text-foreground">
//             Weather Analytics
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={toggleTheme}
//             className="rounded-xl hover:bg-secondary"
//           >
//             {theme === 'dark' ? (
//               <Sun className="h-5 w-5 text-foreground" />
//             ) : (
//               <Moon className="h-5 w-5 text-foreground" />
//             )}
//           </Button>
//           <Button
//             variant="ghost"
//             onClick={handleLogout}
//             className="rounded-xl hover:bg-secondary gap-2"
//           >
//             <LogOut className="h-4 w-4" />
//             <span className="hidden sm:inline">Logout</span>
//           </Button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
