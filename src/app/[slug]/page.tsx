import RecipeDisplay from "@/components/recipe";
import { getRecipe } from '@/service/recipe-service';

export default async function SingleRecipe({ params }: { params: { slug: string } }) {
    const recipe = await getRecipe(params.slug);

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    return (
        <RecipeDisplay recipe={recipe} />
    );
}
