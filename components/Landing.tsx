'use client'
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Landing = () => {
    const router = useRouter()
    function handlebutton(){
        return router.push('/dashboard')
    }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 opacity-70"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {/* Circuit-like animated patterns */}
          <div className="absolute top-0 left-0 w-1/3 h-full bg-[url('/circuit-pattern.svg')] bg-repeat-y opacity-10"></div>
          <div className="absolute top-1/3 right-0 w-1/4 h-full bg-[url('/circuit-pattern.svg')] bg-repeat-y opacity-10 transform rotate-180"></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500 filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-purple-500 filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center h-screen px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-white text-center lg:text-left max-w-lg space-y-8 mb-10 lg:mb-0">
          <div className="inline-block px-3 py-1 mb-2 bg-indigo-900/50 backdrop-blur-sm rounded-full border border-indigo-500/30">
            <p className="text-xs font-medium text-indigo-300 tracking-wider">NEXT-GEN INTERVIEW ASSISTANCE</p>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400">
            Unlock Your Interview <br /> 
            <span className="relative">
              Superpowers
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-70"></span>
            </span> with AI
          </h1>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            Your AI-powered interview companion that analyzes responses in real-time, providing personalized coaching to help you land your dream job.
          </p>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>
              250K+ Offers Received
            </div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2"></span>
              1.2M+ Interviews Aced
            </div>
          </div>
          
          <div className="pt-4">
            <Button onClick={handlebutton}className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-6 px-8 rounded-lg text-lg font-medium shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group">
              <span className="relative z-10">Activate AI Interview Mode</span>
            </Button>
          </div>
        </div>
        
        <div className="relative w-full max-w-md lg:max-w-xl">
          {/* Image with futuristic frame effect */}
          <div className="relative rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 z-10"></div>
            <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
            <Image
              src="/Image.png"
              alt="AI Interview Copilot"
              width={600}
              height={600}
              className="w-full h-auto"
            />
            
            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500 opacity-80"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-teal-500 opacity-80"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500 opacity-80"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-teal-500 opacity-80"></div>
          </div>
          
          {/* Floating badge */}
          <div className="absolute -right-4 -bottom-4 bg-gradient-to-br from-indigo-900 to-purple-900 px-4 py-2 rounded-lg border border-indigo-700/50 shadow-lg backdrop-blur-sm">
            <p className="text-sm font-medium text-cyan-300">Powered by Advanced AI</p>
          </div>
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-0">
        <div className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-float opacity-70" style={{ left: '10%', animationDelay: '0s' }}></div>
        <div className="absolute w-1 h-1 rounded-full bg-blue-300 animate-float opacity-50" style={{ left: '25%', animationDelay: '0.5s' }}></div>
        <div className="absolute w-1.5 h-1.5 rounded-full bg-teal-400 animate-float opacity-60" style={{ left: '45%', animationDelay: '1.2s' }}></div>
        <div className="absolute w-2 h-2 rounded-full bg-indigo-400 animate-float opacity-70" style={{ left: '65%', animationDelay: '0.7s' }}></div>
        <div className="absolute w-1 h-1 rounded-full bg-purple-300 animate-float opacity-50" style={{ left: '85%', animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
}

export default Landing;
