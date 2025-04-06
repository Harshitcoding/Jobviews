import { ChartNoAxesColumnIncreasing, Dumbbell, GitGraph, LayoutDashboard, NotebookPen } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="absolute w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 md:w-64 p-5 shadow-md rounded-3xl">
      {/* Logo Section */}
      <div className="mb-8">
        <div className="flex p-3 ml-2">
          <h1 className="text-2xl font-bold text-white">JobViews</h1>
        </div>
        <div className="h-px bg-white/20 w-full mt-2"></div>
      </div>
      <nav className="space-y-8">
      <Link 
          href="/Dashboard" 
          className="flex items-center text-white hover:bg-indigo-800 rounded-lg p-3 transition-colors"
        >
          <span className="ml-2 text-lg flex items-center gap-4"> 
            <LayoutDashboard/>
            Dashboard</span>
        </Link>

        <Link 
          href="/interviews" 
          className="flex items-center text-white hover:bg-indigo-800 rounded-lg p-3 transition-colors"
        >
          <span className="ml-2 text-lg flex items-center gap-4"> 
            <NotebookPen/>
            Interviews</span>
        </Link>

        <Link 
          href="/insights" 
          className="flex items-center text-white hover:bg-indigo-800 rounded-lg p-3 transition-colors"
        >
          <span className="ml-2 text-lg flex items-center gap-4">
           <ChartNoAxesColumnIncreasing/>
            Insights</span>
        </Link>

        <Link 
          href="/practice" 
          className="flex items-center text-white hover:bg-indigo-800 rounded-lg p-3 transition-colors"
        >
         
          <span className="ml-2 text-lg flex items-center gap-4">
            <Dumbbell/>
            Practice</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;