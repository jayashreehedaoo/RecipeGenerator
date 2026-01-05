import "server-only";
import axios from "axios";

/**
 * Extract video ID from YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extract Instagram post ID from URL
 */
export function extractInstagramPostId(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([^\/\?]+)/,
    /instagram\.com\/reel\/([^\/\?]+)/,
    /instagram\.com\/reels\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Fetch YouTube video details (title, description)
 */
export async function fetchYouTubeContent(videoId: string): Promise<{
  title: string;
  description: string;
  channelTitle: string;
}> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not configured");
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: apiKey,
        },
      }
    );

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error("Video not found");
    }

    const video = response.data.items[0];
    const snippet = video.snippet;

    return {
      title: snippet.title,
      description: snippet.description,
      channelTitle: snippet.channelTitle,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error("Invalid YouTube API key or quota exceeded");
      }
      if (error.response?.status === 404) {
        throw new Error("YouTube video not found");
      }
    }
    throw new Error("Failed to fetch YouTube video details");
  }
}

/**
 * Fetch Instagram post content (basic scraping - no API needed)
 */
export async function fetchInstagramContent(postId: string): Promise<{
  caption: string;
  username: string;
}> {
  try {
    // Instagram allows fetching oEmbed data without authentication
    const response = await axios.get(
      `https://www.instagram.com/p/${postId}/?__a=1&__d=dis`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
        },
        timeout: 10000,
      }
    );

    const data = response.data;

    // Try to extract caption and username from response
    let caption = "";
    let username = "";

    if (data?.graphql?.shortcode_media) {
      const media = data.graphql.shortcode_media;
      caption = media.edge_media_to_caption?.edges?.[0]?.node?.text || "";
      username = media.owner?.username || "";
    } else if (data?.items?.[0]) {
      const item = data.items[0];
      caption = item.caption?.text || "";
      username = item.user?.username || "";
    }

    if (!caption) {
      throw new Error("Could not extract Instagram content");
    }

    return { caption, username };
  } catch (error) {
    console.error("Instagram fetch error:", error);

    // Fallback: Try oEmbed endpoint (public data only)
    try {
      const oembedResponse = await axios.get(
        "https://www.instagram.com/oembed/",
        {
          params: {
            url: `https://www.instagram.com/p/${postId}/`,
          },
        }
      );

      return {
        caption: oembedResponse.data.title || "",
        username: oembedResponse.data.author_name || "",
      };
    } catch (oembedError) {
      throw new Error(
        "Failed to fetch Instagram content. The post may be private or deleted."
      );
    }
  }
}

/**
 * Determine the platform from URL
 */
export function detectPlatform(
  url: string
): "youtube" | "instagram" | "unsupported" {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }
  if (url.includes("instagram.com")) {
    return "instagram";
  }
  return "unsupported";
}
