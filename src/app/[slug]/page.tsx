import RecipeDisplay from "@/components/recipe";
import { getRecipe } from '@/service/recipe-service';

export default async function SingleRecipe({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug
    const recipe = await getRecipe(slug);

    if (!recipe) {
        return <div>Recipe not found</div>;
    }

    return (
        <RecipeDisplay recipe={recipe} />
    );
}
