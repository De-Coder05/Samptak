import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, AlertTriangle, CheckCircle, Loader2, ImageIcon } from "lucide-react";
import ConfidenceMeter from "./ConfidenceMeter";

interface AnalysisResult {
  has_crack: boolean;
  confidence: number;
  confidence_level: string;
  message: string;
}

const AnalysisSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, []);

  const processImage = async (file: File) => {
    setError(null);
    setResult(null);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start analysis
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
      const response = await fetch(`${API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data: AnalysisResult = await response.json();

      // Add a small delay for dramatic effect
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <section id="analysis" className="py-24 relative">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Live </span>
            <span className="text-primary">Analysis</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload an image of a railway track to detect potential cracks using our AI system
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="glass-card p-8 gradient-border"
          >
            {!selectedImage ? (
              /* Upload Zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer ${isDragging
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-primary/50 hover:bg-card/50"
                  }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <motion.div
                  animate={{ y: isDragging ? -10 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className={`w-10 h-10 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {isDragging ? "Drop your image here" : "Upload Track Image"}
                  </h3>
                  <p className="text-muted-foreground">
                    Drag and drop an image, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground/60 mt-2">
                    Supports: JPG, PNG, WEBP
                  </p>
                </motion.div>
              </div>
            ) : (
              /* Analysis View */
              <div className="space-y-6">
                {/* Image Preview with Scanning Effect */}
                <div className="relative rounded-xl overflow-hidden aspect-video bg-card">
                  <img
                    src={selectedImage}
                    alt="Track for analysis"
                    className="w-full h-full object-cover"
                  />

                  {/* Scanning overlay */}
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-background/40 backdrop-blur-sm"
                      >
                        <div className="scanning-line" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                            <p className="text-lg font-medium">Analyzing Track...</p>
                            <p className="text-sm text-muted-foreground">AI is inspecting for cracks</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Result Overlay */}
                  <AnimatePresence>
                    {result && !isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute top-4 right-4 px-4 py-2 rounded-lg backdrop-blur-sm ${result.has_crack
                            ? "bg-danger/20 border border-danger/50"
                            : "bg-safe/20 border border-safe/50"
                          }`}
                      >
                        {result.has_crack ? (
                          <div className="flex items-center gap-2 text-danger">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-semibold">Crack Detected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-safe">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Track Safe</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Results */}
                <AnimatePresence>
                  {result && !isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="grid md:grid-cols-2 gap-6"
                    >
                      {/* Status Card */}
                      <div
                        className={`p-6 rounded-xl border ${result.has_crack
                            ? "bg-danger/10 border-danger/30"
                            : "bg-safe/10 border-safe/30"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${result.has_crack ? "bg-danger/20" : "bg-safe/20"
                              }`}
                          >
                            {result.has_crack ? (
                              <AlertTriangle className="w-8 h-8 text-danger" />
                            ) : (
                              <CheckCircle className="w-8 h-8 text-safe" />
                            )}
                          </div>
                          <div>
                            <h4
                              className={`text-2xl font-bold ${result.has_crack ? "text-danger glow-text-danger" : "text-safe glow-text-safe"
                                }`}
                            >
                              {result.has_crack ? "CRACK DETECTED" : "NO CRACK DETECTED"}
                            </h4>
                            <p className="text-muted-foreground mt-1">{result.message}</p>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Meter */}
                      <div className="p-6 rounded-xl bg-card/50 border border-border/30">
                        <ConfidenceMeter
                          confidence={result.confidence}
                          level={result.confidence_level}
                          hasCrack={result.has_crack}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-center"
                  >
                    <AlertTriangle className="w-8 h-8 text-danger mx-auto mb-2" />
                    <p className="text-danger">{error}</p>
                  </motion.div>
                )}

                {/* Reset Button */}
                {(result || error) && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={resetAnalysis}
                    className="w-full py-3 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Analyze Another Image
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;
