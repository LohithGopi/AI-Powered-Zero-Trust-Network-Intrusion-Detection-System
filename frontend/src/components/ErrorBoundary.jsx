import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0D0F] text-[#F3F4F1] flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="max-w-md w-full bg-[#15191C] border border-red-900/50 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="h-12 w-12 rounded-xl bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-red-400">Application Error Encountered</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {this.state.error?.toString() || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Clear Cache & Restart Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
