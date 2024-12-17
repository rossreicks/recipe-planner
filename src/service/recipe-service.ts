import { db } from "@/db";
import { categories, ingredients, recipes, steps, utensils } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type Recipe = {
	name: string;
	headline: string | null;
	card_link: string | null;
	average_rating: string | null;
	prep_time: string | null;
	ingredients: string[] | null;
	steps: string[] | null;
	favorites_count: string | null;
	ratings_count: string | null;
	difficulty: string | null;
	is_premium: string | null;
	description: string | null;
};

export const getRandomRecipe = async (): Promise<Recipe> => {
	const randomRecipe = await db
		.select({ id: recipes.id })
		.from(recipes)
		.where(
			sql`(SELECT COUNT(*) FROM ingredients WHERE ingredients.recipe_id = recipes.id) > 3`
		)
		.orderBy(sql`RANDOM()`)
		.limit(1);

	const recipeId = randomRecipe[0].id;

	return getRecipeById(recipeId);
};

export const searchRecipes = async (query: string) => {
	const results = await db.all(
		sql`SELECT * FROM search WHERE search MATCH ${query};`
	);

	return results;
};

export const getRecipeById = async (recipeId: number): Promise<Recipe> => {
	const recipeDetails = await db
		.select()
		.from(recipes)
		.leftJoin(categories, eq(recipes.category_id, categories.id))
		.leftJoin(steps, eq(recipes.id, steps.recipe_id))
		.leftJoin(ingredients, eq(ingredients.recipe_id, recipes.id))
		.leftJoin(utensils, eq(utensils.recipe_id, recipes.id))
		.where(eq(recipes.id, recipeId));

	const stepsArray = recipeDetails.map((r) => r.steps?.instructions);
	const ingredientsArray = recipeDetails.map((r) => r.ingredients?.name);

	const stepsSet = new Set(stepsArray.filter((x) => x !== undefined));
	const ingredientsSet = new Set(
		ingredientsArray.filter((x) => x !== undefined)
	);

	const recipe = {
		...recipeDetails[0].recipes,
		id: undefined,
		steps: Array.from(stepsSet),
		ingredients: Array.from(ingredientsSet),
	};

	return recipe;
};

export const getRecipe = async (slug: string) => {
	const recipe = await db
		.select()
		.from(recipes)
		.where(eq(recipes.slug, slug));

	if (!recipe || recipe.length === 0 || !recipe[0].id) {
		return null;
	}

	return getRecipeById(recipe[0].id);
};
