import { useEffect, useState, useCallback } from "react";
import { useScan } from "@/hooks/useScan"; // Custom hook we will create
import { Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * SmartScanner Component
 * Invisible listener for barcode scanner inputs.
 * Handles "Smart Logic" like Fraud Checks (Price < Cost) and Expiry Alerts.
 */
const SmartScanner = ({ onScanSuccess, context = "POS", branchId }) => {
  const [buffer, setBuffer] = useState("");
  const { processScan, isLoading } = useScan();
  
  // State for alerts requiring intervention
  const [alertData, setAlertData] = useState(null);
  const [showOverride, setShowOverride] = useState(false);
  const [managerPin, setManagerPin] = useState("");

  const handleScan = useCallback(async (barcode) => {
    // Call backend to process scan based on context (POS, GRN, etc)
    const result = await processScan({ 
      scanData: barcode, 
      context, 
      branchId 
    });

    if (!result.success) {
      toast.error(result.errorMessage || "Product not found");
      return;
    }

    // FRAUD PREVENTION: Check for blocking alerts from backend
    const blockingAlert = result.alerts?.find(a => 
        a.alertType === "LOSS_WARNING" || a.alertType === "EXPIRED"
    );

    if (blockingAlert) {
      // Pause! Require authorization or acknowledgement
      setAlertData({
        product: result.productName,
        message: blockingAlert.message,
        type: blockingAlert.alertType,
        resultObj: result
      });
      return;
    }

    // If safe, pass data up to parent (e.g., Add to Cart)
    handleSuccess(result);

  }, [context, branchId, processScan, onScanSuccess]);

  const handleSuccess = (result) => {
    onScanSuccess(result);
    toast.success(`${result.productName} added`, {
        icon: <CheckCircle className="text-emerald-500 h-4 w-4"/>,
        duration: 1500
    });
  };

  // Keyboard listener for scanner hardware
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in a regular input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Enter') {
        if (buffer.length > 2) {
          handleScan(buffer);
        }
        setBuffer("");
      } else {
        // Build buffer, ignore control keys
        if (e.key.length === 1) {
          setBuffer(prev => prev + e.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [buffer, handleScan]);

  // Handle Manager Override
  const handleOverride = () => {
    // Simple PIN check (In real app, call auth API)
    if (managerPin === "1234") { 
        handleSuccess(alertData.resultObj);
        setAlertData(null);
        setManagerPin("");
        setShowOverride(false);
        toast.info("Manager override authorized");
    } else {
        toast.error("Invalid Manager PIN");
    }
  };

  return (
    <>
      {/* Visual Feedback when processing scan */}
      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Scanning...</span>
        </div>
      )}

      {/* Fraud/Safety Alert Dialog */}
      <Dialog open={!!alertData} onOpenChange={(open) => !open && setAlertData(null)}>
        <DialogContent className="sm:max-w-md border-destructive/50">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
                <ShieldAlert className="h-6 w-6" />
                <DialogTitle>Safety Warning</DialogTitle>
            </div>
            <DialogDescription className="text-foreground font-medium">
              {alertData?.message}
            </DialogDescription>
            <p className="text-sm text-muted-foreground mt-2">
                Product: {alertData?.product}
            </p>
          </DialogHeader>
          
          {!showOverride ? (
              <DialogFooter className="flex-col sm:justify-between gap-2">
                <Button variant="outline" onClick={() => setAlertData(null)}>
                    Cancel Scan
                </Button>
                <Button variant="destructive" onClick={() => setShowOverride(true)}>
                    Manager Override
                </Button>
              </DialogFooter>
          ) : (
              <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                      <label className="text-xs font-medium">Manager PIN</label>
                      <Input 
                        type="password" 
                        value={managerPin}
                        onChange={(e) => setManagerPin(e.target.value)}
                        placeholder="Enter PIN"
                        autoFocus
                      />
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setShowOverride(false)}>Back</Button>
                    <Button onClick={handleOverride}>Authorize</Button>
                  </DialogFooter>
              </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartScanner;