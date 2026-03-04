import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, CheckCircle2, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface CredentialsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    credentials: {
        email?: string;
        password?: string;
        name?: string;
    };
}

export function CredentialsDialog({ isOpen, onOpenChange, title, description, credentials }: CredentialsDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = `Hello ${credentials?.name || ''},\n\nYour account has been created.\n\nLogin URL: https://invictacademy.com/login\nEmail: ${credentials?.email}\nPassword: ${credentials?.password}\n\nPlease change your password after logging in.`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0B1020] border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-200/80">
                        Please copy these credentials now. The password cannot be shown again once this dialog is closed.
                    </p>
                </div>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label className="text-gray-400">Email Address</Label>
                        <Input readOnly value={credentials?.email || ''} className="bg-black/40 border-white/5 font-mono text-cyan-400" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-400">Temporary Password</Label>
                        <Input readOnly value={credentials?.password || ''} className="bg-black/40 border-white/5 font-mono text-green-400" />
                    </div>
                </div>

                <DialogFooter className="sm:justify-between mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopy}
                        className="bg-white/5 border-white/10 hover:bg-white/10 text-white w-full sm:w-auto"
                    >
                        {copied ? (
                            <><CheckCircle2 className="mr-2 h-4 w-4 text-green-400" /> Copied</>
                        ) : (
                            <><Copy className="mr-2 h-4 w-4" /> Copy Credentials</>
                        )}
                    </Button>
                    <Button type="button" onClick={() => onOpenChange(false)} className="bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto mt-2 sm:mt-0">
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
