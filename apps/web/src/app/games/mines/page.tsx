import { Button } from "@web/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Page() {
    return <div className="px-4">
        <div id="nav">
            <Button variant="secondary" size="icon" className="rounded-full">
                <ArrowLeft />
            </Button>
        </div>
    </div>
}