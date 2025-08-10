import { DecisionMaker } from "@/components/decision-maker";

export default function DecisionSupportPage() {
    return (
        <div className="container mx-auto max-w-4xl py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">AI Cooking Assistant</h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Let upliance.ai help you decide what to cook next!
                </p>
            </div>
            <DecisionMaker />
        </div>
    );
}
