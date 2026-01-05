import { getGemini } from "./client";
import { InventoryItem } from "@/types/recipe-generator";
import {
  extractInstagramPostId,
  extractYouTubeVideoId,
  fetchInstagramContent,
  fetchYouTubeContent,
} from "./scraper";

// AI response format (doesn't include DB fields)
export interface GeneratedRecipe {
  name: string;
  description?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty?: string;
  cuisine: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
}

/**
 * Generate a recipe based on inventory items using Gemini
 */
export async function generateRecipeFromInventory(
  inventoryItems: InventoryItem[],
  preferences?: {
    cuisine?: string;
    difficulty?: string;
    dietary?: string;
    maxPrepTime?: number;
  }
): Promise<GeneratedRecipe> {
  console.log("[Gemini AI] Generating recipe from inventory...", {
    itemCount: inventoryItems.length,
    preferences,
  });

  const genAI = getGemini();
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  // Create list of available ingredients
  const inventoryList = inventoryItems
    .map((item) => `- ${item.quantity} ${item.unit} ${item.name}`)
    .join("\n");

  const prompt = `You are a professional chef assistant. Generate a delicious recipe using these available ingredients:

${inventoryList}

${preferences?.cuisine ? `Cuisine preference: ${preferences.cuisine}` : ""}
${preferences?.difficulty ? `Difficulty level: ${preferences.difficulty}` : ""}
${preferences?.dietary ? `Dietary restriction: ${preferences.dietary}` : ""}
${
  preferences?.maxPrepTime
    ? `Maximum prep time: ${preferences.maxPrepTime} minutes`
    : ""
}

Requirements:
1. Use as many of the available ingredients as possible
2. Be creative but practical
3. Provide clear step-by-step instructions
4. Include prep time, cook time, and servings
5. Estimate calories per serving
6. Specify difficulty level (Easy, Medium, or Hard)
7. Assign an appropriate category (Breakfast, Lunch, Dinner, or Snack)

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "name": "Recipe Name",
  "description": "Brief description",
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "difficulty": "Medium",
  "cuisine": "Italian",
  "category": "Dinner",
  "ingredients": ["2 cups flour", "1 tsp salt"],
  "instructions": ["Step 1", "Step 2"],
  "calories": 350
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const content = response.text();

  if (!content) {
    throw new Error("No response from Gemini");
  }

  console.log("[Gemini AI] Raw response:", content);

  try {
    // Remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    }

    // Parse JSON response
    const recipe = JSON.parse(cleanContent) as GeneratedRecipe;
    console.log("[Gemini AI] Recipe generated:", recipe.name);
    return recipe;
  } catch (error) {
    console.error("[Gemini AI] Failed to parse response:", error);
    throw new Error("Invalid recipe format from AI. Please try again.");
  }
}

/**
 * Extract recipe from a URL (blog, YouTube, Instagram) using Gemini
 */
function detectPlatform(url: string): "youtube" | "instagram" | "unsupported" {
  // YouTube URL patterns
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/i;
  // Instagram URL patterns
  const instagramRegex =
    /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(p|reel|tv)\/[\w-]+/i;

  if (youtubeRegex.test(url)) {
    return "youtube";
  }
  if (instagramRegex.test(url)) {
    return "instagram";
  }
  return "unsupported";
}

export async function extractRecipeFromUrl(
  url: string
): Promise<GeneratedRecipe> {
  console.log("[Gemini AI] Extracting recipe from URL...", { url });

  // Detect platform
  const platform = detectPlatform(url);

  if (platform === "unsupported") {
    throw new Error(
      "Unsupported URL. Please use YouTube or Instagram recipe URLs only."
    );
  }

  let content = "";

  // Fetch content based on platform
  if (platform === "youtube") {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const videoData = await fetchYouTubeContent(videoId);
    content = `
Title: ${videoData.title}
Channel: ${videoData.channelTitle}

Description:
${videoData.description}
    `.trim();

    console.log("[Gemini AI] Fetched YouTube content:", {
      title: videoData.title,
      descriptionLength: videoData.description.length,
    });
  } else if (platform === "instagram") {
    const postId = extractInstagramPostId(url);
    if (!postId) {
      throw new Error("Invalid Instagram URL");
    }

    const postData = await fetchInstagramContent(postId);
    content = `
Instagram Post by @${postData.username}

Caption:
${postData.caption}
    `.trim();

    console.log("[Gemini AI] Fetched Instagram content:", {
      username: postData.username,
      captionLength: postData.caption.length,
    });
  }

  if (!content || content.length < 50) {
    throw new Error(
      "Could not extract enough content from the URL. The post may be private or have no recipe information."
    );
  }

  // Send to Gemini for extraction
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `Extract the recipe from this ${platform.toUpperCase()} content:

${content.slice(0, 8000)} // Limit content length

Parse and structure the recipe information:
- Recipe name and description
- Prep time and cook time (in minutes)
- Number of servings
- Difficulty level (Easy, Medium, or Hard)
- Cuisine type
- Category (Breakfast, Lunch, Dinner, or Snack)
- Complete list of ingredients with quantities
- Step-by-step instructions
- Estimated calories per serving

If information is missing, make reasonable estimates based on similar recipes.

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "name": "Recipe Name",
  "description": "Brief description",
  "prepTime": 15,
  "cookTime": 30,
  "servings": 2,
  "difficulty": "Medium",
  "cuisine": "Italian",
  "category": "Dinner",
  "ingredients": ["2 cups flour", "1 tsp salt"],
  "instructions": ["Step 1", "Step 2"],
  "calories": 350
}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Failed to extract recipe from URL");
  }

  try {
    // Clean and parse response
    let cleanContent = text.trim();
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    }

    const recipe = JSON.parse(cleanContent) as GeneratedRecipe;
    console.log("[Gemini AI] Recipe extracted:", recipe.name);
    return recipe;
  } catch (error) {
    console.error("[Gemini AI] Failed to parse response:", error);
    console.error("[Gemini AI] Raw response:", text);
    throw new Error("Invalid recipe format from AI. Please try again.");
  }
}
