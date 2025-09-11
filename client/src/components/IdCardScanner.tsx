import Image from "next/image";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, CheckCircle } from "lucide-react";

interface IdCardScannerProps {
  onCardScanned: (file: File) => void;
  scannedFile?: File;
}

export function IdCardScanner({
  onCardScanned,
  scannedFile,
}: IdCardScannerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onCardScanned(file);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearScannedCard = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl); // Cleanup memory
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        ID Card Scan (Optional)
      </label>

      {!previewUrl && !scannedFile ? (
        <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Scan or upload your ID card for faster login
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">ID Card Uploaded</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearScannedCard}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {previewUrl && (
              <div className="relative w-full max-w-sm mx-auto h-48 rounded-lg border overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="ID Card Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 384px) 100vw, 384px"
                />
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2 text-center">
              Your ID card information will be used for verification
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
