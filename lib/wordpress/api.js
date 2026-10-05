const API_URL = process.env.WORDPRESS_API_URL;
import { isEmpty } from "lodash";
import { unstable_noStore as noStore } from "next/cache";

function isProductionBuild() {
  // Bracket access so the value is read when the page renders, not inlined at compile time.
  return process.env["NEXT_PHASE"] === "phase-production-build";
}

function graphqlTimeoutMs() {
  return isProductionBuild() ? 25000 : 8000;
}

function htmlTimeoutMs() {
  return isProductionBuild() ? 12000 : 5000;
}

function wordpressHeaders(extra = {}) {
  const headers = { ...extra };
  const clientId = process.env.CF_Access_Client_Id;
  const clientSecret = process.env.CF_Access_Client_Secret;

  if (clientId && clientSecret) {
    headers["CF-Access-Client-Id"] = clientId;
    headers["CF-Access-Client-Secret"] = clientSecret;
  }

  return headers;
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError" || error?.name === "TimeoutError") {
      throw new Error(`WordPress request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAPI(
  query = "",
  { variables } = {},
  authToken = ""
) {
  const headers = wordpressHeaders({ "Content-Type": "application/json" });

  if (!isEmpty(authToken)) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (!API_URL) {
    throw new Error("WORDPRESS_API_URL is not set");
  }

  const res = await fetchWithTimeout(
    API_URL,
    {
      headers,
      method: "POST",
      body: JSON.stringify({
        query,
        variables,
      }),
    },
    graphqlTimeoutMs()
  );

  const text = await res.text();
  const trimmed = text.trimStart();

  // Cloudways/Cloudflare error and login pages are HTML. Parsing them with
  // res.json() throws "Unexpected token '<'" and fails the whole function.
  if (!trimmed || trimmed.startsWith("<")) {
    throw new Error(
      `WordPress returned HTML instead of JSON (${res.status}).`
    );
  }

  let json;
  try {
    json = JSON.parse(trimmed);
  } catch {
    throw new Error(`WordPress returned invalid JSON (${res.status}).`);
  }

  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch API");
  }

  return json.data ?? null;
}

export async function loadForStaticPage(label, loader, fallback) {
  try {
    return { value: await loader(), failed: false };
  } catch (error) {
    console.error(`${label}:`, error?.message || error);
    if (!isProductionBuild()) throw error;
    // Opt this render out of the static export so a WordPress timeout cannot fail `next build`.
    noStore();
    return { value: fallback, failed: true };
  }
}

const FONT_FILE_URL = /\.(?:woff2?|ttf|otf|eot)(?:$|[?#])/i;

function stripWordPressFonts(css) {
  if (!css) return "";

  let result = "";
  let index = 0;
  const lower = css.toLowerCase();

  while (index < css.length) {
    const fontFaceAt = lower.indexOf("@font-face", index);
    if (fontFaceAt === -1) {
      result += css.slice(index);
      break;
    }

    result += css.slice(index, fontFaceAt);
    const open = css.indexOf("{", fontFaceAt);
    if (open === -1) {
      break;
    }

    let depth = 0;
    let cursor = open;
    for (; cursor < css.length; cursor++) {
      if (css[cursor] === "{") depth += 1;
      else if (css[cursor] === "}") {
        depth -= 1;
        if (depth === 0) {
          cursor += 1;
          break;
        }
      }
    }
    index = cursor;
  }

  return result.replace(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/gi, (match, _quote, url) =>
    FONT_FILE_URL.test(url) ? "none" : match
  );
}

export async function fetchWordPressStyles(path) {
  const base = String(process.env.BACK_SITE_URL || "").replace(/\/$/, "");
  if (!base || !path) return "";

  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await fetchWithTimeout(
      url,
      { headers: wordpressHeaders() },
      htmlTimeoutMs()
    );
    if (!res.ok) return "";

    const html = await res.text();
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (!styleMatches) return "";

    return stripWordPressFonts(
      styleMatches
        .map((styleTag) => styleTag.replace(/<\/?style[^>]*>/g, ""))
        .join("\n")
    );
  } catch (error) {
    console.error(
      "Failed to load WordPress styles:",
      error?.message || error
    );
    return "";
  }
}
