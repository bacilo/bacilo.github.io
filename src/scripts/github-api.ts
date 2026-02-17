export interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  assets: Array<{
    name: string;
    download_count: number;
    size: number;
  }>;
}

interface CachedData {
  data: GitHubRepo;
  timestamp: number;
}

interface CachedReleaseData {
  data: GitHubRelease;
  timestamp: number;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch GitHub repository data from the API with caching and error handling
 * @param owner - GitHub username or organization
 * @param repo - Repository name
 * @returns GitHubRepo data or null if fetch fails
 */
export async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepo | null> {
  const cacheKey = `github-repo-${owner}-${repo}`;

  // Check cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const cachedData: CachedData = JSON.parse(cached);
      const age = Date.now() - cachedData.timestamp;
      if (age < CACHE_DURATION) {
        console.log(`[GitHub API] Using cached data for ${owner}/${repo}`);
        return cachedData.data;
      }
    }
  } catch (err) {
    console.warn('[GitHub API] Cache read error:', err);
  }

  // Fetch from API
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle rate limiting
    if (response.status === 403 || response.status === 429) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      console.warn(
        `[GitHub API] Rate limited for ${owner}/${repo}.`,
        resetDate ? `Resets at ${resetDate.toLocaleTimeString()}` : ''
      );
      return null;
    }

    if (!response.ok) {
      console.error(`[GitHub API] HTTP ${response.status} for ${owner}/${repo}`);
      return null;
    }

    const data: GitHubRepo = await response.json();

    // Update cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (err) {
      console.warn('[GitHub API] Cache write error:', err);
    }

    return data;

  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        console.error(`[GitHub API] Timeout fetching ${owner}/${repo}`);
      } else {
        console.error(`[GitHub API] Error fetching ${owner}/${repo}:`, err.message);
      }
    }
    return null;
  }
}

/**
 * Fetch GitHub release data from the API with caching and error handling
 * @param owner - GitHub username or organization
 * @param repo - Repository name
 * @returns GitHubRelease data or null if fetch fails or no releases found
 */
export async function fetchReleaseStats(owner: string, repo: string): Promise<GitHubRelease | null> {
  const cacheKey = `github-release-${owner}-${repo}`;

  // Check cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const cachedData: CachedReleaseData = JSON.parse(cached);
      const age = Date.now() - cachedData.timestamp;
      if (age < CACHE_DURATION) {
        console.log(`[GitHub API] Using cached data for ${owner}/${repo} releases`);
        return cachedData.data;
      }
    }
  } catch (err) {
    console.warn('[GitHub API] Cache read error:', err);
  }

  // Fetch from API
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle rate limiting
    if (response.status === 403 || response.status === 429) {
      const resetTime = response.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
      console.warn(
        `[GitHub API] Rate limited for ${owner}/${repo}.`,
        resetDate ? `Resets at ${resetDate.toLocaleTimeString()}` : ''
      );
      return null;
    }

    // Handle no releases found
    if (response.status === 404) {
      console.log(`[GitHub API] No releases found for ${owner}/${repo}`);
      return null;
    }

    if (!response.ok) {
      console.error(`[GitHub API] HTTP ${response.status} for ${owner}/${repo} releases`);
      return null;
    }

    const data: GitHubRelease = await response.json();

    // Update cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (err) {
      console.warn('[GitHub API] Cache write error:', err);
    }

    return data;

  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        console.error(`[GitHub API] Timeout fetching ${owner}/${repo} releases`);
      } else {
        console.error(`[GitHub API] Error fetching ${owner}/${repo} releases:`, err.message);
      }
    }
    return null;
  }
}
