'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Lightbulb, ChefHat, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface Suggestion {
    dishName: string;
    description: string;
    reasoning: string;
}

// This is a mock response to simulate the AI flow
const mockSuggestions: { [key: string]: Suggestion } = {
    "indian_lunch_vegetarian": {
        dishName: "Paneer Butter Masala",
        description: "A rich and creamy dish of paneer (Indian cheese) in a tomato, butter and cashew sauce.",
        reasoning: "Based on your preference for a vegetarian Indian lunch, Paneer Butter Masala is a classic, popular, and satisfying choice that pairs well with naan or rice. It offers a perfect balance of flavors."
    },
    "italian_dinner_any": {
        dishName: "Spaghetti Carbonara",
        description: "A classic Roman pasta dish made with eggs, hard cheese, cured pork, and black pepper.",
        reasoning: "For an Italian dinner, Spaghetti Carbonara is an authentic and flavorful option. It's relatively quick to prepare and provides a comforting, savory meal without specific dietary restrictions."
    },
    "mexican_snack_vegan": {
        dishName: "Guacamole with Tortilla Chips",
        description: "A simple yet delicious dip made from mashed avocados, onions, cilantro, and lime juice.",
        reasoning: "As a vegan Mexican snack, guacamole is a perfect choice. It's naturally plant-based, healthy, and incredibly easy to make. It's a crowd-pleaser that fits your criteria perfectly."
    }
}


export function DecisionMaker() {
    const [cuisine, setCuisine] = useState("");
    const [mealType, setMealType] = useState("");
    const [diet, setDiet] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

    const getSuggestion = async () => {
        if (!cuisine || !mealType || !diet) return;

        setLoading(true);
        setSuggestion(null);

        // Simulate API call to AI flow
        await new Promise(resolve => setTimeout(resolve, 1500));

        const key = `${cuisine}_${mealType}_${diet}`.toLowerCase();
        const fallbackKey = `${cuisine}_${mealType}_any`.toLowerCase();
        const result = mockSuggestions[key] || mockSuggestions[fallbackKey] || Object.values(mockSuggestions)[0];
        
        setSuggestion(result);
        setLoading(false);
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Find Your Next Meal</CardTitle>
                <CardDescription>Answer a few questions and our AI will suggest a dish for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="cuisine">Cuisine</Label>
                        <Select value={cuisine} onValueChange={setCuisine}>
                            <SelectTrigger id="cuisine">
                                <SelectValue placeholder="Select a cuisine" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="indian">Indian</SelectItem>
                                <SelectItem value="italian">Italian</SelectItem>
                                <SelectItem value="mexican">Mexican</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="meal-type">Meal Type</Label>
                        <Select value={mealType} onValueChange={setMealType}>
                            <SelectTrigger id="meal-type">
                                <SelectValue placeholder="Select a meal type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="diet">Dietary Preference</Label>
                         <Select value={diet} onValueChange={setDiet}>
                            <SelectTrigger id="diet">
                                <SelectValue placeholder="Select a diet" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={getSuggestion} disabled={!cuisine || !mealType || !diet || loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Thinking...
                        </>
                    ) : (
                        <>
                            <ChefHat className="mr-2 h-4 w-4" />
                            Get Suggestion
                        </>
                    )}
                </Button>
            </CardFooter>
            {suggestion && (
                <div className="p-6 border-t">
                    <Alert>
                        <Lightbulb className="h-4 w-4 text-accent" />
                        <AlertTitle className="text-accent text-2xl font-bold">{suggestion.dishName}</AlertTitle>
                        <AlertDescription className="mt-4 space-y-4">
                            <p className="text-lg">{suggestion.description}</p>
                            <div>
                                <h4 className="font-semibold text-foreground">AI Reasoning:</h4>
                                <p>{suggestion.reasoning}</p>
                            </div>
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </Card>
    );
}
