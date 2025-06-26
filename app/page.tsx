// app/page.tsx

'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link'; // Добавляем импорт Link

// Типизация для данных планеты
interface PlanetData {
  id: number;
  lang: string;
  speakers: number; // Приблизительное кол-во носителей в миллионах
  size?: number; // Размер будет вычислен на основе speakers
  flag: string;
  gradient: string;
  glowColor: string;
  // Параметры для хаотичного движения
  orbitRadiusX: number;
  orbitRadiusY: number;
  speed: number;
  initialAngle: number;
}

export default function HomePage() {
  const planetElements = useRef<Map<number, HTMLElement>>(new Map());
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const planetSystem = document.getElementById('planet-system');

    // Расширенный список планет с данными о популярности (в млн носителей)
    const planetData: PlanetData[] = [
        { id: 1, lang: 'English', speakers: 1500, flag: 'https://flagcdn.com/w40/gb.png', gradient: 'radial-gradient(circle, #a7c0d8, #2a5a8c)', glowColor: '#87CEEB', orbitRadiusX: 45, orbitRadiusY: 20, speed: 0.001, initialAngle: 0 },
        { id: 2, lang: 'Mandarin Chinese', speakers: 1120, flag: 'https://flagcdn.com/w40/cn.png', gradient: 'radial-gradient(circle, #FFD700, #B22222)', glowColor: '#FFD700', orbitRadiusX: 55, orbitRadiusY: 25, speed: -0.0009, initialAngle: 90 },
        { id: 3, lang: 'Hindi', speakers: 602, flag: 'https://flagcdn.com/w40/in.png', gradient: 'radial-gradient(circle, #FF9933, #138808)', glowColor: '#FF9933', orbitRadiusX: 30, orbitRadiusY: 30, speed: 0.0012, initialAngle: 180 },
        { id: 4, lang: 'Spanish', speakers: 548, flag: 'https://flagcdn.com/w40/es.png', gradient: 'radial-gradient(circle, #f7b400, #d62828)', glowColor: '#FAD100', orbitRadiusX: 50, orbitRadiusY: 40, speed: -0.0011, initialAngle: 270 },
        { id: 5, lang: 'French', speakers: 274, flag: 'https://flagcdn.com/w40/fr.png', gradient: 'radial-gradient(circle, #0055A4, #EF4135)', glowColor: '#FFFFFF', orbitRadiusX: 60, orbitRadiusY: 45, speed: 0.0008, initialAngle: 45 },
        { id: 6, lang: 'Standard Arabic', speakers: 274, flag: 'https://flagcdn.com/w40/sa.png', gradient: 'radial-gradient(circle, #006C35, #004B25)', glowColor: '#006C35', orbitRadiusX: 35, orbitRadiusY: 35, speed: -0.0015, initialAngle: 135 },
        { id: 7, lang: 'Bengali', speakers: 272, flag: 'https://flagcdn.com/w40/bd.png', gradient: 'radial-gradient(circle, #006a4e, #f42a41)', glowColor: '#006a4e', orbitRadiusX: 40, orbitRadiusY: 45, speed: 0.00095, initialAngle: 225 },
        { id: 8, lang: 'Russian', speakers: 258, flag: 'https://flagcdn.com/w40/ru.png', gradient: 'radial-gradient(circle, white, #d52b1e, #0039a6)', glowColor: 'white', orbitRadiusX: 58, orbitRadiusY: 30, speed: -0.001, initialAngle: 315 },
        { id: 9, lang: 'Portuguese', speakers: 257, flag: 'https://flagcdn.com/w40/pt.png', gradient: 'radial-gradient(circle, #006241, #ff0000)', glowColor: '#006241', orbitRadiusX: 62, orbitRadiusY: 38, speed: 0.0013, initialAngle: 75 },
        { id: 10, lang: 'Urdu', speakers: 231, flag: 'https://flagcdn.com/w40/pk.png', gradient: 'radial-gradient(circle, #006600, #FFFFFF)', glowColor: '#FFFFFF', orbitRadiusX: 28, orbitRadiusY: 25, speed: -0.0014, initialAngle: 165 },
        { id: 11, lang: 'Indonesian', speakers: 199, flag: 'https://flagcdn.com/w40/id.png', gradient: 'radial-gradient(circle, #ff0000, #FFFFFF)', glowColor: '#ff0000', orbitRadiusX: 48, orbitRadiusY: 48, speed: 0.0011, initialAngle: 205 },
        { id: 12, lang: 'German', speakers: 134, flag: 'https://flagcdn.com/w40/de.png', gradient: 'radial-gradient(circle, #FFCE00, #DD0000, #000000)', glowColor: '#FFCE00', orbitRadiusX: 33, orbitRadiusY: 40, speed: -0.0008, initialAngle: 255 },
        { id: 13, lang: 'Japanese', speakers: 125, flag: 'https://flagcdn.com/w40/jp.png', gradient: 'radial-gradient(circle, #FFFFFF 60%, #BC002D)', glowColor: 'white', orbitRadiusX: 25, orbitRadiusY: 20, speed: 0.0016, initialAngle: 345 },
    ];

    // Вычисляем размер на основе популярности
    const baseSize = 50; // Минимальный размер планеты
    const maxSize = 140; // Максимальный размер планеты
    const maxSpeakers = Math.max(...planetData.map(p => p.speakers));
    
    planetData.forEach(p => {
        p.size = baseSize + (p.speakers / maxSpeakers) * (maxSize - baseSize);
    });

    if (planetSystem) {
      planetSystem.innerHTML = '';
      planetElements.current.clear();
      
      planetData.forEach(data => {
        const planetContainer = document.createElement('div');
        planetContainer.className = 'planet-container';
        planetContainer.style.setProperty('--size', `${data.size}px`);
        
        planetContainer.innerHTML = `
          <div class="planet-body" style="--planet-gradient: ${data.gradient}; --glow-color: ${data.glowColor};" title="${data.lang} - ${data.speakers}M speakers"></div>
          <div class="flag-container"><img src="${data.flag}" alt="${data.lang} Flag"></div>
        `;
        
        planetSystem.appendChild(planetContainer);
        planetElements.current.set(data.id, planetContainer);
      });
    }

    const animate = (time: number) => {
      const systemWidth = planetSystem?.clientWidth || 0;
      const systemHeight = planetSystem?.clientHeight || 0;
      const centerX = systemWidth / 2;
      const centerY = systemHeight / 2;

      planetData.forEach(data => {
        const planetEl = planetElements.current.get(data.id);
        if (!planetEl) return;

        const angle = data.initialAngle * (Math.PI / 180) + time * data.speed;
        const x = centerX + (data.orbitRadiusX / 100 * systemWidth / 2) * Math.cos(angle) - (data.size || 0) / 2;
        const y = centerY + (data.orbitRadiusY / 100 * systemHeight / 2) * Math.sin(angle) - (data.size || 0) / 2;

        planetEl.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    const starsBg = document.getElementById('stars-bg');
    if (starsBg) {
      starsBg.innerHTML = '';
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 2.5 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 8}s`;
        star.style.animationDuration = `${Math.random() * 5 + 3}s`;
        star.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        starsBg.appendChild(star);
      }
    }

    const headline = document.getElementById('dynamic-headline');
    const languages = ["Learn languages with AI", "Учи языки с ИИ", "Aprende idiomas с IA", "Lerne Sprachen mit KI", "Apprenez les langues avec l'IA", "AIで言語を学ぶ", "تعلم اللغات مع الذكاء الاصطناعي", "AI के साथ भाषाएँ सीखें", "学习语言与AI"];
    let index = 0;

    let intervalId: NodeJS.Timeout | null = null;
    if (headline) {
      intervalId = setInterval(() => { 
        headline.classList.add('fade-out'); 
        setTimeout(() => { 
          index = (index + 1) % languages.length; 
          headline.textContent = languages[index]; 
          headline.classList.remove('fade-out'); 
        }, 500); 
      }, 4000); 
    }
    
    const observer = new IntersectionObserver((entries) => { 
      entries.forEach(entry => { 
        if (entry.isIntersecting) { 
          entry.target.classList.add('is-visible'); 
        } 
      }); 
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-section').forEach(section => { 
      observer.observe(section); 
    });


    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (intervalId) clearInterval(intervalId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div id="stars-bg"></div>
      <div id="main-container">
        <div id="content-overlay">
          <header className="py-6 px-4 sm:px-8 fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-3xl font-bold font-space tracking-wider text-white">
                <span>Justax</span><span className="space-logo">.Space</span>
              </h1>
              {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
              <Link href="/auth" className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-2 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transform hover:scale-105">
                Launch App
              </Link>
            </div>
          </header>

          <main>
            <div id="headline-wrapper">
              <div className="relative z-10 text-center">
                <h2 id="dynamic-headline" className="text-5xl md:text-7xl font-bold font-space tracking-tight text-white mb-4">Learn languages with AI</h2>
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">Your personal AI tutor for mastering any language, from any language.</p>
              </div>
              <div id="planet-system"></div>
            </div>
            
            <div className="relative z-10 bg-[#00001a] pb-12">
              <section className="py-20 fade-in-section">
                <h3 className="text-4xl font-bold text-center mb-16 font-space">A Universe of AI-Powered Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                  <div className="hologram-block"><div className="hologram-icon"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div><div><h4 className="text-2xl font-bold mb-2">Personalized Plan</h4><p className="text-gray-400">Our AI analyzes your level and creates a unique learning path that adapts to your progress.</p></div></div>
                  <div className="hologram-block" style={{animationDelay: '2s'}}><div className="hologram-icon"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></div><div><h4 className="text-2xl font-bold mb-2">AI Conversation</h4><p className="text-gray-400">Have natural conversations with our AI. Practice speaking and listening anytime, on any topic.</p></div></div>
                  <div className="hologram-block" style={{animationDelay: '1s'}}><div className="hologram-icon"><svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div><div><h4 className="text-2xl font-bold mb-2">AI-Powered Content</h4><p className="text-gray-400">Generate texts and stories tailored to your level, with instant feedback and corrections.</p></div></div>
                </div>
              </section>
              
              <section className="py-16 fade-in-section">
                <div className="max-w-3xl mx-auto glass-container p-8 md:p-12 rounded-xl">
                  <h3 className="text-4xl font-bold font-space text-center mb-4">Start Your Free Trial</h3>
                  <p className="text-gray-400 text-center mb-8 text-lg">Get instant access to the platform. No credit card required.</p>
                  <div className="text-center">
                    {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
                    <Link href="/auth" className="inline-block bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 px-10 rounded-lg transition-all text-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transform hover:scale-105">
                      Register for Free
                    </Link>
                  </div>
                  <p className="text-center mt-6 text-gray-400">
                    Already have an account? 
                    {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
                    <Link href="/auth" className="text-cyan-400 hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </section>
            </div>
          </main>
          <footer className="relative z-10 bg-[#00001a] py-8 px-4 text-center text-gray-500"><p>&copy; 2024 Justax. All rights reserved.</p></footer>
        </div>
      </div>
    </>
  );
}