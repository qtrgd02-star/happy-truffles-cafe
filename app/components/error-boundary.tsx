"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("UI error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-vanilla/30 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
            <h1 className="font-playfair text-2xl font-bold text-chocolate mb-4">Something went wrong</h1>
            <p className="text-chocolate/60 mb-6">
              {this.state.error?.message || "An unexpected error occurred. Please try again later."}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-truffle text-white px-6 py-3 rounded-full font-semibold hover:bg-chocolate transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
