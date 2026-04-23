import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = "Couldn't load this section.", onRetry }: Props) => (
  <div className="rounded-xl border border-border bg-card p-8 text-center">
    <AlertTriangle className="h-8 w-8 text-primary mx-auto mb-3" />
    <p className="text-muted-foreground mb-4">{message}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);