import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', formData);
    }, 1500);
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1664070719361-a965ace0254a?auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: '400px 400px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/10" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-radial from-blue-400/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-indigo-400/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1596564548079-34e30b67b64b?auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Sistema EBD Fiel"
                  className="w-12 h-12 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Sistema EBD Fiel
                </h1>
                <p className="text-sm text-slate-600 font-medium">Educação Cristã Digital</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="relative">
              {/* Card Background with Glass Effect */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl" />
              
              {/* Card Content */}
              <div className="relative p-8 sm:p-10">
                {/* Welcome Section */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo</h2>
                  <p className="text-slate-600">Acesse sua conta para continuar</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Usuário
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('username')}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                          focusedField === 'username' 
                            ? 'border-blue-500 bg-white/80 shadow-lg' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="Digite seu usuário"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="relative">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onFocus={() => handleFocus('password')}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 bg-white/50 border-2 rounded-xl text-slate-800 placeholder-slate-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                          focusedField === 'password' 
                            ? 'border-blue-500 bg-white/80 shadow-lg' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        placeholder="Digite sua senha"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Entrando...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span>Entrar</span>
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded px-2 py-1"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Features */}
            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Seguro
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                  Responsivo
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Moderno
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1558622564-f763f4d08baa?auto=format&fit=crop&w=40&h=40&q=80" 
                  alt="Cross Symbol"
                  className="w-6 h-6 opacity-60"
                />
                <p className="text-sm text-slate-600">
                  © 2025 <span className="font-semibold">Sistema EBD Fiel</span>. Todos os direitos reservados.
                </p>
              </div>
              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <button className="hover:text-slate-700 transition-colors duration-200">Suporte</button>
                <button className="hover:text-slate-700 transition-colors duration-200">Privacidade</button>
                <button className="hover:text-slate-700 transition-colors duration-200">Termos</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;