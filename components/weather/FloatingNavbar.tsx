// import React from 'react';
// import { LayoutDashboard, Heart, Settings, Sun, Moon } from 'lucide-react';
// import { useTheme } from '@/contexts/ThemeContext';
// import { cn } from '@/lib/utils';

// interface NavItem {
//   icon: React.ElementType;
//   label: string;
//   active?: boolean;
//   onClick?: () => void;
// }

// const FloatingNavbar: React.FC = () => {
//   const { theme, toggleTheme } = useTheme();
//   const [activeTab, setActiveTab] = React.useState('dashboard');

//   const navItems: NavItem[] = [
//     { icon: LayoutDashboard, label: 'Dashboard', active: activeTab === 'dashboard' },
//     { icon: Heart, label: 'Favorites', active: activeTab === 'favorites' },
//     { icon: Settings, label: 'Settings', active: activeTab === 'settings' },
//   ];

//   return (
//     <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
//       <div className="floating-nav rounded-2xl px-2 py-2 flex items-center gap-1">
//         {navItems.map((item) => (
//           <button
//             key={item.label}
//             onClick={() => setActiveTab(item.label.toLowerCase())}
//             className={cn(
//               'flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200',
//               item.active
//                 ? 'bg-primary text-primary-foreground shadow-lg'
//                 : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
//             )}
//           >
//             <item.icon className="h-5 w-5" />
//             <span className={cn(
//               'text-sm font-medium transition-all duration-200',
//               item.active ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden sm:block sm:opacity-100 sm:w-auto'
//             )}>
//               {item.label}
//             </span>
//           </button>
//         ))}

//         {/* Theme Toggle */}
//         <div className="w-px h-8 bg-border mx-2" />
//         <button
//           onClick={toggleTheme}
//           className="flex items-center justify-center p-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
//         >
//           {theme === 'dark' ? (
//             <Sun className="h-5 w-5" />
//           ) : (
//             <Moon className="h-5 w-5" />
//           )}
//         </button>
//       </div>
//     </nav>
//   );
// };

// export default FloatingNavbar;
