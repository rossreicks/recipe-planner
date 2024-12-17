import RecipeDisplay from "@/components/recipe";
import { getRandomRecipe } from '@/service/recipe-service';

export default async function Home() {
    const recipe = await getRandomRecipe();

    return (
        <RecipeDisplay recipe={recipe} />
    );
}
